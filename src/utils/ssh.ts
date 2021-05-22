import { ChildProcess, fork } from 'child_process';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { SshExecutionResult } from '../daemons/ssh-daemon/models/ssh-execution-result';

const resultReceivedEvent = new EventEmitter();

const executionQueue = [] as {
  uuid: string, command: string, timeout: number, allocateTimeoutTimer: NodeJS.Timeout
}[];

const sshDaemons = {} as { [index: number]: { isReady: boolean, process: ChildProcess } };
for (let i = 0; i < 4; i++) {
  sshDaemons[i] = {
    isReady: false,
    process: null,
  };
  (function run() {
    sshDaemons[i].process = fork(__dirname + '/../daemons/ssh-daemon')
      .on('message', (message: string) => {
        const response = JSON.parse(message);
        if (response.uuid) {
          resultReceivedEvent.emit(response.uuid, response.result);
        }

        if (executionQueue.length > 0) {
          const { uuid, command, timeout, allocateTimeoutTimer } = executionQueue.shift();
          // 解除指派逾時
          clearTimeout(allocateTimeoutTimer);
          sshDaemons[i].process.send(JSON.stringify({ uuid, command, timeout }));
        } else {
          sshDaemons[i].isReady = true;
        }
      })
      .on('exit', () => {
        sshDaemons[i].isReady = false;
        setTimeout(() => {
          run();
        }, 1000);
      });
  })();
}

export interface SshOptions {
  timeout?: number;
  independent?: boolean;
}

export function ssh(command: string, options?: SshOptions): Promise<SshExecutionResult> {
  return new Promise((res, rej) => {
    const timeout = options?.timeout ?? 3000;
    const independent = options?.independent ?? false;
    const uuid = uuidv4();

    // 註冊接收執行結果的事件
    resultReceivedEvent.once(uuid, (result: SshExecutionResult) => {
      res(result);
    });

    if (independent) {
      const allocateTimeoutTimer = setTimeout(() => {
        resultReceivedEvent.removeAllListeners(uuid);
        rej("[SshUtil] Allocation timed out.")
      }, 5000);
      const sshDaemonProcess = fork(__dirname + '/../daemons/ssh-daemon')
        .on('message', (message: string) => {
          const response = JSON.parse(message);
          if (response.uuid) {
            resultReceivedEvent.emit(response.uuid, response.result);
            sshDaemonProcess.kill('SIGKILL');
          } else {
            clearTimeout(allocateTimeoutTimer);
            sshDaemonProcess.send(JSON.stringify({ uuid, command, timeout }));
          }
        });
      return;
    }

    const firstReadySshDaemon = Object.values(sshDaemons).find(daemon => daemon.isReady);
    if (firstReadySshDaemon) {
      firstReadySshDaemon.isReady = false;
      firstReadySshDaemon.process.send(JSON.stringify({ uuid, command, timeout }));
      return;
    }

    // 設定指派逾時
    const allocateTimeoutTimer = setTimeout(() => {
      const executionIndex = executionQueue.findIndex(execution => execution.uuid == uuid);
      if (executionIndex != -1) {
        executionQueue.splice(executionIndex, 1);
      }
      resultReceivedEvent.removeAllListeners(uuid);
      rej("[SshUtil] Allocation timed out.")
    }, 1000);
    executionQueue.push({ uuid, command, timeout, allocateTimeoutTimer });
  });
}
