import Router from 'koa-router';

import auth from './auth';
import credit from './credit';
import question from './question';
import sale from './sale';

const api = new Router;

api.use('/auth', auth.routes());
api.use('/credit', credit.routes());
api.use('/question', question.routes());
api.use('/sale', sale.routes());

export default api;