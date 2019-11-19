import Joi from 'joi';
import crypto from 'crypto';
import { account } from 'models';
import { generateToken } from 'lib/token.js';

import dotenv from 'dotenv';
dotenv.config();

export const Login = async (ctx) => {
    const LoginInput = Joi.object().keys({
        id: Joi.string().alphanum().min(5).max(20).required(),
        password: Joi.string().min(5).max(20).required()
    });

    const Result = Joi.validate(ctx.request.body, LoginInput);

    if (Result.error) {
        console.log(`Login - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "error": "001"
        }
        return;
    }

    const founded = await account.findOne({
        where: {
            id: ctx.request.body.id
        }
    });

    if (founded == null) {
        console.log(`Login - 존재하지 않는 계정입니다. / 입력된 아이디 : ${ctx.request.body.id}`);
        ctx.status = 400;
        ctx.body = {
            "error": "005"
        }
        return;
    }

    const input = crypto.createHmac('sha256', process.env.Password_KEY).update(ctx.request.body.password).digest('hex');

    if (founded.password != input) {
        console.log(`Login - 비밀번호를 틀렸습니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "006"
        }
        return;
    }

    const payload = {
        user_code: founded.user_code
    };

    let token = null;
    token = await generateToken(payload);

    console.log(token);

    ctx.body = {
        token: token
    };

    console.log(`로그인에 성공하였습니다.`);

}

export const Register = async (ctx) => {
    const Registeration = Joi.object().keys({
        id: Joi.string().alphanum().min(5).max(20).required(),
        password: Joi.string().min(8).max(20).required(),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().length(11).required(),
        address: Joi.string().required(),
    });

    const result = Joi.validate(ctx.request.body, Registeration)

    if (result.error) {
        console.log("Register - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "error": "001"
        }
        return;
    }

    const existId = await account.findOne({
        where: {
            id: ctx.request.body.id
        }
    });

    if (existId != null) {
        console.log(`Register - 이미 존재하는 아이디입니다. / 입력된 아이디 : ${ctx.request.body.id}`);

        ctx.status = 400;
        ctx.body = {
            "error": "002"
        }
        return;
    }

    const existEmail = await account.findOne({
        where: {
            email: ctx.request.body.email
        }
    });

    if (existEmail != null) {
        console.log(`Register - 이미 가입된 이메일입니다. / 입력된 이메일 : ${ctx.request.body.email}`);

        ctx.status = 400;
        ctx.body = {
            "error": "003"
        }
        return;
    }

    const existPhone = await account.findOne({
        where: {
            phone: ctx.request.body.phone
        }
    });

    if (existPhone != null) {
        console.log(`Register - 이미 가입된 전화번호입니다. / 입력된 번호 : ${ctx.request.body.phone}`);

        ctx.status = 400;
        ctx.body = {
            "error": "004"
        }
        return;
    }

    const password = crypto.createHmac('sha256', process.env.Password_KEY).update(ctx.request.body.password).digest('hex');

    await account.create({
        "id": ctx.request.body.id,
        "password": password,
        "name": ctx.request.body.name,
        "email": ctx.request.body.email,
        "phone": ctx.request.body.phone,
        "address": ctx.request.body.address,
    });

    console.log(`Register - 새로운 회원이 저장되었습니다. / 아이디 : ${ctx.request.body.id}`);

    ctx.status = 200;

}
