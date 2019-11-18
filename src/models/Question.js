export const Question = (sequelize, DataTypes) => {
    return sequelize.define('question', {
        question_code: {
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
        },
        is_faq : {
            type: DataTypes.BOOLEAN,
            allowNull : false
        }
    })
}
