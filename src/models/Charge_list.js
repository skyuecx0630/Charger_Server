export const Charge_list = (sequelize, DataTypes) => {
    return sequelize.define('charge_list', {
        charge_code: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        charger: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        charge_money: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        charged_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        charge_type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}