// generics with default values

const asyncFunctionBuilder = <T>(data: T): Promise<T> => Promise.resolve(data);

type Result<TInput, TError = Error> =
  | {
      success: true;
      data: TInput;
    }
  | {
      success: false;
      error: TError;
    };

const apiCall2 = (): Promise<Result<"something">> => {
  return asyncFunctionBuilder("something" as const)
    .then((data) => {
      return {
        success: true as const,
        data,
      };
    })
    .catch((error: Error) => {
      return {
        success: false as const,
        error,
      };
    });
};
