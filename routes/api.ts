import { Router } from "express";
import userRoutes from "./api/user.route";


const apiRoutes = Router();

apiRoutes.use('/user', userRoutes);

export default apiRoutes ;