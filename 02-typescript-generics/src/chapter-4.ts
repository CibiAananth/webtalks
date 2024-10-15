// generics with default values

const asyncFunctionBuilder = <T>(data: T) => Promise.resolve(data);

export type Result<TData, TError = string> =
  | { success: false; error: TError }
  | {
      success: true;
      data: TData;
    };

const apiCall1 = (): Promise<Result<"welcome", Error>> => {
  return asyncFunctionBuilder("welcome" as const)
    .then((data) => {
      return {
        success: true as const,
        data,
      };
    })
    .catch((error: Error) => {
      return {
        success: false,
        error,
      };
    });
};
