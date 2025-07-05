import { Injectable } from '@kermel/decorators/Injectable';

import { env } from './env';

@Injectable()
export class AppConfig {
  readonly database: AppConfig.Database;

  constructor() {
    this.database = {
      prisma: {
        url: env.DATABASE_URL,
      },
    };
  }
}

export namespace AppConfig {
  export type Database = {
    prisma: {
      url: string;
    };
  };
}
