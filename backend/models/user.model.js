//talk to mangodb through mongoose.
const mongoose = require("mongoose")

//blueprint for users 
const Schema = mongoose.Schema;

//fiels, everyuser document must follow these rules.
const userSchema = new Schema({
    fullName: {type: String},
    email: {type: String},
    password: {type: String},
    createdOn: { type: Date, default: new Date().getTime() },
});

module.exports = mongoose.model("User", userSchema);