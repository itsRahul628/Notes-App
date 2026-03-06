
require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("Mongo error:", err));

const User = require("../models/user.model");
const Note = require("../models/note.model")

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());

//jwt
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../utilities");


app.use(cors());


app.get("/", (req, res) => {
  res.send("API Running");
});

//Backend ready!!!


//create Account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body || {};


    if(!fullName) {
        return res
          .status(400)
          .json({error: true, message: "Full name is required"});
    }

    if(!email) {
        return res.status(400).json({error: true, message: "Email is reqiured"})
    }

    if(!password) {
        return res.status(400).json({error: true, message: "Password is required"})
    }

    const isUser = await User.findOne({ email });

    if(isUser) {
        return res.json({
            error: true,
            message: "User already exist",
        })
    }

    const user = new User({
        fullName,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful",
    });
});

//log in
app.post("/login", async (req, res) => {

    const {email , password} = req.body || {};

    if(!email) {
        return res.status(400).json({ message: "Email is required"});
    }

    if(!password) {
        return res.status(400).json({message :"Password is required"});
    }

    //find user in database
    const userInfo = await User.findOne({ email: email });

    //if user is not found
    if(!userInfo) {
        return res.status(400).json({message: "User not Found"});
    }

    //if both found & matched generate JWT --> Login Succesfull
    if(userInfo.email == email && userInfo.password == password) {
        const user = {user: userInfo};
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });
        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        })
    } else {
        return res.status(400).json({
            error: true,
            message: "Invalid Credential",
        });
    }
})

//Get User
app.get("/get-user", authenticateToken, async (req, res) => {
    const {user} = req.user;

    const isUser = await User.findOne({ _id: user._id });

    if(!isUser) {
        return res.status(401).json({error: true, message: "Unauthorized"});
    }
    return res.json({user: {fullName: isUser.fullName, email:isUser.email, 
    "_id": isUser._id, createdOn: isUser.createdOn},
     message: ""})
})


//Add Note
//we only use authenticateToken for routes that need a logged-in user
app.post("/add-note", authenticateToken, async (req, res) => {
   const {title, content, tags} = req.body || {};
   const { user } = req.user;

   if(!title) {
    return res.status(400).json({error: true, message: "Title is required"})
   }

   if(!content) {
    return res.status(400).json({error: true, message: "Content is required"})
   }


   try{
    const note = new Note({
        title,
        content,
        tags: tags || [],
        userId: user._id,
    });
    await note.save();
    return res.json({error: false, note, message: "Note added sucessfully"})

   } catch (error) {
      return res.status(500).json({error: true, message: "Internal Server Error"})
   }
})

//Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const {title, content, tags, isPinned} = req.body || {};
    const  user  = req.user;

    if(!title && !content && !tags) {
        return res.status(400).json({error: true, message: "No Changes Provided"})
    }

    try{
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if(!note) {
            return res.status(404).json({ error: true, message: "Note not found"});
        }

        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;
        if (typeof isPinned === "boolean") {
          note.isPinned = isPinned;
        }


        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        })
    }catch (error) {
        return res.status(500).json({error: true, message: "Internal Server Error" })
    }
})

//Get all Notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
    const user = req.user;

    try{
        const notes = await Note.find({ userId: user._id}).sort({ isPinned: -1})
        return res.json({error: false, notes, message: "All notes retrieved successfully"});

    } catch(error) {
        return res.status(500).json({error: true, message: "Internal Server Error"})
    }
})

//Delete note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const user = req.user;

    try{
        const note = await Note.findOne({ _id: noteId, userId: user._id});
        if(!note) {
            return res.status(404).json({ error: true, message: "Note not found"})
        }

        await Note.deleteOne({ _id: noteId, userId: user._id});
        return res.json({ error: false, message: "Note deleted successfully"});

    } catch (error) {
        return res.status(500).json({error: true, message: "Internal Server Error"})
    }
})

//update isPinned value
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body || {};
    const { user } = req.user;

    if (typeof isPinned !== "boolean") {
        return res.status(400).json({
            error: true,
            message: "No valid changes provided"
        });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not found"
            });
        }

        note.isPinned = isPinned;

        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note pinned status updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});


//Search Notes
    app.get("/search-notes", authenticateToken, async (req, res) => {
    const user = req.user;
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({
            error: true,
            message: "Search Query is required"
        });
    }

    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } }
            ]
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retrieved successfully"
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});


module.exports = app;