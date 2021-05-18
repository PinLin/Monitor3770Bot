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

export interface SshOptions {
  timeout?: number; // 執行逾時，單位為毫秒
}

export function ssh(command: string, options?: SshOptions): Promise<SshExecutionResult> {
  return new Promise((res, rej) => {
    const uuid = uuidv4();

    // 註冊接收執行結果的 handler
    resultReceivedEvent.once(uuid, (result: SshExecutionResult) => {
      res(result);
    });

    // 設定執行逾時
    if (options?.timeout) {
      setTimeout(() => {
        resultReceivedEvent.removeAllListeners(uuid);
        rej("Execution timeout.");
      }, options.timeout);
    }

    // 要求執行指令
    sshDaemon.send(JSON.stringify({ uuid, command }), (err) => {
      if (err) {
        rej(err);
      }
    });
  });
}
