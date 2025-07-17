import '@fastify/jwt';

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    payload: {
      accountId: string;
      email: string;
      role: string;
      iat?: number;
      exp?: number;
    };
    user: {
      accountId: string;
      email: string;
      role: string;
    };
  }
}
