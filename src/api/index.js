import Router from 'koa-router';

import auth from './auth';
import credit from './credit';
import question from './question';

const api = new Router;

api.use('/auth', auth.routes());
api.use('/credit', credit.routes());
api.use('/question', question.routes());

export default api;