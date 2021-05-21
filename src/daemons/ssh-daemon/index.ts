import { config } from 'dotenv';
import { Client } from 'ssh2';
import { SshExecutionResult } from '../../models/ssh-execution-result';

config();

// 建立與目標的連線
const connection = new Client();
connection.on('ready', () => {
  console.log("[SshDaemon] Connected.");

  // 接收外部要求執行的指令
  process.on('message', async (message: string) => {
    const { uuid, command } = JSON.parse(message);

    console.log('[SshDaemon] Execute command: ' + command);

    // 執行指令並回傳結果
    connection.exec(command, (err, stream) => {
      const result = {
        code: NaN,
        stdout: '',
        stderr: '',
      } as SshExecutionResult;

      stream.on('close', (code) => {
        // 回傳指令執行結果
        result.code = code;
        process.send(JSON.stringify({ uuid, result }));
      }).stdout.on('data', (data) => {
        result.stdout += data;
      }).stderr.on('data', (data) => {
        result.stderr += data;
      });
    });
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
