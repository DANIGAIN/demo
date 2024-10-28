import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from "../models/user.model";
import { comparePassword, hashPassword } from "../utils/jwt";
import uploadImage from '../utils/upload';
import deleteImageFiles from '../utils/deleteImageFiles';
import { sendEmail } from '../utils/sendEmail';
import { GenerateOTP, VerifyTamp } from '../utils/verifyOtpTamp';
import Otp from '../models/otp.model';
import path from 'node:path';
dotenv.config();

export const userRegistration = async (req, res) => {
    const { email, name } = req.body;
    const address = req.body?.address ? JSON.parse(req.body.address) : null;
    let body = req.body;
    const newUser = {};
    newUser["role"] = "user";
    newUser["name"] = name;
    newUser["email"] = email;
    try {
        let query = {};
        if (!!body?.phone && !!body?.email) {
            query = {
                $or: [
                    { phone: body.phone },
                    { email: body.email }
                ]
            }
        } else {
            query = {
                [!!body?.phone ? 'phone' : 'email']: body?.phone || body?.email
            }
        }

        let find = await User.findOne(query);

        // if user is exist ---> 
        if (!!find) {
            return res.status(400).send({
                error: true,
                msg: 'User already registered'
            })
        }

        if (!!req.files?.image) {
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(req.files?.image.mimetype)) {
                return res.status(400).send({
                    error: true,
                    mgs: "Only jpeg, png and jpg files are allowed for image"
                })
            }
            const image = await uploadImage(email, req.files);
            if (!!image) {
                newUser["image"] = image;
            }
        }

        if (!!body.phone) {
            newUser["phone"] = body.phone;
        }
        if (!!body.password) {
            newUser["password"] = await hashPassword(body.password);
        }
        if (!!address) {
            newUser["address"] = address;
        }
        if (!!body.dateOfBirth) {
            newUser["dateOfBirth"] = Date.parse(body.dateOfBirth);
        }

        let user = await User.create(newUser);
        return res.status(200).send({
            error: false,
            msg: "User registered successfully",
            data: {
                role: user?.role

            }
        })

    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }

}
export const userLogin = async (req, res) => {
    try {
        let body = req.body;

        const user: any = await User.findOne({
            [!!body?.phone ? 'phone' : 'email']: body?.phone || body?.email
        })


        if (!user || !await comparePassword(body?.password, user?.password)) {
            return res.status(400).send({
                error: true,
                msg: 'Invalid credentials'
            })
        }

        jwt.sign({ _id: user?._id, name: user.name, role: user.role }, process.env.SECRET, {}, (error, token) => {
            if (error) throw error;
            return res.cookie('token', token, {
                expires: new Date(Date.now() + 2589200000),
                httpOnly: true,
            }).status(200).json({
                message: "Login successfully",
                success: true,
            });;
        })

    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}
export const userProfile = async (req, res) => {
    try {
        if (!!res.locals?.user) {
            const user = await User.findById(res.locals.user._id).select('-__v -password');
            if (!!user.image) {
                user.image = path.join(process.env.APP_DOMAIN, user.image)
            }
            return res.status(200).json({
                mgs: "User get successfully",
                data: user,
                error: false
            })
        } else {
            return res.status(401).json({
                mgs: "Please login your account",
                error: true
            })
        }
    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'

        })
    }
}

export const adminProfile = async (req, res) => {
    try {
        if (!!res.locals?.user) {
            const user = await User.findById(res.locals.user._id).select('-__v -password');
            if (!!user.image) {
                user.image = path.join(process.env.APP_DOMAIN, user.image)
            }
            return res.status(200).json({
                mgs: "User get successfully",
                data: user,
                error: false
            })
        } else {
            return res.status(401).json({
                mgs: "Please login your account",
                error: true
            })
        }
    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'
        })
    }
}
export const userPasswordUpdate = async (req, res) => {
    try {
        let body = req.body;

        if (!body?.password) {
            return res.status(422).send({
                error: true,
                msg: 'required new password'

            })
        }

        const token = req.headers.cookie.substring(6);
        if (token) {
            const decode = jwt.verify(token, process.env.SECRET) as JwtPayload;
            const user = await User.findById(decode._id);
            if (!decode || !user) {
                return res.status(401).send({
                    error: true,
                    msg: 'Unauthorize!'

                })
            }
            const newHash = await hashPassword(body.password);
            await User.findByIdAndUpdate(decode._id, {
                $set: {
                    password: newHash,
                }
            }, { new: true });
            return res.status(200).send({
                error: false,
                msg: 'Password is updated successfully'

            })


        }

    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'

        })
    }
}
export const userDeleteByAdmin = async (req, res) => {
    try {
        let { query } = req;
        let data = await User.findById(query._id)
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'User not found'
            })
        }

        if (!!data?.image) {
            await deleteImageFiles(data?.image, data?.email);
        }

        await User.deleteOne({ _id: query._id })
        return res.status(200).send({
            error: false,
            msg: 'Successfully deleted user',
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}
export const userProfileUpdate = async (req, res) => {
    const body = req.body;
    const address = req.body?.address ? JSON.parse(req.body.address) : null;
    try {
        const user = await User.findById(body._id);
        const token = req.headers.cookie.substring(6);
        if (!user) {
            return res.status(400).send({
                error: true,
                msg: 'User not found'
            })
        }

        if (token) {
            const decode = jwt.verify(token, process.env.SECRET) as JwtPayload;
            if (decode._id != user._id) {
                return res.status(401).send({
                    error: true,
                    msg: 'Unauthorize !'
                })
            }
        }
        let update = {};
        if (!!body.name) {
            update["name"] = body.name;
        }
        if (!!body.phone) {
            update["phone"] = body.phone;
        }
        if (!!body.email) {
            update["email"] = body.email;
        }
        if (!!req.files?.image) {
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(req.files?.image.mimetype)) {
                return res.status(400).send({
                    error: true,
                    mgs: "Only jpeg, png and jpg files are allowed for image"
                })
            }
            await deleteImageFiles(user?.image, user?.email);
            const image = await uploadImage(user.email, req.files);
            if (!!image) {
                update["image"] = image;
            }
        }


        if (!!body.password) {
            update["password"] = await hashPassword(body.password);
        }
        if (!!address) {
            update["address"] = address;
        }
        if (!!body.dateOfBirth) {
            update["address"] = Date.parse(body.dateOfBirth);
        }

        await User.findByIdAndUpdate(user._id, {
            $set: update
        }, { new: true }
        );
        return res.status(200).send({
            error: false,
            msg: 'User update successfully'
        })
    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'

        })
    }
}

