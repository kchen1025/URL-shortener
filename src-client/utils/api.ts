import { NO_CONTENT, UNAUTHORIZED } from 'http-status-codes';
import querystring from 'query-string';

interface IBody {
  [key: string]: any;
}

export const fetchConfig = (HTTP_METHOD = 'GET', body: IBody): RequestInit => ({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  method: HTTP_METHOD,
  credentials: 'same-origin',
  cache: 'no-cache',
  body: body ? JSON.stringify(body) : undefined
});

export default class API {
  static get(url: string, query?: IBody) {
    if (query) {
      url = querystring.stringifyUrl({ url, query });
    }
    return this.makeRequest(url, 'GET');
  }

  static post(url: string, data: IBody = {}) {
    return this.makeRequest(url, 'POST', data);
  }

  static delete(url: string, data: IBody = {}) {
    return this.makeRequest(url, 'DELETE', data);
  }

  static put(url: string, data: IBody = {}) {
    return this.makeRequest(url, 'PUT', data);
  }

  static patch(url: string, data: IBody = {}) {
    return this.makeRequest(url, 'PATCH', data);
  }

  static async makeRequest(url: string, verb: string, data?: IBody) {
    const payload: RequestInit = {
      method: verb,
      credentials: 'same-origin',
      cache: 'no-cache'
    };

    // FormData can be used to pass file uploads
    if (data instanceof FormData) {
      payload.body = data;
    } else {
      payload.body = JSON.stringify(data);
      payload.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      };
    }
    const response = await fetch(url, payload);
    if (response.status === NO_CONTENT) {
      // don't need to do anything
      return;
    }

    /**
     * `fetch` only rejects on network failure or inability to make request.
     * `response.ok` is the source of truth (false if !HTTP200).
     * see: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
     */
    let results = null;
    // if we get malformed json, we show the URL in the stack trace
    try {
      results = await response.json();
    } catch (err) {
      throw new Error(`${verb} ${url}, ${err}`);
    }

    // ok is only ever true when receiving HTTP200
    if (response.ok) {
      // if we're good, return the data to the caller
      return results;
    }

    if (results) {
      // if the user just needs to log in again, lets send them to the login page
      if (response.status === UNAUTHORIZED) {
        window.location.pathname = results.redirectTo;
        return;
      }
      // we have an error, make sure to throw it so the caller can handle using standard error handling patterns
      console.log(results); // log it to the console so we can inspect any error thrown and handled by enqueueNotification
      throw results; // should be a minimal error DTO (name, message, statusCode)
    }

    // okay at this point something is odd.. we don't show OK but also have no error
    console.log(results); // log w/e it gave us to the console in case there is legit info
    throw new Error('An unknown error occurred!');
  }
}
