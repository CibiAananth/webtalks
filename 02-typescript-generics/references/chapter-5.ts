// generics with type constraints

type Namespace = "Suki";
const NameSpace = "Suki";

type NamespacedMessage<T extends string> = `${Namespace} ${T}`;

const getNameSpacedMessage = <T extends string>(
  message: T,
): NamespacedMessage<T> => `${NameSpace} ${message}`;

type ErrorMessage = NamespacedMessage<"Error">;

const getError2 = (): ErrorMessage => {
  // logic
  return getNameSpacedMessage("Error");
};

// type Namespace = "Suki";
// const NameSpace = "Suki";

// type NamespacedMessage<T> = `${Namespace} ${T}`;

// const getNameSpacedMessage = <T extends string>(message: T) =>
//   `${NameSpace} ${message}` as const;

// type ErrorMessage = NamespacedMessage<"Error">;

// const getError = (): ErrorMessage => {
//   // logic
//   return getNameSpacedMessage("Error");
// };

type FuncLike1<TInput extends Array<unknown>, TOutput> = (
  ...args: TInput
) => TOutput;

const func2: FuncLike1<Array<number>, Array<number>> = (a, b, c, d, e, f) => {
  return [a, b, c];
};

// generics with default values

const asyncFunctionBuilder = <T>(data: T): Promise<T> => Promise.resolve(data);

type Result<TInput, TError extends { message: string } = Error> =
  | {
      success: true;
      data: TInput;
    }
  | {
      success: false;
      error: TError;
    };

const apiCall2 = (): Promise<Result<"something", { message: string }>> => {
  return asyncFunctionBuilder("something" as const)
    .then((data) => {
      return {
        success: true as const,
        data,
      };
    })
    .catch((error: { message: string }) => {
      return {
        success: false as const,
        error,
      };
    });
};
