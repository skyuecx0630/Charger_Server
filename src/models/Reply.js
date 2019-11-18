export const Reply = (sequelize, DataTypes) => {
    return sequelize.define('reply', {
        reply_code: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}
