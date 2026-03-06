//talks to mangodb.
const mongoose = require("mongoose");

//create a Schema(blueprint)
const Schema = mongoose.Schema;

//this are fields inside, Whenever I save a note, it must follow these rules.
const noteSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    tags: { type: [String], defualt: []},
    isPinned: {type: Boolean, default: false},
    createdOn: {type: Date, default: new Date().getTime() },
})

module.exports = mongoose.model("Note", noteSchema);

// We are creating a blueprint for data that will be stored in MongoDB.

//Every note in my app look like this.