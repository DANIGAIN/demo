import fs  from 'node:fs'
import path from 'node:path';
import { logger } from './logger';
const deleteImageFiles = (image, email) =>{
    let imageDir = path.join(__dirname , '../' , 'public' , email);
    try{
        if(fs.existsSync(imageDir)){
            fs.rmSync(imageDir, { recursive: true, force: true });
            const message =`Image folder for ${email} deleted successfully.`; 
            logger(message , 'success');
        }
    }catch(error){
        throw error ;
    }      
   

} 

export default deleteImageFiles ;