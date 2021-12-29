import axios from 'axios';

import * as digest from './digest';

const request = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export const api = {
  request,
  digest,
};
