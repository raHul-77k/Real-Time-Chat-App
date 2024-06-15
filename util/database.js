const Sequelize = require('sequelize');
const sequelize=new Sequelize('chatApp','root','@#MaD.772k',{ 
    dialect:'mysql',
    host:'localhost',
});

module.exports=sequelize;