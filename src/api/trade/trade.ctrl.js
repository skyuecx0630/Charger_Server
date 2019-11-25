import Joi from 'joi';
import { account, sale } from 'models';
import { decodeToken } from 'lib/token'
import { trade_list } from '../../models';

const PriceCalc = async (electricity) => {
    var i = 0;
    var price = 0;
    var elec = electricity;
    
    while ( true ){
        //최저가부터 불러오기
        const record = await sale.findAll({
            offset: i,
            limit: 1,
            order: ["selling_price", "created_at"]
        })
        
        if (record == []) {
            return -1
        }
        
        //요구하는 만큼의 전력과 가격을 계산
        if (record[0].selling_elec > elec){
            price += elec * record[0].selling_price;
            
            elec = 0;
            return price
        }
        else {
            price += record[0].selling_elec * record[0].selling_price
            elec -= record[0].selling_elec
            if( elec == 0 ){
                return price
            }
            
        }
        i++;
    }
}

export const ShowPrice = async (ctx) => {
    //Joi 형식 검사
    const ElecInput = Joi.object().keys({
        electricity: Joi.number().integer().required()
    });
    
    const Result = Joi.validate(ctx.request.body, ElecInput);
    
    if (Result.error) {
        console.log(`ShowPrice - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "error": "001"
        }
        return;
    }
    
    //전력 가격 계산
    const price = await PriceCalc(ctx.request.body.electricity)
    
    if (price == -1){
        console.log(`ShowPrice - 요구하는 만큼의 전력이 판매되고 있지 않습니다.`)
        ctx.status = 400;
        ctx.body = {
            "error": "013"
        }
        return;
    }
    
    console.log(`ShowPrice - 전력의 가격을 계산하였습니다.`)
    
    ctx.status = 200;
    ctx.body = {
        "price" : price
    }
}

export const MakeTrade = async (ctx) => {
    //Joi 형식 검사
    const TradeInput = Joi.object().keys({
        trading_elec: Joi.number().integer().required()
    });
    
    const Result = Joi.validate(ctx.request.body, TradeInput);
    
    if (Result.error) {
        console.log(`MakeTrade - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "error": "001"
        }
        return;
    }
    
    //로그인 한 유저인가?
    const user = await decodeToken(ctx.header.token);
    
    if (user == null) {
        console.log(`MakeTrade - 올바르지 않은 토큰입니다.`);
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
        console.log(`MakeTrade - 존재하지 않는 계정입니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "005"
        }
        return;
    }
    
    //가격 및 전력 계산
    var i = 0;
    var price = 0;
    var elec = ctx.request.body.trading_elec;
    var state = 0;
    var list = [];
    
    console.log(elec)
    while (true) {
        //최저가부터 불러오기
        const record = await sale.findAll({
            offset: i,
            limit: 1,
            order: ["selling_price", "created_at"]
        })
        
        if (record  == []) {
            console.log(`MakeTrade - 요구하는 만큼의 전력이 없습니다.`)
            ctx.status = 400;
            ctx.body = {
                "error": "009"
            }
            return;
        }
        
        console.log(record[0].sale_code, record[0].selling_elec)


        //요구하는 만큼의 전력과 가격을 계산
        if (record[0].selling_elec > elec) {
            //구매자 크레딧 부족하면 구매 중단
            if (founded.credit < price + elec * record[0].selling_price) {
                state = 1;
                break
            }

            price += elec * record[0].selling_price;
            const new_elec = record[0].selling_elec - elec
            
            //판매자에게 크레딧 지급 후 거래 삭제
            const seller = await account.findOne({
                where: {
                    user_code: record[0].seller
                }
            })

            //판매자에게 크레딧 지급 후 거래 수정
            const new_seller_credit = seller.credit + elec * record[0].selling_price

            seller.update({
                credit: new_seller_credit
            })

            record[0].update({
                selling_elec : new_elec
            })

            elec = 0;
            break
        }
        else {
            //구매자 크레딧이 부족하면 거래 중단
            if (founded.credit < price + record[0].selling_elec * record[0].selling_price){
                state = 1;
                break
            }

            price += record[0].selling_elec * record[0].selling_price
            elec -= record[0].selling_elec
            
            list.push(record[0])

            console.log(elec)
            if (elec == 0) {
                break
            }
            
        }
        i++;
    }
    
    if (state != 0){ 
        console.log(`MakeTrade - 잔액이 부족합니다.`)
        ctx.status = 400;
        ctx.body = {
            "error" : "잔액 부족"
        }
        return
    }
    
    //유저에게 전력 지급 및 잔액 차감
    const new_credit = founded.credit - price
    const new_elec = parseInt(founded.electricity) + parseInt(ctx.request.body.trading_elec)

    await founded.update({
        credit: new_credit,
        electricity: new_elec
    })
    
    for (var i in list){
        //판매자에게 크레딧 지급 후 거래 삭제
        const seller = await account.findOne({
            where: {
                user_code: list[i].seller
            }
        })

        const new_seller_credit = seller.credit + list[i].selling_elec * list[i].selling_price

        seller.update({
            credit: new_seller_credit
        })

        list[i].destroy()
        
        //거래 내역 저장 
        await trade_list.create({
            seller: seller.user_code,
            buyer: founded.user_code,
            credit: price,
            electricity: ctx.request.body.trading_elec
        })
    }
    


    console.log(`MakeTrade - 거래가 성공적으로 이루어졌습니다.`);
    
    ctx.status = 200;
}

export const TradeList = async (ctx) => {
    //로그인 한 유저인가?
    const user = await decodeToken(ctx.header.token);

    if (user == null) {
        console.log(`MakeTrade - 올바르지 않은 토큰입니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "009"
        }
        return;
    }

    const sellList = await trade_list.findAll({
        where: {
            seller: user.user_code
        },
        order: ["traded_at"]
    })

    let sell_list = [];

    for (var i in sellList) {
        const record = {
            price: sellList[i].credit,
            electricity: sellList[i].electricity,
            traded_at: sellList[i].traded_at
        }
        sell_list.push(record)
    }

    const buyList = await trade_list.findAll({
        where: {
            buyer: user.user_code
        },
        order: ["traded_at"]
    })

    let buy_list = [];

    for (var i in buyList) {
        const record = {
            price: buyList[i].credit,
            electricity: buyList[i].electricity,
            traded_at: buyList[i].traded_at
        }
        buy_list.push(record)
    }

    ctx.status = 200;
    ctx.body = {
        sell_list: sell_list,
        buy_list: buy_list
    }
}