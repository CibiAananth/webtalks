// generics with multiple arguments

const asyncFunctionBuilder = <T>(data: T) => Promise.resolve(data);

export type Result<TData, TError> =
  | { success: false; error: TError }
  | {
      success: true;
      data: TData;
    };

const apiCall1 = (): Promise<Result<"welcome", "invalid request">> => {
  return asyncFunctionBuilder("welcome" as const)
    .then((data) => {
      return {
        success: true as const,
        data,
      };
    })
    .catch((error: "invalid request") => {
      return {
        success: false,
        error,
      };
    });
};
