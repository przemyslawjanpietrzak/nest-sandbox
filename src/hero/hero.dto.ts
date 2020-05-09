import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { HeroAlignment } from './hero.domain';
import exp = require('constants');

export class HeroDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString() 
  @IsNotEmpty()
  name: string; 

  @IsEnum(HeroAlignment)
  alignment;
}

export class HeroGroupDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string; 
}

