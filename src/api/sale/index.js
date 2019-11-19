import Router from 'koa-router';
import { MakeSale } from './sale.ctrl';

const sale = new Router();

sale.post('/newsale', MakeSale)



export default sale;