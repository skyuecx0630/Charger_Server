import Router from 'koa-router';
import { AddCredit } from './credit.ctrl';

const credit = new Router();

credit.post('/add', AddCredit);

export default credit;