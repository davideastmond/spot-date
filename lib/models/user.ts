export type BaseUser = {
  id: string;
  email: string;
  nickname: string;
  name: string;
};

export type User = BaseUser & {
  id: string;
};
