import { prisma } from '@infra/clients/prismaClient';
import { Injectable } from '@kermel/decorators/Injectable';
import { Profile } from '@shared/entities/Profile';
import { CreateProfileInput } from '@shared/types/account/AccountTypes';
import { randomUUID } from 'crypto';

@Injectable()
export class ProfileRepository {
  async create(data: CreateProfileInput): Promise<Pick<Profile, 'id'>> {
    const profile = await prisma.profile.create({
      data: {
        id: randomUUID(),
        accountId: data.accountId,
        name: data.name,
        phone: data.phone,
        avatar: data.avatar,
      },
    });

    return {
      id: profile.id,
    };
  }

  async findByAccountId(accountId: string): Promise<Profile | null> {
    const profile = await prisma.profile.findUnique({
      where: { accountId },
    });

    if (!profile) return null;

    return {
      id: profile.id,
      accountId: profile.accountId,
      name: profile.name,
      phone: profile.phone,
      avatar: profile.avatar,
    };
  }

  async update(id: string, data: Partial<Omit<CreateProfileInput, 'accountId'>>): Promise<Profile> {
    const profile = await prisma.profile.update({
      where: { id },
      data,
    });

    return {
      id: profile.id,
      accountId: profile.accountId,
      name: profile.name,
      phone: profile.phone,
      avatar: profile.avatar,
    };
  }
}
