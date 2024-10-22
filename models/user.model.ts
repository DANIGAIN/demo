import {model , Schema} from 'mongoose';

const schema = new Schema({
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        index:true,
    },
    email:{
        type:String,
        index:true,
        required:true,
        lowercase: true
    },
    password:String,
    role:{
        type:String,
        enum:["admin","user"],
        required:true,
    },
    image:String, 
    address:{
        city:String,
        country:String
    },
    dateOfBirth:{
        type:Date,
    },
},{timestamps:true});

const User = model('user', schema);

export default User ;