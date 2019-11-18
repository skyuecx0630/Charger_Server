import Joi from 'joi';
import { account, charge_list } from 'models';


export const AddCredit = async (ctx) => {
    //Joi 형식 검사
    const creditInput = Joi.object().keys({
        charger: Joi.number().integer().required(),
        charge_money: Joi.number().integer().required(),
        charge_type: Joi.number().integer().required(),
    });

    const Result = Joi.validate(ctx.request.body, creditInput);

    if (Result.error) {
        console.log(`AddCredit - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "error": "001"
        }
        return;
    }

    //존재하는 계정인지 확인 
    const founded = await account.findOne({
        where: {
            user_code: ctx.request.body.charger
        }
    });

    if (founded == null) {
        console.log(`AddCredit - 존재하지 않는 계정입니다. / 입력된 아이디 : ${ctx.request.body.charger}`);
        ctx.status = 400;
        ctx.body = {
            "error": "005"
        }
        return;
    }

    //충전 액수가 올바른지 확인
    if(ctx.request.body.charge_money <= 0){
        console.log(`AddCredit - 올바르지 않은 충전 액수입니다. / 충전 유형 : ${ctx.request.body.charge_money}`);
        ctx.status = 400;
        ctx.body = {
            "error": "007"
        }
    }

    //올바른 충전 타입인지 확인
    if (ctx.request.body.charge_type < 1 || ctx.request.body.charge_type > 3){
        console.log(`AddCredit - 올바르지 않은 충전 유형입니다. / 충전 유형 : ${ctx.request.body.charge_type}`);
        ctx.status = 400;
        ctx.body = {
            "error": "008"
        }
        return;
    }


    //크레딧 지급
    const new_credit = founded.credit + ctx.request.body.charge_money
    await founded.update(
        { credit: new_credit }
    )
    
    await charge_list.create({
        "charger": ctx.request.body.charger,
        "charge_money": ctx.request.body.charge_money,
        "charge_type": ctx.request.body.charge_type
    });

    console.log(`AddCredit - 크레딧이 성공적으로 지급되었습니다. / 현재 크레딧 : ${new_credit}`);

    ctx.status = 200;
    ctx.body = {
        "credit" : new_credit
    }
    
}