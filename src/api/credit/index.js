import Router from 'koa-router';
import { AddCredit, ChargeList } from './credit.ctrl';

const credit = new Router();

credit.get('/list', ChargeList);

credit.post('/add', AddCredit);

export default credit;