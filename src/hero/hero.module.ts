import { Module } from '@nestjs/common';
import { HeroController } from './hero.controller';
import { HeroStorage } from './hero.storage';

@Module({
  controllers: [HeroController],
  providers: [HeroStorage]
})
export class HeroModule {}
