export const User_trade = (sequelize, DataTypes) => {
    return sequelize.define('user_trade', {
        send_code: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        receiver: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        send_money: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        traded_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        sender: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}