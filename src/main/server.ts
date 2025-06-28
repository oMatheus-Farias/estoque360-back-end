import { env } from '@shared/env/env';

import { app } from './app';

async function main() {
  try {
    const PORT = env.PORT;
    const host = await app.listen({ port: PORT });
    console.log(`Server listening at ${host} 🚀`);
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
}
main();
