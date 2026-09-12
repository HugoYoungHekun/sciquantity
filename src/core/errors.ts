export class UnitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnitError';
  }
}

export class LanguageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LanguageError';
  }
}