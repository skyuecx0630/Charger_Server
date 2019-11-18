import Router from 'koa-router';
import { AskQuestion } from './question.ctrl';

const question = new Router();

question.post('/ask', AskQuestion)

export default question;