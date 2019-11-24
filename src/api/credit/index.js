import Router from 'koa-router';
import { AddCredit, ChargeList, ShowCredit } from './credit.ctrl';

const credit = new Router();

credit.get('/list', ChargeList);
credit.get('/', ShowCredit);

credit.post('/add', AddCredit);

export default credit;