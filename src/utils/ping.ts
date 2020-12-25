import pingLib from 'ping';

export async function ping(host: string) {
  const response = await pingLib.promise.probe(host, {
    timeout: 0.5,
  });
  return response.alive;
}
