export interface IPasswordCompare {
  compare(password: string, passwordHash: string): Promise<boolean>;
}
