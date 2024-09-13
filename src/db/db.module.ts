import { Module } from '@nestjs/common';
import { dataSourceOptions } from './data-scource';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions)],
})
export class DbModule {}
