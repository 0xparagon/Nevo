import { Module } from '@nestjs/common';
import { PoolsModule } from '../pools/pools.module';
import { SyncService } from './sync.service';

@Module({
  imports: [PoolsModule],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
