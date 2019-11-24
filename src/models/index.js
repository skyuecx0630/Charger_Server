import Sequelize from 'sequelize';
import path from 'path';

import { Account } from './Account';
import { Admin } from './Admin';
import { Charge_list } from './Charge_list';
import { Post } from './Post';
import { Question } from './Question';
import { Reply } from './Reply';
import { Trade_list } from './Trade_list';
import { Sale } from './Sale';
import { Market_price } from './Market_price';

const config = require(path.join(__dirname, '..', 'config', 'dbconfig.json'))['charger'];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
)

const account = Account(sequelize, Sequelize);
const admin = Admin(sequelize, Sequelize);
const charge_list = Charge_list(sequelize, Sequelize);
const post = Post(sequelize, Sequelize);
const question = Question(sequelize, Sequelize);
const reply = Reply(sequelize, Sequelize);
const trade_list = Trade_list(sequelize, Sequelize);
const sale = Sale(sequelize, Sequelize);
const market_price = Market_price(sequelize, Sequelize);

export { sequelize, Sequelize, account, admin, charge_list, post, question, reply, trade_list, sale, market_price };
