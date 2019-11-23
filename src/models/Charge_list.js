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
        credit_type: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        charged_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        payment_type: {
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
        }
    })
}