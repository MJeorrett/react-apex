
import Axios, { AxiosError } from 'axios';

function isAxiosError(error: AxiosError | any): error is AxiosError {
  return error && error.isAxiosError
}

export interface HttpClientSuccess<T> {
  content: T,
  ok: true,
}

export interface HttpClientError {
  ok: false,
  errorMessage: string,
  errorDetail: object,
}

export type HttpClientResponse<T> = HttpClientSuccess<T> | HttpClientError;

function handleError<T>(error: AxiosError): HttpClientResponse<T> {
  if (error.response) {
    return {
      ok: false,
      errorMessage: `Request failed with status code ${error.response.status}.`,
      errorDetail: error.toJSON(),
    };
  } else if (error.request) {
    return {
      ok: false,
      errorMessage: 'No response received.',
      errorDetail: error.toJSON(),
    };
  } else {
    return {
      ok: false,
      errorMessage: 'Error setting up request.',
      errorDetail: {
        message: error.message,
      },
    };
  }
}

export async function get<T>(url: string): Promise<HttpClientResponse<T>> {
  try {
    const result = await Axios.get(url);
    return {
      ok: true,
      content: result.data as T,
    };
  }
  catch (error) {
    if (isAxiosError(error)) {
      return handleError<T>(error);
    }
    throw error;
  }
}