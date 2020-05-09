export class GroupAlreadyExists extends Error {
  message: `Group already exists`;
}

export class GroupNotExistError extends Error {
  message: `Group doesn't exist`; 
}

export class HeroNotExistError extends Error {
  message = `Hero doesn't exist`;
}

export class HeroAlreadyExists extends Error {
  message = 'Hero already exists';
}

export class HeroAlreadyInGroupError extends Error {
  message = 'Hero is already in this group';
}

export class HeroWasNotPresentInGroupError extends Error {
  message = 'Hero was already present in group';
}
