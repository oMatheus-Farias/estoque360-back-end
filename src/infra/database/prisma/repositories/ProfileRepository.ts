import { IProfileRepository } from '@application/contracts/repositories/IProfileRepository';
import { Profile } from '@application/entities/Profile';
import { prisma } from '@infra/clients/prismaClient';
import { Injectable } from '@kermel/decorators/Injectable';

@Injectable()
export class ProfileRepository implements IProfileRepository {
  async create(profile: Profile): Promise<void> {
    await prisma.profile.create({
      data: {
        id: profile.id,
        accountId: profile.accountId,
        name: profile.name,
        phone: profile.phone,
        avatar: profile.avatar,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  }

  async findByAccountId(accountId: string): Promise<Profile | null> {
    const profile = await prisma.profile.findUnique({
      where: { accountId },
    });

    if (!profile) return null;

    return new Profile({
      id: profile.id,
      accountId: profile.accountId,
      name: profile.name,
      phone: profile.phone,
      avatar: profile.avatar,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    });
  }

  async update(id: string, data: Partial<Profile.CreateData>): Promise<Profile> {
    const profile = await prisma.profile.update({
      where: { id },
      data,
    });

    return new Profile({
      id: profile.id,
      accountId: profile.accountId,
      name: profile.name,
      phone: profile.phone,
      avatar: profile.avatar,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    });
  }
}
