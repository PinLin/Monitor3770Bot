import { ChildProcess, fork } from 'child_process';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { SshExecResult } from '../models/ssh-exec-result';

let sshDaemon: ChildProcess;
(function run() {
  sshDaemon = fork(__dirname + '/ssh-daemon');
  sshDaemon.on('exit', () => {
    setTimeout(() => {
      run();
    }, 1000);
  });
})()

const resultReceivedEvent = new EventEmitter();

sshDaemon.on('message', (message: string) => {
  const { uuid, result } = JSON.parse(message) as { uuid: string, result: SshExecResult };
  resultReceivedEvent.emit(uuid, result);
});

export function ssh(command: string): Promise<SshExecResult> {
  return new Promise((res, rej) => {
    const uuid = uuidv4();

    // 要求執行指令
    sshDaemon.send(JSON.stringify({ uuid, command }), (err) => {
      if (err) {
        rej(err);
      }
    });

    resultReceivedEvent.once(uuid, (result: SshExecResult) => {
      res(result);
    });

    setTimeout(() => {
      resultReceivedEvent.removeAllListeners(uuid);
      rej('SshExecTimeout');
    }, 3000);
  });
}
