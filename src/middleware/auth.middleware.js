import jwt from "jsonwebtoken";
import { responseError } from "../utils/errorHandler.js";
import { findByIdAndVerifyUser } from "../utils/safeMongoose.js";

const authenticate = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) throw new responseError(401, "Unauthenticated - Invalid Token");
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") throw new responseError(401, "Unauthenticated - Invalid Token");

    let _id;
    try {
        ({ _id, role } = jwt.verify(token, process.env.JWT_ACCESS_SECRET));
    } catch (error) {
        throw new responseError(401, "Unauthenticated - Invalid Token");
    }
    req.userRole = role;
    req.userId = _id;
    next();
};

export const authorizeAdmin = (req, res, next) => {
    if (req.userRole !== "admin") {
        throw new responseError(403, "Forbidden");
    }
    next();
};

export const authorizeAdminOrOwner = (req, res, next) => {
    if (req.userRole !== "admin") {
        throw new responseError(403, "Forbidden");
    }
    checkBookOwnership(req.userId, req.params.id);
    next();
};

const checkBookOwnership = async (userId, bookId) => {
    if (!isValidObjectId(userId)) throw new responseError(400, `Invalid ID format for user`);
    if (!isValidObjectId(bookId)) throw new responseError(400, `Invalid ID format for book`);
    const item = await safeFindById(bookModel, bookId);
    if (item.userId != userId) throw new responseError(403, "Unauthorized: You don't have access to that resource");
}


export { authenticate };

