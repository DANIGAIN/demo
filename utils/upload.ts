import path from "node:path";
import fs from "node:fs";
import { logError, logSuccess } from "./logger";

const  uploadImage = (email, file) =>{
    const uploadDir  = path.join(__dirname , "../" , "public" ,email);
    if(!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir , {recursive:true})
    }
    const originalname = file.image.name ;
    const fileExt =  path.extname(originalname);
    const filename = originalname.replace(fileExt ,"").toLowerCase().split(" ").join("-")+'-'+Date.now();
    const imageFile = filename + fileExt ;

    const filePath = path.join(uploadDir, imageFile);
    const fileUploadPath = './' + filePath.substring(filePath.indexOf("public")); 
    fs.writeFile(filePath, file.image.data, (error) => {
      if(error) {
        logError(error);
      } else {
        logSuccess({
          message: `File uploaded successfully to ${filePath}`,
          stack: "success"
        });
      }
     })
    return fileUploadPath || null; 
}     
export default uploadImage ;            