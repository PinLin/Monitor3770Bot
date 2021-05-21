import { config } from 'dotenv';
import { Client } from 'ssh2';
import { execute } from './execute';

config();

// 建立與目標的連線
const connection = new Client();
connection.on('ready', () => {
  console.log("[SshDaemon] Connected.");

  // 接收外部要求執行的指令
  process.on('message', async (message: string) => {
    const { uuid, command } = JSON.parse(message);

    // 執行指令並回傳結果
    const result = await execute(connection, command);
    process.send(JSON.stringify({ uuid, result }));
  });

  // 準備接收要執行的指令
  process.send(JSON.stringify({}));
}).on('error', () => {
  console.log("[SshDaemon] Failed to connect.");

  // 如果建立連線失敗就把自己關掉
  process.exit();
}).connect({
  host: process.env.TARGET_IP_ADDRESS,
  port: Number(process.env.TARGET_SSH_PORT) ?? 22,
  username: process.env.TARGET_USERNAME,
  password: process.env.TARGET_PASSWORD,
  readyTimeout: 4000,
  keepaliveInterval: 500,
});
