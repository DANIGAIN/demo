import jwt, { JwtPayload } from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
    const token = req.headers.cookie.substring(6);
    if (token) {
        const decode = jwt.verify(token, process.env.SECRET) as JwtPayload;
        if (!!decode) {
            res.locals.user = decode;
            return next();
        }
    }
    return res.status(401).json({
        mgs: "Unauthorize !",
        error: true
    })
   
}

const isAdmin = (req, res, next) => {
    const token = req.headers.cookie.substring(6);
    if (!!token) {
        const decode = jwt.verify(token, process.env.SECRET) as JwtPayload;
        if (!!decode && decode?.role == "admin") {
            res.locals.user = decode;
            return next();
        }
    } 
    return res.status(401).json({
        mgs: "Unauthorized !",
        error: true
    })
}

const isUser = (req, res, next) => {
    const token = req.headers.cookie.substring(6);
    if (!!token) {
        const decode = jwt.verify(token, process.env.SECRET) as JwtPayload;
        if (!!decode && decode?.role == "user") {
            res.locals.user = decode;
            return next();
        }

    } 
    return res.status(401).json({
        mgs: "Unauthorized !",
        error: true
    });
}

export {
    isAdmin,
    isUser,
    isAuthenticated
}  