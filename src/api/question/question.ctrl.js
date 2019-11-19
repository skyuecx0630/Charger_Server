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
    //Joi 형식 검사
    const QuestionInput = Joi.object().keys({
        question_code: Joi.number().integer().required(),
        title: Joi.string().max(40).required(),
        content: Joi.string().required(),
        is_faq: Joi.boolean()
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

    //존재하는 게시글인가?
    const founded = await question.findOne({
        where : {
            question_code : ctx.request.body.question_code
        }
    })

    if (founded == null){
        console.log(`ModifyQuestion - 게시글을 찾을 수 없습니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "010"
        }
        return;
    }

    //로그인 한 유저는 누구인가?
    const user = await decodeToken(ctx.header.token);

    if (user == null) {
        console.log(`ModifyQuestion - 올바르지 않은 토큰입니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "009"
        }
        return;
    }

    //게시글 작성자와 수정하는 사람이 같은가?
    if (user.user_code != founded.author){
        console.log(`ModifyQuestion - 게시글 작성자와 수정하는 사람이 다릅니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "011"
        }
        return;
    }

    //게시글 수정
    await founded.update({
        title: ctx.request.body.title,
        content: ctx.request.body.content,
        is_faq: ctx.request.body.is_faq
    })

    console.log(`ModifyQuestion - 게시글이 성공적으로 수정되었습니다.`)

    ctx.status = 200;
}

export const DeleteQuestion = async (ctx) => {
    //로그인 한 유저는 누구인가?
    const user = await decodeToken(ctx.header.token);

    if (user == null) {
        console.log(`DeleteQuestion - 올바르지 않은 토큰입니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "009"
        }
        return;
    }

    const founded = await question.findOne({
        where : {
            question_code : ctx.request.query.q_code
        }
    })

    //게시글 작성자와 삭제 요청자가 일치하는가?
    if (user.user_code != founded.author) {
        console.log(`DeleteQuestion - 게시글 작성자와 삭제 요청자가 다릅니다.`);

        ctx.status = 400;
        ctx.body = {
            error: "011"
        };
        return;
    }

    await founded.destroy();
    
    console.log(`DeleteQuestion - 게시글이 삭제되었습니다.`)

    ctx.status = 200;
}