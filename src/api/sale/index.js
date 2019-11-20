import Router from 'koa-router';
import { MakeSale, ModifySale, DeleteSale } from './sale.ctrl';

const sale = new Router();

sale.post('/newsale', MakeSale)

sale.put('/modify', ModifySale)

sale.delete('/delete', DeleteSale)


export default sale;