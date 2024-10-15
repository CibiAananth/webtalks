// stricter omit type
type User = {
  name: "cibi";
  age: 30;
  gender: "M";
};

type Gender = Pick<User, "gender">;

type NameAge = Omit<User, "gender">;

type StrictOmit<T, K extends keyof T> = Omit<T, K>;

type NameAgeStrict = StrictOmit<User, "gender">;
