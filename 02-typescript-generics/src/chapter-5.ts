// generics with type constraints

const asyncFunctionBuilder = <T>(data: T) => Promise.resolve(data);

export type Result<TData, TError extends { message: string }> =
  | { success: false; error: TError }
  | {
      success: true;
      data: TData;
    };

type APICALL1 = Result<"welcome", { status: number; message: string }>;

const apiCall1 = (): Promise<APICALL1> => {
  return asyncFunctionBuilder("welcome" as const)
    .then((data) => {
      return {
        success: true as const,
        data,
      };
    })
    .catch((error: { status: number; message: string }) => {
      return {
        success: false,
        error,
      };
    });
};
