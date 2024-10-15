// stricter omit type

type User = {
  name: "cibi";
  age: 30;
  gender: "M";
};

type Keys = keyof User;
type Values = User[keyof User];

type Gender = Pick<User, "gender">;
type Gender1 = Pick<User, "askdh">;

type NameAge = Pick<User, "age" | "name">;

type NameAge1 = Omit<User, "gender">;

type NameAge2 = Omit<User, "ranomd">;

type StrictOmit<T, K extends keyof T> = Omit<T, K>;

type NameAge3 = StrictOmit<User, "age">; // error
