import Router from 'koa-router';
import { Login, Register, UserInfo } from './auth.ctrl';

const auth = new Router();

auth.post('/login', Login);
auth.post('/register', Register);

auth.get('/', UserInfo)

export default auth;