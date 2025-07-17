import { prisma } from '@infra/clients/prismaClient';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class GetAccountDetailsQuery {
  async execute({ accountId }: GetAccountDetailsQuery.Input): Promise<GetAccountDetailsQuery.Output> {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      select: {
        id: true,
        email: true,
        googleId: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return {
      account: {
        id: account?.id as string,
        email: account?.email as string,
        googleId: account?.googleId as string,
        role: account?.role as string,
        status: account?.status as boolean,
        createdAt: account?.createdAt as Date,
        updatedAt: account?.updatedAt as Date,
      },
      profile: {
        id: account?.profile?.id as string,
        name: account?.profile?.name as string,
        phone: account?.profile?.phone as string | null,
        avatar: account?.profile?.avatar as string | null,
        createdAt: account?.profile?.createdAt as Date,
        updatedAt: account?.profile?.updatedAt as Date,
      },
    };
  }
}

export namespace GetAccountDetailsQuery {
  export type Input = {
    accountId: string;
  };

  export type Output = {
    account: {
      id: string;
      email: string;
      googleId: string | null;
      role: string;
      status: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
    profile: {
      id: string;
      name: string;
      phone: string | null;
      avatar: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}
