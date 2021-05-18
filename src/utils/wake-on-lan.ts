import { wake } from 'wake_on_lan';

export function wakeOnLan(macAddress: string) {
  return new Promise<void>((res, rej) => {
    wake(macAddress, (err) => {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
}
