export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
};

export type PublicUser = Omit<User, "passwordHash" | "salt">;

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};