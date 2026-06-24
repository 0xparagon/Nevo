import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pool } from './pool.entity';
import { PoolsService } from './pools.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pool])],
  providers: [PoolsService],
  exports: [PoolsService],
})
export class PoolsModule {}
