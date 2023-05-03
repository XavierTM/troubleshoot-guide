
const { Sequelize } = require("sequelize");
const Answer = require("./Answer");

let storage;

if (process.env.NODE_ENV === 'test')
   storage = ':memory:';
else
   storage = `${__dirname}/db.sqlite`;

const sequelize = new Sequelize('', '', '', { 
   dialect: 'sqlite',
   storage,
   logging: false
});


async function init() {
   // initialize models
   Answer.init(sequelize);

   // relationships
   /// Booking
   Answer.belongsTo(Answer, {
      foreignKey: {
         name: 'question',
         allowNull: true,
      },
      onDelete: 'CASCADE',
   });


   // initialize DB
   await sequelize.sync({ force: false });

}


module.exports = {
   init,
   sequelize,
}