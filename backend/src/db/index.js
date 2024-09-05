const mongoose = require('mongoose');
const { DB_NAME } = require('../constant.js');

const connectDB = async() => {
    try{
      const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
      console.log(`\n MONGODB CONNECTED !! DB HOST: ${connectionInstance.connection.host}`);
      console.log(`${process.env.MONGODB_URI}/${DB_NAME}`);
    }catch(error){
        console.log("MONGODB CONNECTION ERROR!",error);
        process.exit(1);
    }
}

module.exports = connectDB;