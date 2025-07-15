import { Injectable } from '@kermel/decorators/Injectable';
import { env } from '@shared/env/env';
import jwt from 'jsonwebtoken';

@Injectable()
export class JWTService {
  async generateToken(payload: { accountId: string; email: string; role: string }, expiresIn = '1h'): Promise<string> {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn } as any);
  }

  async verifyToken(token: string): Promise<{ accountId: string; email: string; role: string }> {
    return jwt.verify(token, env.JWT_SECRET) as { accountId: string; email: string; role: string };
  }
}
