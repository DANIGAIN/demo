import moment from "moment";
import path from 'node:path';
import fs from 'node:fs';

export const logger = (message:string , file:string) =>{
    let logFile = `./logs/${moment().format('YYYY/MM/DD')}/${file}.log`;
    const dirPath = path.dirname(logFile);
    if(!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath ,{recursive:true})
    }
    let separator = '-----------------------------------------------------------';
    const time = moment().toISOString();
    message = `${separator} \n Time : ${time} \n ${message} \n ${separator} \n\n`
    fs.appendFile(logFile ,message , (error) =>{
        if(!error) return ;
        console.log("Error writing log: \n" +error);
    })
}

export  const logError = (e:any) =>{
    let message = `Error: ${e.message} /n`+ `Stack : ${e.stack}`;
    logger(message , 'error');
}

export const logSuccess = (e:any) =>{
    let message = `Success : ${e.message} \n` +`Stack : ${e.stack}`;
    logger(message ,'success');
}
