import Joi from 'joi';
import { sale } from 'models';
import { decodeToken } from 'lib/token'


export const MakeSale = async (ctx) => {
    //Joi 형식 검사
    const SaleInput = Joi.object().keys({
        selling_elec: Joi.number().integer().required(),
        selling_price: Joi.number().integer().required()
    });

    const Result = Joi.validate(ctx.request.body, SaleInput);

    if (Result.error) {
        console.log(`MakeSale - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "error": "001"
        }
        return;
    }

    //로그인 한 유저인가?
    const user = await decodeToken(ctx.header.token);

    if (user == null) {
        console.log(`MakeSale - 올바르지 않은 토큰입니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "009"
        }
        return;
    }

    //질문 게시
    await sale.create({
        seller: user.user_code,
        selling_elec: ctx.request.body.selling_elec,
        selling_price: ctx.request.body.selling_price
    })

    console.log(`MakeSale - 판매가 성공적으로 등록되었습니다.`);

    ctx.status = 200;
}