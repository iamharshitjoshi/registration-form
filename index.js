// lib install getting import here 
const express = require("express")
const mongoose = require("mongoose")

// form submit - data aata hai i.e complex - use readable format
const bodyParser = require("body-parser")

// hide mongodb ke username, pswd
const dotenv = require("dotenv");

//express instance
const app = express ();
dotenv.config(); // for use dotenv

const port = process.env.PORT || 3000; // port pai run code

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.a1xnyrq.mongodb.net/?retryWrites=true&w=majority`, {
    // for warning 
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

// registration schema  - form ka data 
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});


// model of registration schema 
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


// handle get request 
app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/pages/index.html")
})

// handle post request 
app.post("/register", async (req, res) =>{
    try{
        // return obj which dvide email pswd 
        // detructuring 
       const {name, email, password} = req.body;
       

       // user pahele se exist toa nhi karta 
       const existingUser = await Registration.findOne({email : email});

       // check for existing user
       if(!existingUser){

       // data fetch - is save 
        const registrationData = new Registration({
            name,
            email,
            password
        });
           await registrationData.save();
           res.redirect("/success");
       }
       else{
           console.log("User already exist");
           res.redirect("/error");
       } 
    }
    catch (error){
       console.log(error);
       res.redirect("/error");
    }
})

app.get("/success", (req, res) =>{
    res.sendFile(__dirname + "/pages/success.html")
})
app.get("/error", (req, res) =>{
    res.sendFile(__dirname + "/pages/error.html")
})

// for run nodejs code
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})