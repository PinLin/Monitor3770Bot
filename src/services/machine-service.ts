import { OnlineUser } from '../models/online-user';
import { UpTime, UpTimeDefaultValue } from '../models/up-time';
import { ssh } from '../utils/ssh';
import { wakeOnLan } from '../utils/wake-on-lan';

export class MachineService {
  constructor(
    public name: string,
    public ipAddress: string,
    public macAddress: string,
  ) { }

  private sshWithUtf8(command: string) {
    // 執行指令前先變更編碼為 UTF-8
    return ssh('chcp 65001 & ' + command);
  }

  async executeCommand(command: string) {
    console.log(`[MachineService] Executing command: ${command}...`);

    try {
      return await ssh(command, { timeout: 0, independent: true });
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async isPowerOn() {
    console.log("[MachineService] Getting power on status...");

    try {
      await ssh('echo hi');

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async powerOn() {
    console.log("[MachineService] Powering on...");

    try {
      await wakeOnLan(this.macAddress);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async powerOff(delayMinutes: number) {
    console.log(`[MachineService] Powering off after ${delayMinutes} minute(s)...`);

    try {
      await ssh(`shutdown -a & shutdown -s -f -t ${delayMinutes * 60}`);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async cancelPowerOff() {
    console.log("[MachineService] Canceling power-off...");

    try {
      await ssh('shutdown -a');

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async getUpTime() {
    console.log("[MachineService] Getting uptime...");

    try {
      const command = 'powershell -c "(get-date) - (gcim Win32_OperatingSystem).LastBootUpTime"'
      const { stdout } = await ssh(command);

      const upTimeStrings = stdout.split('\n').slice(2, 6);
      const [
        days, hours, minutes, seconds
      ] = upTimeStrings.map(upTimeString => Number(upTimeString.split(': ')[1]));

      return { days, hours, minutes, seconds } as UpTime;
    } catch (e) {
      console.log(e);
      return UpTimeDefaultValue;
    }
  }

  async getOnlineUsers() {
    console.log("[MachineService] Getting online users...");

    try {
      const { stdout } = await this.sshWithUtf8('query user');

      const userStrings = stdout.split('\r\n');
      userStrings.splice(0, 2);
      userStrings.splice(userStrings.length - 1, 1);
      return userStrings.map((userString) => {
        const fields = userString.split(' ').filter(field => field != '');
        const [
          year, month, day
        ] = fields[fields.length - 3].split('/').map((s) => Number(s));
        let [
          hour, minute
        ] = fields[fields.length - 1].split(':').map((s) => Number(s));
        if (fields[fields.length - 2] != '�W��' && hour != 12) {
          hour += 12;
        }
        const loginTime = new Date();
        loginTime.setFullYear(year, month - 1, day);
        loginTime.setHours(hour, minute);
        return {
          name: fields[0],
          isConnected: fields[fields.length - 5] == 'Active',
          loginTime,
        } as OnlineUser;
      })
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async sendMessage(username: string, messageText: string) {
    console.log(`[MachineService] Sending message to ${username}...`);

    try {
      await ssh(`msg ${username} ${messageText}`);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
