export const Admin = (sequelize, DataTypes) => {
    return sequelize.define('admin', {
        admin_code: {
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
        is_admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    })
}