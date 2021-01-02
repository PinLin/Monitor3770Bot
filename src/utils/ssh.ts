import { promisify } from 'util';
import { Client } from 'ssh2';

export interface SshExecResult {
  stdout: string;
  stderr: string;
}

export interface SshConnectConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

export function ssh(connectConfig: SshConnectConfig, command: string): Promise<SshExecResult> {
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
        const stream = await promisify(connection.exec).bind(connection)(command);
        stream.on('close', () => {
          connection.end();
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
