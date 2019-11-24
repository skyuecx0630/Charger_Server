export const Market_price = (sequelize, DataTypes) => {
    return sequelize.define('market_price', {
        time: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            primaryKey: true
        },
        average: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        highest: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        lowest: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
}
