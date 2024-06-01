import mongoose from "mongoose";

export const database = () =>{
    mongoose.connect('mongodb://127.0.0.1:27017/karan' ).then((res)=>{
        console.log("Database connected");
    }).catch((err)=>{
        console.log("Databse not connected")
    })
}