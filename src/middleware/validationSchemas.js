import Joi from "joi";

export const signupSchema = {
    body: Joi.object({
        name: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9 ]+$')) //Alphanum + space
            .min(3)
            .max(25)
            .required(),

        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(8)
            .max(30)
            .required(),
        role: Joi.string()
            .valid('admin', 'member')
            .required()
    })
};

export const loginSchema = {
    body: Joi.object({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .required()
    })
};

export const tasklistSchema = {
    body: Joi.object({
        title: Joi.string()
            .max(40)
            .required(),
        description: Joi.string()
            .max(200),
    })
}




export const bookSchema = {
    body: Joi.object({
        title: Joi.string()
            .max(40)
            .required(),
        description: Joi.string()
            .max(200),
        author: Joi.string()
            .max(200),
        availableCopies: Joi.number()
            .min(0)
            .max(200),
        publishedYear: Joi.number()
            .min(0)
            .max(2025),
    })
}

export const updateBookSchema = {
    body: Joi.object({
        title: Joi.string()
            .max(40),
        description: Joi.string()
            .max(200),
        author: Joi.string()
            .max(200),
        availableCopies: Joi.number()
            .min(0)
            .max(200),
        publishedYear: Joi.number()
            .min(0)
            .max(2025),
    })
}


export const borrowSchema = {
    body: Joi.object({
        bookId: Joi.string()
            .required(),
        userId: Joi.string()
            .required(),
    })
}

export const returnSchema = {
    body: Joi.object({
        bookId: Joi.string()
            .required(),
        userId: Joi.string()
            .required(),
    })
}

//MIGHTDO: A way to sync mongoose schemas and joi schemas (joigoose)