import { Injectable } from '@nestjs/common';

import { Hero, HeroAlignment, HeroGroup, HeroGroupResponse, HeroResponse } from './hero.domain';
import {
  GroupNotExistError,
  HeroAlreadyInGroupError,
  HeroNotExistError,
  HeroWasNotPresentInGroupError,
} from './hero.errors';
import { HeroGroupDto } from './hero.dto';

@Injectable()
export class HeroStorage {
  private heroes: Array<Hero> = [];
  private groups: Array<HeroGroup> = [];
  private heroesMemberShips: Array<{ heroId: string, groupId: string }> = [];

  public addHero(hero: Hero): void {
    this.heroes = [...this.heroes, hero];
  }

  public findHero(heroId: string): HeroResponse {
    const hero = this.getHero(heroId);

    return this.resolveGroups(hero);
  }

  public removeHero(heroId: string): void {
    this.findHero(heroId);
    this.heroes = this.heroes.filter(({ id }) => heroId !== id);
  }

  public addGroup(groupPayload: HeroGroupDto): void {
    const group = { ...groupPayload, heroes: [] };
    this.groups = [...this.groups, group];
  }

  public findGroup(groupId: string): HeroGroup {
    const group = this.getGroup(groupId);

    return this.resolveHeroes(group);
  }

  public removeGroup(heroId: string): void {
    const groupToRemove = this.findGroup(heroId);
    if (!groupToRemove) {
      throw new GroupNotExistError();
    }
    this.groups = this.groups.filter(hero => hero !== groupToRemove);
  }

  public addHeroToGroup(heroToAddId: string, groupToAddId: string): void {
    const hero = this.findHero(heroToAddId);
    const group = this.findGroup(groupToAddId);
    const heroMemberShip = this.heroesMemberShips
      .find(({ heroId, groupId }) => heroId === heroToAddId && groupId === groupToAddId);
    if (heroMemberShip) {
      throw new HeroAlreadyInGroupError();
    }

    this.heroesMemberShips = [...this.heroesMemberShips, { heroId: hero.id, groupId: group.id }];
  }

  public removeHeroFromGroup(heroToRemoveId: string, groupToRemoveId: string): void {
    this.findHero(heroToRemoveId);
    this.findGroup(groupToRemoveId);
    const heroMemberShipToRemove = this.heroesMemberShips
      .find(({ heroId, groupId }) => heroId === heroToRemoveId && groupId === groupToRemoveId);
    if (!heroMemberShipToRemove) {
      throw new HeroWasNotPresentInGroupError();
    }

    this.heroesMemberShips = this.heroesMemberShips
      .filter(({ groupId, heroId }) => heroId !== heroToRemoveId || groupId !== groupToRemoveId);
  }

  private getHero(heroId: string): Hero {
    const hero = this.heroes.find(({ id }) => id === heroId);
    if (!hero) {
      throw new HeroNotExistError();
    }

    return hero;
  }

  private getGroup(groupId: string): HeroGroup {
    const group = this.groups.find(({ id }) => id === groupId);
    if (!group) {
      throw new GroupNotExistError();
    }

    return group;
  }

  private resolveGroups(hero: Hero): HeroResponse {
    const memberships = this.heroesMemberShips.filter(({ heroId }) => heroId === hero.id);
    const groups = memberships.map(({ groupId }) => this.getGroup(groupId));

    return { ...hero, groups };
  }

  private resolveHeroes(group: HeroGroup): HeroGroupResponse {
    const memberships = this.heroesMemberShips.filter(({ groupId }) => groupId === group.id);
    const heroes = memberships.map(({ heroId }) => this.getHero(heroId));
    const meanAlignment = this.getMeanAlignment(heroes);

    return { ...group, heroes, meanAlignment };
  }

  private getMeanAlignment(heroes: Array<Hero>) {
    const goodHeroesCount = heroes.filter(({ alignment }) => alignment === HeroAlignment.Good).length;
    const badHeroesCount = heroes.filter(({ alignment }) => alignment === HeroAlignment.Bad).length;

    if (goodHeroesCount === badHeroesCount) {
      return HeroAlignment.Neutral;
    }
    if (goodHeroesCount > badHeroesCount) {
      return HeroAlignment.Good;
    }
    return HeroAlignment.Bad;
  }
}
