export type BaseJwt = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  email: string;
};

export type JwtData = BaseJwt & {
  id: string;
};

export type UpdatableJwt = Omit<BaseJwt, "email">;
