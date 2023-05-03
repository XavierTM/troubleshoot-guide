

const { Model, DataTypes } = require("sequelize");

module.exports = class Answer extends Model {
   static init(sequelize) {
      super.init({
         caption: {
            type: DataTypes.TEXT,
            allowNull: false,
         },
         solution: {
            type: DataTypes.TEXT,
            allowNull: true,
         },
         sub_question: {
            type: DataTypes.TEXT,
            allowNull: true,
         },
      }, { sequelize })
   }
}