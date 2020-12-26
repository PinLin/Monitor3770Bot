import { UpTime } from '../models/up-time';
import { ping } from '../utils/ping';
import { ssh } from '../utils/ssh';

export class MachineService {
  constructor(
    public ipAddress: string,
    private username: string,
    private password: string,
    private sshPort: number,
  ) { }

  isPowerOn() {
    console.log("[MachineService] Getting power on status...")

    return ping(this.ipAddress);
  }

  async getUpTime() {
    console.log("[MachineService] Getting uptime...")

    try {
      const { stdout } = await ssh({
        host: this.ipAddress,
        port: this.sshPort,
        username: this.username,
        password: this.password,
      }, 'powershell -c "(get-date) - (gcim Win32_OperatingSystem).LastBootUpTime"');

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
}
