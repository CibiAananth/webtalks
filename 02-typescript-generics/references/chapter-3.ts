// generics with multiple arguments
type FuncLike<TInput, TOutput> = (data: TInput) => TOutput;

const func1: FuncLike<string, string> = (data) => {
  return data + "asdsa";
};

const func2: FuncLike<number, string> = (data) => {
  return data + "asdsa";
};

const asyncFunctionBuilder = <T>(data: T): Promise<T> => Promise.resolve(data);

type Result<TInput, TError> =
  | {
      success: true;
      data: TInput;
    }
  | {
      success: false;
      error: TError;
    };

const apiCall2 = (): Promise<Result<"something", Error>> => {
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

const apiCall3 = () => {
  return someAsyncFunction()
    .then((data) => {
      return {
        success: true,
        data,
      };
    })
    .catch(() => {
      return {
        success: false,
      };
    });
};
