export type SearchParam<T extends string> = { [K in T]?: string };

export function createSearchParams<T extends Record<string, string | undefined>>(keys: readonly (keyof T)[]) {
  return {
    parse(params: URLSearchParams): T {
      const result = {} as T;

      keys.forEach((key) => {
        const value = params.get(String(key));
        if (value !== null) {
          result[key] = value as T[keyof T];
        }
      });

      return result;
    },

    stringify(search: T): string {
      const params = new URLSearchParams();

      keys.forEach((key) => {
        const value = search[key];
        if (value !== undefined) {
          params.set(String(key), value);
        }
      });

      return params.toString();
    },
  };
}
