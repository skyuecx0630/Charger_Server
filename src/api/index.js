import Router from 'koa-router';

import auth from './auth';
import credit from './credit';

const api = new Router;

api.use('/auth', auth.routes());
api.use('/credit', credit.routes());

export default api;