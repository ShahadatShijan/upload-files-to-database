const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

//file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const name = Date.now() + '-' + file.originalname;
      cb(null, name)
    }
})
  
const upload = multer({ storage: storage })

//user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    }
})

//create model
const user = mongoose.model("users",userSchema);

//connect database
const connectDB = async () =>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/myDemo");
        console.log("database is connected.")
    } catch (error) {
        console.log("database is not connected");
        console.log(error.message);
        process.exit(1);
    }
}

app.get("/",(req,res) =>{
    res.sendFile(__dirname+"/index.html")
});

app.post("/register", upload.single('image'), async (req,res) =>{
    try {
        const newUser = new user({
            name: req.body.name,
            file: req.file.filename
        })
        await newUser.save();
        res.status(201).send("uploaded!");
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


app.listen(port, async()=>{
    console.log(`Server is running at http://localhost:${port}`);
    await connectDB();
})