import { Router } from "express";
import { 
    userRegistration,
    userLogin,
    userProfile,
    userForgetPassword,
    userPasswordUpdate,
    userDeleteByAdmin,
    userProfileUpdate,
    userForgetPasswordByOtp,
    userForgetPasswordUseNewPassword
 } from "../../controllers/auth.controller";
import {
     loginUserSchema,
     registerUserSchema, 
     updateUserSchema
} from "../../validators/user.validator";
import validate from "../../middlewares/validate.middleware";
import { isAdmin, isAuthenticated } from "../../middlewares/auth.middleware";


const userRoutes = Router();

userRoutes.post('/register', validate(registerUserSchema), userRegistration);
userRoutes.post('/login', validate(loginUserSchema), userLogin);
userRoutes.get('/profile', isAuthenticated , userProfile);
userRoutes.post('/password-update/by-token', isAuthenticated, userPasswordUpdate);
userRoutes.delete('/delete-by-admin', isAdmin , userDeleteByAdmin);
userRoutes.put('/profile-update', isAuthenticated , validate(updateUserSchema) ,userProfileUpdate);
userRoutes.post('/forget-password', userForgetPassword);
userRoutes.post('/forget-password/otp', userForgetPasswordByOtp);
userRoutes.post('/forget-password/password', userForgetPasswordUseNewPassword);


export default userRoutes;