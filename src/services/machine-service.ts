import { OnlineUser } from '../models/online-user';
import { UpTime } from '../models/up-time';
import { ssh } from '../utils/ssh';
import { wakeOnLan } from '../utils/wake-on-lan';

export class MachineService {
  constructor(
    public name: string,
    public ipAddress: string,
    public macAddress: string,
  ) { }

  async executeCommand(command: string) {
    console.log(`[MachineService] Executing command: ${command}...`);

    try {
      return await ssh(command);
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
      return false;
    }
  }

  async cancelPowerOff() {
    console.log("[MachineService] Canceling power-off...");

    try {
      await ssh('shutdown -a');

      return true;
    } catch (e) {
      return false;
    }
  }

  async getUpTime() {
    console.log("[MachineService] Getting uptime...");

    try {
      const { stdout } = await ssh(
        'powershell -c "(get-date) - (gcim Win32_OperatingSystem).LastBootUpTime"');

      let upTimeStrings = stdout.split('\n');
      upTimeStrings = upTimeStrings.slice(2, 6);
      const fields = upTimeStrings.map((upTimeString) => {
        return upTimeString.split(': ')[1];
      });

      return {
        days: Number(fields[0]),
        hours: Number(fields[1]),
        minutes: Number(fields[2]),
        seconds: Number(fields[3]),
      } as UpTime;
    } catch (e) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      } as UpTime;
    }
  }

  async getOnlineUsers() {
    console.log("[MachineService] Getting online users...");

    try {
      const { stdout } = await ssh('chcp 65001 & query user');

      const userStrings = stdout.split('\r\n');
      userStrings.splice(0, 2);
      userStrings.splice(userStrings.length - 1, 1);
      return userStrings.map((userString) => {
        const fields = [] as string[];
        userString.split(' ').forEach((field) => {
          if (field != '') {
            fields.push(field);
          }
        });

        const [year, month, day] = fields[fields.length - 3].split('/').map((s) => Number(s));
        let [hour, minute] = fields[fields.length - 1].split(':').map((s) => Number(s));
        if (fields[fields.length - 2] != '�W��') {
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
      return [];
    }
  }

  async sendMessage(username: string, messageText: string) {
    console.log(`[MachineService] Sending message to ${username}...`);

    try {
      await ssh(`msg ${username} ${messageText}`);

      return true;
    } catch (e) {
      return false;
    }
  }
}
