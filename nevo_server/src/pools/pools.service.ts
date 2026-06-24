import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pool } from './pool.entity';

export interface ChainPoolData {
  contractPoolId: string;
  creatorWallet: string;
  goal: string;
}

@Injectable()
export class PoolsService {
  constructor(
    @InjectRepository(Pool)
    private readonly poolRepo: Repository<Pool>,
  ) {}

  async upsertFromChain(data: ChainPoolData): Promise<Pool> {
    const existing = await this.poolRepo.findOne({
      where: { contractPoolId: data.contractPoolId },
    });

    if (existing) {
      existing.creatorWallet = data.creatorWallet;
      existing.goal = data.goal;
      return this.poolRepo.save(existing);
    }

    return this.poolRepo.save(
      this.poolRepo.create({
        contractPoolId: data.contractPoolId,
        creatorWallet: data.creatorWallet,
        goal: data.goal,
      }),
    );
  }
}
