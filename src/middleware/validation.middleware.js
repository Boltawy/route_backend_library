import { responseError } from "../utils/errorHandler.js";

//MIGHTDO Create a schema for schemas, lol. (Probably Typescript)


function validate(schema) {
    const { headers, params, query, body } = schema;
    return (req, res, next) => {
        if (headers) {
            const { error } = headers.validate(req.headers);
            if (error) {
                console.log(error)
                if (error) return next(new responseError(400, "JOI Validation Error"));
            }
        }

        if (params) {
            const { error } = params.validate(req.params);
            if (error) {
                console.log(error)
                if (error) return next(new responseError(400, "JOI Validation Error"));
            }
        }

        if (query) {
            const { error } = query.validate(req.query);
            if (error) {
                console.log(error)
                if (error) return next(new responseError(400, "JOI Validation Error"));
            }
        }

        if (body) {
            if (req.headers["content-type"] !== "application/json") return next(new responseError(400, "Validation error: body must be a JSON object"));
            const { error } = body.validate(req.body);
            if (error) {
                console.log(error)
                if (error) return next(new responseError(400, "JOI Validation Error"));
            }
        }

        next();
    };
}


export { validate };



/* NOTES:
Joi validation only works when the request body is a JSON object and not completely empty.




*/