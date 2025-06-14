import axios from 'axios';

import AppError from '@Utils/AppError';

export default function handleServiceError(error: unknown): AppError {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      const { status, data } = error.response;
      if (data?.message) {
        return new AppError({ code: status, message: data.message });
      }
      return new AppError({ code: status, message: 'Unspecified Server Error' });
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and instance of http.ClientRequest in node.js
      return new AppError({ context: { request: error.request }, message: 'No response received from server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      return new AppError({ message: 'Non-Operational Error: Contact Support' });
    }
  } else {
    return new AppError({ message: 'Non-Operational Error: Contact Support' });
  }
}
