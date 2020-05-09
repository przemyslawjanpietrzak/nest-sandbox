export interface Hero {
  id: string;
  name: string;
  alignment: HeroAlignment
}

export interface HeroResponse extends Hero {
  groups: Array<HeroGroup>;
}

export interface HeroGroup {
  id: string;
  name: string;
  heroes: Array<Hero>;
}

export interface HeroGroupResponse extends HeroGroup {
  heroes: Array<Hero>;
  meanAlignment: HeroAlignment
}

export enum HeroAlignment {
  Good = 'Good',
  Bad = 'Bad',
  Neutral = 'Neutral'
}
