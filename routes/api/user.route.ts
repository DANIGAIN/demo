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
    adminProfile,
    getAllUser,
 } from "../../controllers/auth.controller";
import {
     loginUserSchema,
     registerUserSchema, 
     sendOptSchema, 
     updateUserSchema,
     verifyOptSchema
} from "../../validators/user.validator";
import validate from "../../middlewares/validate.middleware";
import { isAdmin, isAuthenticated, isUser } from "../../middlewares/auth.middleware";


const userRoutes = Router();

userRoutes.post('/register', validate(registerUserSchema), userRegistration);
userRoutes.post('/login', validate(loginUserSchema), userLogin);
userRoutes.get('/profile-by-admin', isAdmin, adminProfile);
userRoutes.get('/profile-by-user', isUser, userProfile);
userRoutes.get('/all', getAllUser);
userRoutes.post('/password-update/by-token', isAuthenticated, userPasswordUpdate);
userRoutes.delete('/delete-by-admin', isAdmin , userDeleteByAdmin);
userRoutes.put('/profile-update', isAuthenticated , validate(updateUserSchema) ,userProfileUpdate);
userRoutes.post('/forget-password', validate(sendOptSchema), userForgetPassword);
userRoutes.post('/forget-password/otp', validate(verifyOptSchema), userForgetPasswordByOtp);

export default userRoutes;             