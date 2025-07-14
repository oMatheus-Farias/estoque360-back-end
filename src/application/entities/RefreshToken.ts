import KSUID from 'ksuid';

export class RefreshToken {
  readonly id: string;
  readonly accountId: string;
  readonly expiresAt: Date;
  readonly createdAt: Date;

  constructor(attr: RefreshToken.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.accountId = attr.accountId;
    this.expiresAt = attr.expiresAt ?? new Date();
    this.createdAt = attr.createdAt ?? new Date();
  }

  static create(data: RefreshToken.CreateData): RefreshToken {
    return new RefreshToken({
      id: data.id ?? KSUID.randomSync().string,
      accountId: data.accountId,
      expiresAt: data.expiresAt,
    });
  }
}

export namespace RefreshToken {
  export type Attributes = {
    id: string;
    accountId: string;
    expiresAt: Date;
    createdAt?: Date;
  };

  export type CreateData = {
    id?: string;
    accountId: string;
    expiresAt: Date;
  };
}
