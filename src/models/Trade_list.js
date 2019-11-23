export const Trade_list = (sequelize, DataTypes) => {
    return sequelize.define('trade_list', {
        trade_code: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        seller: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        buyer: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        credit: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        electricity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        traded_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    })
}