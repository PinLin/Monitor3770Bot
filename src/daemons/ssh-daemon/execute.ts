import { Client } from 'ssh2';
import { SshExecutionResult } from '../../models/ssh-execution-result';

export function execute(connection: Client, command: string): Promise<SshExecutionResult> {
  console.log('[SshDaemon] Execute command: ' + command);

  return new Promise((res, rej) => {
    // 執行指令
    connection.exec(command, (err, stream) => {
      if (err) {
        rej(err);
      }

      const result = {
        code: NaN,
        stdout: '',
        stderr: '',
      } as SshExecutionResult;

      stream.on('close', (code) => {
        // 回傳指令執行結果
        result.code = code;
        res(result);
      }).stdout.on('data', (data) => {
        result.stdout += data;
      }).stderr.on('data', (data) => {
        result.stderr += data;
      });
    });
  });
}
