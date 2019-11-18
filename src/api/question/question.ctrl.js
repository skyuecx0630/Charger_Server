import Joi from 'joi';
import { account, question } from 'models';
import { decodeToken } from 'lib/token'

export const AskQuestion = async (ctx) => {
    //Joi 형식 검사
    const QuestionInput = Joi.object().keys({
        title : Joi.string().max(40).required(),
        content : Joi.string().required()
    });

    const Result = Joi.validate(ctx.request.body, QuestionInput);

    if (Result.error) {
        console.log(`AskQuestion - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "error": "001"
        }
        return;
    }

    //로그인 한 유저인가?
    const user = await decodeToken(ctx.header.token);

    if (user == null) {
        console.log(`AskQuestion - 올바르지 않은 토큰입니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "009"
        }
        return;
    }

    //질문 게시
    await question.create({
        "title" : ctx.request.body.title,
        "author" : user.user_code,
        "content" : ctx.request.body.content,
        "is_faq" : false
    })

    console.log(`AskQuestion - 질문이 성공적으로 게시되었습니다.`);

    ctx.status = 200;
    
}

export const ModifyQuestion = async (ctx) => {
    const QuestionInput = Joi.object().keys({
        title: Joi.string().max(40).required(),
        content: Joi.string().required()
    });

    const Result = Joi.validate(ctx.request.body, QuestionInput);

    if (Result.error) {
        console.log(`ModifyQuestion - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "error": "001"
        }
        return;
    }
}