import { RefreshToken } from '@application/entities/RefreshToken';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export abstract class IRefreshTokenRepository {
  abstract findById(data: Pick<RefreshToken, 'id'>): Promise<RefreshToken | null>;
  abstract findAllByAccountId(data: Pick<RefreshToken, 'accountId'>): Promise<RefreshToken[] | []>;
  abstract create(data: RefreshToken): Promise<Pick<RefreshToken, 'id'>>;
  abstract deleteAll(data: Pick<RefreshToken, 'accountId'>): Promise<void>;
}
