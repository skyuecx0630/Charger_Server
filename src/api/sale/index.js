import Router from 'koa-router';
import { MakeSale, ModifySale } from './sale.ctrl';

const sale = new Router();

sale.post('/newsale', MakeSale)
sale.put('/modify', ModifySale)


export default sale;