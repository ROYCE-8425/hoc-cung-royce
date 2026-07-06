type ApiErrorShape = {
  response?: {
    data?: {
      message?: unknown;
    };
  };
};

export function getApiErrorMessage(error: unknown): string | undefined {
  const message = (error as ApiErrorShape).response?.data?.message;
  return typeof message === 'string' ? message : undefined;
}
