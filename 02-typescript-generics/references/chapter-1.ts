// basic generics with namespace

type Namespace = "Suki";
const NameSpace = "Suki";

const getNameSpacedMessage = (message: string) => `${NameSpace} ${message}`;

type NamespacedMessage<T> = `${Namespace} ${T}`;

type ErrorMessage = NamespacedMessage<"Error">;

const getError = (): ErrorMessage => {
  // logic
  return "Suki Error";
};
