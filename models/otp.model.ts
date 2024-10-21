import {model , Schema} from 'mongoose';

let schema = new Schema({
    action:{
        type:String,
        required:true,
    },
    email:String,
    otp:{
        type:String,
        required:true,
    },
    expireAt:{
        type:Date,
        default:Date.now,
        index:{expires:'2m'}
    }
},{timestamps:true});

const Otp = model('otp', schema);
export default Otp ;