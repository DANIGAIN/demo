const validate = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next()
    } catch (error) {
        return res.status(422).json({
            mgs: error.errors ? error?.errors[0]?.message : '',
            error: true,
        })
    }
}
export default validate;