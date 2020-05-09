import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { HeroStorage } from './hero.storage';
import {
  GroupAlreadyExists,
  GroupNotExistError,
  HeroAlreadyExists, HeroAlreadyInGroupError,
  HeroNotExistError,
  HeroWasNotPresentInGroupError,
} from './hero.errors';
import { HeroGroup } from './hero.domain';
import { HeroGroupDto, HeroDto } from './hero.dto';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroStorage: HeroStorage) {
  }

  @Get(':id')
  findHero(@Param('id') id: string) {
    try {
      return this.heroStorage.findHero(id);
    } catch (e) {
      if (e instanceof HeroNotExistError) {
        throw new HttpException(e.message, HttpStatus.NOT_FOUND);
      }
      throw e;
    }
  }

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() hero: HeroDto) {
    try {
      this.heroStorage.addHero(hero);
    } catch (e) {
      if (e instanceof HeroAlreadyExists) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
      throw e;
    }
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      this.heroStorage.removeHero(id);
    } catch (e) {
      if (e instanceof HeroNotExistError) {
        throw new HttpException(e.message, HttpStatus.NOT_FOUND);
      }
      throw e;
    }
  }

  @Get('group/:id')
  findGroup(@Param('id') id: string) {
    try {
      return this.heroStorage.findGroup(id);
    } catch (e) {
      if (e instanceof GroupNotExistError) {
        throw new HttpException(e.message, HttpStatus.NOT_FOUND);
      }
      throw e;
    }
  }
  
  @Post('group')
  @UsePipes(new ValidationPipe())
  createGroup(@Body() group: HeroGroupDto) {
    try {
      this.heroStorage.addGroup(group);
    } catch (e) {
      if (e instanceof GroupAlreadyExists) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
      throw e;
    } 
  }
  
  @Delete('group/:id')
  removeGroup(@Param('id') id: string) {
    try {
      this.heroStorage.removeGroup(id);
    } catch (e) {
      if (e instanceof GroupNotExistError) {
        throw new HttpException(e.message, HttpStatus.NOT_FOUND);
      }
      throw e;
    }
  }
  
  @Post('membership/:heroId/:groupId')
  addHeroToGroup(@Param('heroId') heroId: string, @Param('groupId') groupId: string) {
    try {
      this.heroStorage.addHeroToGroup(heroId, groupId);
    } catch (e) {
      if (e instanceof HeroNotExistError || e instanceof GroupNotExistError) {
        throw new HttpException(e.message, HttpStatus.NOT_FOUND);
      }
      if (e instanceof HeroAlreadyInGroupError) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
      throw e;
    }  
  }
  
  @Delete('membership/:heroId/:groupId')
  removeHeroFromGroup(@Param('heroId') heroId: string, @Param('groupId') groupId: string) {
    try {
      this.heroStorage.removeHeroFromGroup(heroId, groupId);
    } catch (e) {
      if (e instanceof HeroNotExistError || e instanceof GroupNotExistError) {
        throw new HttpException(e.message, HttpStatus.NOT_FOUND);
      }
     if (e instanceof HeroWasNotPresentInGroupError) {
       throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
     }
     throw e;
    }
  }
}
