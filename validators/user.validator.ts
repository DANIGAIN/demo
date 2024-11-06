import { z } from 'zod';

const registerUserSchema = z.object({
    name: z
        .string({required_error:"Name should be required"})
        .min(1, { message: "Name should be required" })
        .max(255, { message: "Name should be at last 255 character" }),
    email: z
        .string({ required_error: "Email is required" })
        .min(1, { message: "Email should be at min 1 character" })
        .email({ message: "This is a email field" }),
    password: z
        .string()
        .max(255, { message: "Password should be at max 255 character" })
        .optional(),
    role: z.enum(["admin", "user"]).optional(),
    phone: z
        .string()
        .max(11, { message: "Phone number should be at max 11 character" })
        .optional(),
    image: z
        .string()
        .optional(),
    dateOfBirth: z.string().optional(),
    address: z.string().optional(),
    // address: z
    //   .object({
    //     city : z
    //         .string()
    //         .max(255, { message: "City should be at max 255 character" })
    //         .optional(),
    //     country  : z
    //         .string()
    //         .max(255, { message: "Country should be at max 255 character" })
    //         .optional(),
    //   }).optional()
})

const loginUserSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .min(1, { message: "Email should be at min 1 character" })
        .email({ message: "This is a email field" }),
    password: z
        .string()
        .min(1, { message: "Password should be at min 4 character" })
        .max(255, { message: "Password should be at max 255 character" })
})

const updateUserSchema = z.object({
    _id: z.string({required_error:"_id should be required"}),
    name: z
        .string({required_error:"Name should be required"})
        .min(1, { message: "Name should be required" })
        .max(255, { message: "Name should be at last 255 character" })
        .optional(),
    email: z
        .string({ required_error: "Email is required" })
        .min(1, { message: "Email should be at min 1 character" })
        .email({ message: "This is a email field" })
        .optional(),
    password: z
        .string()
        .max(255, { message: "Password should be at max 255 character" })
        .optional()
        .optional(),
    role: z.enum(["admin", "user"]).optional(),
    phone: z
        .string()
        .max(11, { message: "Phone number should be at max 11 character" })
        .optional(),
    image: z
        .string()
        .optional(),
    dateOfBirth: z.string().optional(),
    address: z.string().optional(),
})

const sendOptSchema = z.object({
    action: z
         .string({required_error:"action is required"})
         .min(1, { message: "Action should be at min 1 character"})
         .max(255, { message: "Action should be at min 1 character" }),
    email: z
         .string({ required_error: "Email is required" })
         .min(1, { message: "Email should be at min 1 character" })
         .email({ message: "This is a email field" }),
});
const verifyOptSchema = z.object({
    otp: z
         .string({required_error:"Otp is required"}),
    email: z
         .string({ required_error: "Email is required" })
         .min(1, { message: "Email should be at min 1 character" })
         .email({ message: "This is a email field" }),
})

export {
    registerUserSchema,
    loginUserSchema,
    updateUserSchema,
    sendOptSchema,
    verifyOptSchema
};