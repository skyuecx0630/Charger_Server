import Router from 'koa-router';
import { ShowPrice, MakeTrade, TradeList } from './trade.ctrl';

const trade = new Router();

trade.post('/price', ShowPrice);
trade.post('/', MakeTrade);

trade.get('/', TradeList)

export default trade;