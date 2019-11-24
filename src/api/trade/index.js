import Router from 'koa-router';
import { ShowPrice, MakeTrade } from './trade.ctrl';

const trade = new Router();

trade.post('/price', ShowPrice);
trade.post('/', MakeTrade)

export default trade;