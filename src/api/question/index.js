import Router from 'koa-router';
import { AskQuestion, ModifyQuestion, DeleteQuestion } from './question.ctrl';

const question = new Router();

question.post('/ask', AskQuestion)

question.put('/modify', ModifyQuestion)

question.delete('/delete', DeleteQuestion)

export default question;