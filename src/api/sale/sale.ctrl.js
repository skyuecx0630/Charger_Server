import Joi from 'joi';
import { account, sale } from 'models';
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

    //유저 정보 받아오기
    const founded = await account.findOne({
        where: {
            user_code: user.user_code
        }
    });

    if (founded == null) {
        console.log(`MakeSale - 존재하지 않는 계정입니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "005"
        }
        return;
    }

    //유저에게 충분한 전력이 있는가?
    if(founded.electricity < ctx.request.body.selling_elec){
        console.log(`MakeSale - 유저에게 충분한 전력이 없습니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "012"
        }
        return;
    }

    //판매 등록
    const new_elec = founded.electricity - ctx.request.body.selling_elec;

    await founded.update({
        electricity: new_elec
    })

    await sale.create({
        seller: user.user_code,
        selling_elec: ctx.request.body.selling_elec,
        selling_price: ctx.request.body.selling_price
    })


    console.log(`MakeSale - 판매가 성공적으로 등록되었습니다.`);

    ctx.status = 200;
}

export const ModifySale = async (ctx) => {
    //Joi 형식 검사
    const SaleInput = Joi.object().keys({
        sale_code: Joi.number().integer().required(),
        selling_elec: Joi.number().integer().required(),
        selling_price: Joi.number().integer().required()
    });

    const Result = Joi.validate(ctx.request.body, SaleInput);

    if (Result.error) {
        console.log(`ModifySale - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "error": "001"
        }
        return;
    }

    //존재하는 판매인가?
    const sell = await sale.findOne({
        where: {
            sale_code: ctx.request.body.sale_code
        }
    })

    if (sell == null) {
        console.log(`ModifySale - 판매를 찾을 수 없습니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "010"
        }
        return;
    }

    //로그인 한 유저는 누구인가?
    const user = await decodeToken(ctx.header.token);

    if (user == null) {
        console.log(`ModifySale - 올바르지 않은 토큰입니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "009"
        }
        return;
    }

    //판매자와 수정하는 사람이 같은가?
    if (user.user_code != sell.seller) {
        console.log(`ModifySale - 판매자와 수정하는 사람이 다릅니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "011"
        }
        return;
    }

    //유저 정보 받아오기
    const founded = await account.findOne({
        where: {
            user_code: user.user_code
        }
    });

    if (founded == null) {
        console.log(`ModifySale - 존재하지 않는 계정입니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "005"
        }
        return;
    }

    //유저에게 충분한 전력이 있는가?
    const modified_elec = sell.selling_elec - ctx.request.body.selling_elec;
    const new_elec = founded.electricity + modified_elec

    if (new_elec < 0) {
        console.log(`ModifySale - 유저에게 충분한 전력이 없습니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "012"
        }
        return;
    }
    
    //판매 수정
    await founded.update({
        electricity: new_elec
    })
    
    await sell.update({
        selling_elec: ctx.request.body.selling_elec,
        selling_price: ctx.request.body.selling_price
    })

    console.log(`ModifySale - 판매가 성공적으로 수정되었습니다.`)

    ctx.status = 200;
}

export const DeleteSale = async (ctx) => {

    //존재하는 판매인가?
    const sell = await sale.findOne({
        where: {
            sale_code: ctx.request.query.s_code
        }
    })

    if (sell == null) {
        console.log(`ModifySale - 판매를 찾을 수 없습니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "010"
        }
        return;
    }

    //로그인 한 유저는 누구인가?
    const user = await decodeToken(ctx.header.token);

    if (user == null) {
        console.log(`DeleteSale - 올바르지 않은 토큰입니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "009"
        }
        return;
    }

    //유저 정보 받아오기
    const founded = await account.findOne({
        where: {
            user_code: user.user_code
        }
    });

    if (founded == null) {
        console.log(`DeleteSale - 존재하지 않는 계정입니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "005"
        }
        return;
    }

    //판매자와 삭제하는 사람이 같은가?
    if (user.user_code != sell.seller) {
        console.log(`DeleteSale - 판매자와 수정하는 사람이 다릅니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "011"
        }
        return;
    }

    //판매 삭제
    const new_elec = founded.electricity + sell.selling_elec

    await founded.update({
        electricity: new_elec
    })

    await sell.destroy()

    console.log(`DeleteSale - 판매가 성공적으로 삭제되었습니다.`)

    ctx.status = 200;
}

export const SaleList = async (ctx) => {
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
    const list = await sale.findAll({
        where: {
            seller: user.user_code
        }
    });

    let saleArray = [];

    for (var i in list) {
        const record = {
            selling_elec: list[i].selling_elec,
            selling_price: list[i].selling_price,
            created_at: list[i].created_at
        }
        saleArray.push(record);
    }

    console.log(`SaleList - 충전 목록을 반환하였습니다.`)

    ctx.status = 200;
    ctx.body = {
        "sale_list": saleArray
    }
}