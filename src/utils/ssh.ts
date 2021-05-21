import { ChildProcess, fork } from 'child_process';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { SshExecutionResult } from '../models/ssh-execution-result';

const resultReceivedEvent = new EventEmitter();

const executionQueue = [] as { uuid: string, command: string, allocateTimeoutTimer: NodeJS.Timeout }[];

let sshDaemonIsReady = false;
let sshDaemon: ChildProcess;
(function run() {
  sshDaemon = fork(__dirname + '/../daemons/ssh-daemon');
  sshDaemon.on('message', (message: string) => {
    const response = JSON.parse(message);
    if (response.uuid) {
      resultReceivedEvent.emit(response.uuid, response.result);
    }

    if (executionQueue.length > 0) {
      const { uuid, command, allocateTimeoutTimer } = executionQueue.shift();
      // 解除指派逾時
      clearTimeout(allocateTimeoutTimer);
      sshDaemon.send(JSON.stringify({ uuid, command }));
    } else {
      sshDaemonIsReady = true;
    }
  });
  sshDaemon.on('exit', () => {
    sshDaemonIsReady = false;
    setTimeout(() => {
      run();
    }, 1000);
  });
})();

export function ssh(command: string): Promise<SshExecutionResult> {
  return new Promise((res, rej) => {
    const uuid = uuidv4();

    // 註冊接收執行結果的事件
    resultReceivedEvent.once(uuid, (result: SshExecutionResult) => {
      res(result);
    });

    if (sshDaemonIsReady) {
      sshDaemonIsReady = false;
      sshDaemon.send(JSON.stringify({ uuid, command }));
    } else {
      // 設定指派逾時
      const allocateTimeoutTimer = setTimeout(() => {
        const executionIndex = executionQueue.findIndex(execution => execution.uuid == uuid);
        if (executionIndex != -1) {
          executionQueue.splice(executionIndex, 1);
        }
        resultReceivedEvent.removeAllListeners(uuid);
        rej("[SshUtil] Execution timed out.")
      }, 1500);
      executionQueue.push({ uuid, command, allocateTimeoutTimer });
    }
  });
}
