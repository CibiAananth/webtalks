// Simple intro to generic with namespace example

type TNamespace = "Suki";

const Namespace = "Suki";

const getNamespacedMessage = (message: string) => `${Namespace} ${message}`;

type TNamespacedMessage<TMessage extends string> = `${TNamespace} ${TMessage}`;

export type ErrorMessage = TNamespacedMessage<"Error">;

const getError = (): ErrorMessage => {
  // logic
  //
  return "Suki Error";
};

const getWarning = (): TNamespacedMessage<"Warning"> => {
  // logic
  //
  return "Suki Warning";
};
