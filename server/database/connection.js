const mongoose = require("mongoose");

const connectDB = async() => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log(`Connected to mongo by ${con.connection.host}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};
module.exports = connectDB;