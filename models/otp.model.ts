import {model , Schema , Document} from 'mongoose';

interface IOtp extends Document{
    action:string,
    email:string,
    otp:string,
    expireAt:Date,
}

let schema = new Schema<IOtp>({
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

const Otp = model<IOtp>('otp', schema);
export default Otp ;