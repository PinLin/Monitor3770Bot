import { EventEmitter } from 'events';
import { config } from 'dotenv';
import { Client } from 'ssh2';
import { SshExecResult } from '../models/ssh-exec-result';

config();

const {
  TARGET_IP_ADDRESS, TARGET_SSH_PORT, TARGET_USERNAME, TARGET_PASSWORD
} = process.env;

const connection = new Client();

function executeCommand(command: string): Promise<SshExecResult> {
  console.log('[SshUtil] Execute command: ' + command);

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

const commandQueue = [] as { uuid: string, command: string }[];
const commandAddedEvent = new EventEmitter();

// 接收外部要求執行的指令
process.on('message', (message: string) => {
  commandQueue.push(JSON.parse(message));
  commandAddedEvent.emit('start');
});

// 建立與目標的連線
connection.on('ready', () => {
  console.log("[SshUtil] Connected.");

  (function run() {
    commandAddedEvent.once('start', async () => {
      // 如果指令佇列一直不為空
      while (commandQueue.length > 0) {
        // 取出指令來執行
        const { uuid, command } = commandQueue.shift();
        const result = await executeCommand(command);

        // 回傳指令執行結果
        process.send(JSON.stringify({ uuid, result }));
      }

      commandAddedEvent.once('start', run);
    }).emit('start');
  })();
}).on('error', () => {
  console.log("[SshUtil] Failed to connect.");
  process.exit();
}).connect({
  host: TARGET_IP_ADDRESS,
  port: Number(TARGET_SSH_PORT) ?? 22,
  username: TARGET_USERNAME,
  password: TARGET_PASSWORD,
  readyTimeout: 1000,
});
