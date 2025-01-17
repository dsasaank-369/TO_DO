const express=require("express");
const cors= require("cors");
const app=express();
const mongoose =require("mongoose");
require('dotenv').config();
const authRoutes=require("./routes/authRoutes")
const toDoRoutes=require("./routes/ToDoRoutes")


const port=process.env.PORT||5001;

app.use(cors());
app.use(express.json());

app.use('/api',authRoutes);
app.use('/api/todo',toDoRoutes);


mongoose.connect(process.env.connect_db).then((result)=>{ 
    console.log("DB connected");
}).catch(err=>{
    console.log(err);
});



// app.get("/hi/",(req,res)=>{
//     res.send("Hi! Again");
// })

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
    
})