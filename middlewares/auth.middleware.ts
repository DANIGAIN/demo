import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

const isAuthenticated = (req, res, next) =>{
    const token = req.headers.cookie.substring(6);
    if(token){
        const decode = jwt.verify(token, process.env.SECRET) as JwtPayload;
        if(!decode){
            return res.status(401).json({
                mgs:"Unauthorize",
                error:true
            })
        }
    }else {
        return res.status(401).json({
            mgs:"Unauthorize !",
            error:true
        })
   }
    next();
}

const isAdmin = (req, res , next) =>{
    const token = req.headers.cookie.substring(6);
    if(token){
        const decode = jwt.verify(token, process.env.SECRET) as JwtPayload;
        if(!decode || decode?.role != "admin" ){
            return res.status(401).json({
                mgs:"Unauthorize",
                error:true
            })
        }
    }else {
        return res.status(401).json({
            mgs:"unauthorize !",
            error:true
    })}
    next();
}

export {
    isAdmin,
    isAuthenticated     
}  