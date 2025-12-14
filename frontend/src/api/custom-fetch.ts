const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const customFetch = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  const data =
    response.status === 204 ? undefined : await response.json();

  // Return in the format Orval expects: { data, status, headers }
  return {
    data,
    status: response.status,
    headers: response.headers,
  } as T;
};

export default customFetch;
