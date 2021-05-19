import { EventEmitter } from 'events';
import { config } from 'dotenv';
import { Client } from 'ssh2';
import { execute } from './execute';

config();

const commandQueue = [] as { uuid: string, command: string }[];
const queueAddedEvent = new EventEmitter();

// 接收外部要求執行的指令
process.on('message', (message: string) => {
  commandQueue.push(JSON.parse(message));
  queueAddedEvent.emit('start');
});

// 建立與目標的連線
const connection = new Client();
connection.on('ready', () => {
  console.log("[SshDaemon] Connected.");

  // 註冊指令佇列新增的事件
  (function run() {
    queueAddedEvent.once('start', async () => {
      // 如果指令佇列一直不為空
      while (commandQueue.length > 0) {
        // 取出指令來執行
        const { uuid, command } = commandQueue.shift();
        const result = await execute(connection, command);

        // 回傳指令執行結果
        process.send(JSON.stringify({ uuid, result }));
      }

      queueAddedEvent.once('start', run);
    }).emit('start');
  })();
}).on('error', () => {
  console.log("[SshDaemon] Failed to connect.");
  process.exit();
}).connect({
  host: process.env.TARGET_IP_ADDRESS,
  port: Number(process.env.TARGET_SSH_PORT) ?? 22,
  username: process.env.TARGET_USERNAME,
  password: process.env.TARGET_PASSWORD,
  readyTimeout: 1000,
});
