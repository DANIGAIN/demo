import {model , Schema , Document } from 'mongoose';
import { aggregatePaginate } from '../utils/mongoose';

interface IUser extends Document {
    name: string,
    email: string,
    phone: string,
    password:string,
    role:string,
    image:string,
    address: {
        city: string;
        country: string;
    };
    dateOfBirth:Date
    createdAt: Date,
    updatedAt: Date,
}

const schema = new Schema<IUser>({
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

schema.plugin(aggregatePaginate);


const User = model<IUser >('User', schema);

export default User ;