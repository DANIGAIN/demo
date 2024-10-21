import User from "../models/user.model";
import { hashPassword } from "./jwt";
import { logError, logger } from "./logger";

const seedAdmin = async() =>{
    try{
        //get admin 
        let admin = await User.findOne({
            role:'admin',
        }, '_id');
        if(!admin){
            let email = "admin@gmail.com"
            let password = "123456";
            await User.create({
                name:"Admin",
                email,
                password: await hashPassword(password),
                role:"admin"
            })
            let message = `Admin account created` +
                `\nEmail: ${email}` +
                `\nPassword: ${password}`

            logger(message , 'info');
        }

    }catch(error){
        logError(error);
    }
}

export default seedAdmin;