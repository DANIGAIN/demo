export const  VerifyTamp = (name , otp ) => {
    return (
        `<div>
            <p>Hello ${ name } </p> 
            <p> Please  collect your otp for forget password </p>
            <p> OTP : ${otp} </p>
        </div>`
    )
}


export const GenerateOTP = (length:number):string =>{
    if(length < 0 )return '';
    const max:number = Math.pow(10, length);
    const min:number = Math.pow(10, length -1);
    const otp:number = Math.floor(Math.random() * (max - min) + min);
    return otp.toString();
}