export const userForgetPassword = async (req, res) => {
    try {
        let body = req.body;
        if (!!body?.email) {
            const user = await User.findOne({ email: body.email });
            if (!user) {
                return res.status(400).send({
                    error: true,
                    msg: 'User can not exist'
                })
            }
            const otp: String = await GenerateOTP(5);
            // const expiry = Date.now() + 5 * 60 * 1000 ;
            const findOtp = await Otp.findOne({
                email: body.email,
                action: body.action ,
            })
            if (!!findOtp) {
                return res.status(400).send({
                    error: true,
                    mgs: "Verification code alrady send . Try again later"
                })
            }

            await sendEmail(user.email, 'varify', 'Otp for demo application', VerifyTamp(user.name, otp))
            await Otp.create({
                email: body.email,
                action: body.action,
                otp: otp
            });
            return res.status(200).send({
                error: false,
                msg: 'OTP sent successfully',
                data: otp,
            })
        } else {
            return res.status(400).send({
                error: true,
                msg: 'Valid email is required'
            })

        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'

        })
    }
}
export const userForgetPasswordByOtp = async (req, res) => {
    try {
        let body = req.body;
        const otp = await Otp.findOne({ email: body.email });
        if (!otp) {
            return res.status(400).send({
                error: true,
                msg: 'Otp can not exist'
            })
        }

        const comTime = new Date(otp.createdAt).getDate() * 2 * 60 * 1000 >= new Date(otp.createdAt).getDate();

        if (otp.email == body.email && otp.otp == body.otp && comTime) {
            const user = await User.findOne({ email: body.email });
            jwt.sign({ _id: user?._id, name: user.name, role: user.role }, process.env.SECRET, {}, (error, token) => {
                if (error) throw error;
                return res.cookie('token', token, {
                    expires: new Date(Date.now() + 2589200000),
                    httpOnly: true,
                }).status(200).json({
                    message: "Enter your new password",
                    error: false,
                });;
            })
        } else {
            return res.status(422).send({
                error: true,
                msg: "invalid credentials",

            })

        }

    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'

        })
    }
}

export const getAllUser = async (req, res) => {
    try {
        const { query } = req;
        const filter = {};
        if (!!query?.name) filter["name"] = query.name as string ;
        if (!!query?.email) filter["email"] = query.email as string ;
        if (!!query?.phone) filter["phone"] = query.phone as string;
        if (!!query?.role && ['user', 'admin'].includes(query?.role)) {
            filter["role"] = query.role as string;
        }
        // if (!!query?.address) {
        //     filter["$or"] = [
        //         { city: query?.address.city },
        //         { country: query?.address.country }
        //     ]
        // }

        // console.log(query);

        
        // if (!!query?.dateOfBirth) filter["dateOfBirth"] = Date.parse(query.dateOfBirth);

        const users = await User.aggregatePaginate(
            [
                {
                    $match: filter,
                },
                {
                    $addFields: {
                        image: { $concat:[process.env.APP_DOMAIN ,'$image']
                        }
                    }
                },
                {
                    $project:{
                        password:0,
                        __v:0,
                    }
                }
            ],
            {
                limit: query.limit || 20,
                page: query.page || 1,
                sort: { createdAt: -1 },
            }
        );
        return res.status(200).send({
            error: false,
            data: users ,
            msg: 'get all user successfully'

        })         

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: true,
            msg: 'Internal server error'

        })
    }
}
