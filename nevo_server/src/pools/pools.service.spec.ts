import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PoolsService, ChainPoolData } from './pools.service';
import { Pool } from './pool.entity';

describe('PoolsService', () => {
  const chainData: ChainPoolData = {
    contractPoolId: 'pool-1',
    creatorWallet: 'GWALLET',
    goal: '10000',
  };

  it('creates a new pool when none exists', async () => {
    const { service, savedArg } = await buildService(null);

    await service.upsertFromChain(chainData);

    expect(savedArg()).toMatchObject(chainData);
  });

  it('updates chain fields without overwriting off-chain metadata', async () => {
    const existing: Pool = {
      id: 'uuid-1',
      contractPoolId: 'pool-1',
      creatorWallet: 'GOLD',
      goal: '5000',
      title: 'Existing Title',
      description: 'Existing description',
      imageUrl: 'https://example.com/img.png',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const { service, savedArg } = await buildService(existing);

    await service.upsertFromChain(chainData);

    const saved = savedArg();
    expect(saved.creatorWallet).toBe('GWALLET');
    expect(saved.goal).toBe('10000');
    expect(saved.title).toBe('Existing Title');
    expect(saved.description).toBe('Existing description');
    expect(saved.imageUrl).toBe('https://example.com/img.png');
  });
});

async function buildService(existing: Pool | null) {
  let lastSaved: Pool | undefined;

  const repo = {
    findOne: jest.fn().mockResolvedValue(existing),
    save: jest.fn().mockImplementation((p: Pool) => {
      lastSaved = p;
      return Promise.resolve(p);
    }),
    create: jest
      .fn()
      .mockImplementation((d: Partial<Pool>) => ({ ...d }) as Pool),
  };

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      PoolsService,
      { provide: getRepositoryToken(Pool), useValue: repo },
    ],
  }).compile();

  return {
    service: module.get(PoolsService),
    savedArg: () => lastSaved as Pool,
  };
}
