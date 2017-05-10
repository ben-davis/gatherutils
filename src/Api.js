import querystring from 'querystring';

import Immutable from 'immutable';


const BASE = process.env.GATHER_API_BASE || 'https://api.gatherdata.co';

const ApiUtils = {

  _getToken() {
    const data = localStorage.getItem('session');

    if (data) {
      const session = JSON.parse(data);

      if (!session.token) {
        return localStorage.removeItem('session');
      }

      return `Token ${session.token}`;
    }

    return null;
  },

  _getVersion() {
    const data = localStorage.getItem('gatherVersion');

    if (data) {
      const version = JSON.parse(data);

      return version;
    }

    return null;
  },

  async _handleResponse(requestData, response) {
    if (response.ok) {
      if (response.status === 204) {
        // No content, so return an immediately resolving promise
        return Promise.resolve();
      }
      return response.json();
    }

    const message = await response.json();

    // Reject with Error-like Immutalbe object (we can't serialise an actaul Error object)
    return Promise.reject(Immutable.Map({
      name: 'ApiError',
      message: Immutable.Map(message),
      meta: Immutable.fromJS({
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        requestData: Immutable.Map(requestData),
      }),
    }));
  },

  async _getHeaders(contentType = 'application/json') {
    const token = await this._getToken();
    const version = await this._getVersion();

    const headers = {
      Accept: 'application/json',
      'Content-Type': contentType,
    };
    if (token) {
      headers.Authorization = token;
    }
    if (version) {
      headers.X_GATHER_VERSION = version;
    }

    return headers;
  },

  _getPostBody(data, formData = false) {
    let body;
    if (formData) {
      body = new FormData();
      Object.keys(data).forEach(key => {
        body.append(key, data[key] || '');
      });
    } else {
      body = JSON.stringify(data);
    }

    return body;
  },

  _fetch(url, data) {
    return fetch(
      url, data,
    ).then(
      response => this._handleResponse(data, response),
    ).catch(error => {
      if (!Immutable.Iterable.isIterable(error)) {
        const newError = {detail: 'Application Error'};
        throw newError;
      }

      throw error;
    });
  },

  async get(url, query) {
    let fullUrl = `${BASE}${url}`;
    const stringifiedQuery = querystring.stringify(query);
    if (stringifiedQuery) {
      fullUrl = `${fullUrl}?${stringifiedQuery}`;
    }

    const headers = await this._getHeaders();

    return this._fetch(fullUrl, {
      method: 'GET',
      headers,
    });
  },

  async post(url, data, formData = false, query = null) {
    let fullUrl = `${BASE}${url}`;
    const stringifiedQuery = querystring.stringify(query);
    if (stringifiedQuery) {
      fullUrl = `${fullUrl}?${stringifiedQuery}`;
    }

    const headers = await this._getHeaders(formData ? 'multipart/FormData' : 'application/json');
    const body = this._getPostBody(data, formData);

    return this._fetch(fullUrl, {
      method: 'POST',
      headers,
      body,
    });
  },

  async delete(url) {
    const fullUrl = `${BASE}${url}`;
    const headers = await this._getHeaders();

    return this._fetch(fullUrl, {
      method: 'DELETE',
      headers,
    });
  },

  async put(url, data, formData = false) {
    const fullUrl = `${BASE}${url}`;
    const headers = await this._getHeaders(formData ? 'multipart/FormData' : 'application/json');
    const body = this._getPostBody(data, formData);

    return this._fetch(fullUrl, {
      method: 'PUT',
      headers,
      body,
    });
  },

  async patch(url, data, query = null) {
    const fullUrl = `${BASE}${url}?${querystring.stringify(query)}`;
    const headers = await this._getHeaders();
    const body = this._getPostBody(data);

    return this._fetch(fullUrl, {
      method: 'PATCH',
      headers,
      body,
    });
  },

};

export default ApiUtils;
