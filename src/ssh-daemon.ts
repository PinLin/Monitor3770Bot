import { EventEmitter } from 'events';
import { config } from 'dotenv';
import { Client } from 'ssh2';
import { SshExecResult } from './models/ssh-exec-result';

config();

const {
  TARGET_IP_ADDRESS, TARGET_SSH_PORT, TARGET_USERNAME, TARGET_PASSWORD
} = process.env;

const connection = new Client();

function executeCommand(command: string): Promise<SshExecResult> {
  console.log('[SshDaemon] Execute command: ' + command);

  return new Promise((res, rej) => {
    // 執行指令
    connection.exec(command, (err, stream) => {
      if (err) {
        rej(err);
      }

      const result = {
        code: 0,
        stdout: '',
        stderr: '',
      } as SshExecResult;

      stream.on('close', () => {
        // 回傳指令執行結果
        res(result);
      }).stdout.on('data', (data) => {
        result.stdout += data;
      }).stderr.on('data', (data) => {
        result.stderr += data;
      });
    });
  });
}

const commandQueue = [] as string[];
const commandAddedEvent = new EventEmitter();

// 接收外部要求執行的指令
process.on('message', (command: string) => {
  commandQueue.push(command);
  commandAddedEvent.emit('start');
});

// 建立與目標的連線
connection.on('ready', () => {
  console.log("[SshDaemon] Connected.");

  (function run() {
    // 註冊指令增加的事件
    commandAddedEvent.once('start', async () => {
      // 如果指令佇列一直不為空
      while (commandQueue.length > 0) {
        // 取出指令來執行
        const command = commandQueue.shift();
        const result = await executeCommand(command);

        // 回傳指令執行結果
        process.send(JSON.stringify(result));
      }

      // 重新註冊事件
      commandAddedEvent.once('start', run);
    }).emit('start');
  })();
}).on('error', () => {
  console.log("[SshDaemon] Failed to connect.");
}).connect({
  host: TARGET_IP_ADDRESS,
  port: Number(TARGET_SSH_PORT) ?? 22,
  username: TARGET_USERNAME,
  password: TARGET_PASSWORD,
});
