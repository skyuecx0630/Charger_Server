import Router from 'koa-router';
import { AskQuestion, ModifyQuestion } from './question.ctrl';

const question = new Router();

question.post('/ask', AskQuestion)

question.put('/modify', ModifyQuestion)

export default question;