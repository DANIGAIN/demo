import bcrypt from 'bcrypt';

const hashPassword = (password:any) =>{
    return new Promise((resolve,reject) =>{
        bcrypt.genSalt(12 , (error, solt) =>{
            if(error) reject(error);
            bcrypt.hash(password, solt, (error, hash)=>{
                if(error) reject(error);
                resolve(hash);
            })
        })
    })
}
const comparePassword = (password:any, hash:any) => {
    return bcrypt.compare(password, hash)
}

export {hashPassword ,comparePassword}; 