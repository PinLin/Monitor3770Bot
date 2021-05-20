import { ChildProcess, fork } from 'child_process';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { SshExecutionResult } from '../models/ssh-execution-result';

let sshDaemon: ChildProcess;
(function run() {
  sshDaemon = fork(__dirname + '/../daemons/ssh-daemon');
  sshDaemon.on('exit', () => {
    setTimeout(() => {
      run();
    }, 1000); // 連線失敗的話每過一秒重試一次
  });
})()

const resultReceivedEvent = new EventEmitter();

sshDaemon.on('message', (message: string) => {
  const { uuid, result } = JSON.parse(message) as { uuid: string, result: SshExecutionResult };
  resultReceivedEvent.emit(uuid, result);
});

export function ssh(command: string): Promise<SshExecutionResult> {
  return new Promise((res, rej) => {
    const uuid = uuidv4();

    // 註冊接收執行結果的事件
    resultReceivedEvent.once(uuid, (result: SshExecutionResult) => {
      res(result);
    });

    // 要求執行指令
    sshDaemon.send(JSON.stringify({ uuid, command }), (err) => {
      if (err) {
        rej(err);
      }
    });
  });
}
