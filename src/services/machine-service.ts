import { ping } from '../utils/ping';

export class MachineService {
  constructor(
    public ipAddress: string,
  ) { }

  isPowerOn() {
    console.log("[MachineService] Getting power on status...")

    return ping(this.ipAddress);
  }
}
