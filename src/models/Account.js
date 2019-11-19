export const Account = (sequelize, DataTypes) => {
    return sequelize.define('account', {
        user_code: {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        id: {
            type : DataTypes.STRING(20),
            allowNull : false,
            unique : true
        },
        password: {
            type : DataTypes.STRING,
            allowNull : false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type : DataTypes.STRING,
            allowNull : false
        },
        phone: {
            type: DataTypes.STRING(11),
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        credit: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        electricity: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    })
}
