import { promisify } from 'util';
import { Client } from 'ssh2';

export interface SshExecResult {
  stdout: string;
  stderr: string;
}

export function ssh(connectConfig: {
  host: string;
  port: number;
  username: string;
  password: string;
}, command: string): Promise<SshExecResult> {
  const connection = new Client();

  return new Promise((res, rej) => {
    const readyTimeout = setTimeout(() => {
      rej("SSH connection timed out.");
    }, 500);

    connection.on('ready', async () => {
      clearTimeout(readyTimeout);

      let result = {
        stdout: '',
        stderr: '',
      } as SshExecResult;

      try {
        const stream = await promisify(connection.exec).bind(connection)('chcp 65001&' + command);
        stream.on('close', () => {
          connection.end();

          const tempStdout = result.stdout.split('\r\n')
          tempStdout.splice(0, 1);
          result.stdout = tempStdout.join('\n');
          res(result);
        }).stdout.on('data', (data) => {
          result.stdout += data;
        }).stderr.on('data', (data) => {
          result.stderr += data;
        });
      } catch (e) {
        rej(e);
      }
    }).on('error', () => {
    }).connect(connectConfig);
  });
}
