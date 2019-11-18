import Joi from 'joi';
import { account, charge_list } from 'models';
import { decodeToken } from 'lib/token'


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

export const ChargeList = async (ctx) => {
    //로그인 한 유저는 누구인가?
    const user = await decodeToken(ctx.header.token);

    if (user == null) {
        console.log(`ChargeList - 올바르지 않은 토큰입니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "009"
        }
        return;
    }

    //유저의 충전 정보 불러오기
    const list = await charge_list.findAll({
        where : {
            charger : user.user_code
        }
    });

    let chargeArray = [];

    for(var i in list){
        const record = {
            charge_money : list[i].charge_money,
            charged_at : list[i].charged_at,
            charge_type : list[i].charge_type
        }
        chargeArray.push(record);
    }

    console.log(`ChargeList - 충전 목록을 반환하였습니다.`)

    ctx.status = 200;
    ctx.body = {
        "charge_list" : chargeArray
    }
}