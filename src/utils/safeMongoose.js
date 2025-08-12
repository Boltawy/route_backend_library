import mongoose, { isValidObjectId } from "mongoose";
import { responseError } from "./errorHandler.js";
//TODO Options object for all functions
//MIGHTDO: safeFindOrCreate, similar to Sequalize
//MIGHTDO: safeUpdateByIdAndVerifyOwner
//MIGHTDO: safeDeleteByIdAndVerifyOwner


/**
 * Safely performs a findOne operation on a Mongoose model.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {Object} filter - The filter to apply to find the document.
 * @param {Object} [options] - Options for the operation.
 * @param {string} [options.errMessage] - The error message to use if the operation fails.
 * @param {boolean} [options.errOnNotFound=false] - Whether to throw an error if no document is found.
 * @param {Object} [options.projection] - The projection to apply to the found document.
 * @returns {Promise<mongoose.Document>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeFindOne = async (model, filter, options = {}) => {
    const { errMessage, errOnNotFound = true, projection } = options;
    const { modelName } = model;
    let result;
    try {
        result = await model.findOne(filter, projection);
        if (!result && errOnNotFound) throw new Error();
        return result;
    } catch (error) {
        if (!result && errOnNotFound) throw new responseError(404, `${modelName} not found`);
        throw new responseError(500, errMessage || `Error reading ${modelName} from database`, error);
    }
};


/**
 * Safely performs a findById operation on a Mongoose model, validates the given id.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {string} id - The id of the document to find.
 * @param {Object} [options] - Options for the operation.
 * @param {string} [options.errMessage] - The error message to use if the operation fails.
 * @param {boolean} [options.errOnNotFound=false] - Whether to throw an error if no document is found.
 * @param {Object} [options.projection] - The projection to apply to the found document.
 * @returns {Promise<mongoose.Document>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeFindById = async (model, id, options = {}) => {
    const { errMessage, errOnNotFound = true, projection } = options;
    const { modelName } = model;
    if (!isValidObjectId(id)) throw new responseError(400, `Invalid ID format for ${modelName}`);
    let result;
    try {
        result = await model.findById(id, projection);
        if (!result & errOnNotFound) throw new responseError(404, `${modelName} not found`);
        return result;
    } catch (error) {
        if (error instanceof responseError) throw error;
        else throw new responseError(500, errMessage || `Error reading ${modelName} from database`, error);
    }
};


/**
 * Finds a document by its ID and verifies its ownership, it checks if the item has a reference to the owner.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {string} itemId - The ID of the document to find.
 * @param {string} ownerId - The ID of the user to verify as the owner of the document.
 * @returns {Promise<mongoose.Document>} The document if found and ownership is verified.
 * @throws {responseError} If the ID is invalid, the document is not found, or the user is not the owner.
 */

export const findByIdAndVerifyUser = async (model, itemId, userId) => { //Coupled with business logic
    if (!isValidObjectId(userId)) throw new responseError(400, `Invalid ID format for user`); //* change to "owner" for the reusable package
    const item = await safeFindById(model, itemId);
    if (item.userId != userId) throw new responseError(403, "Unauthorized: You don't have access to that resource");
    return item;
}



/**
 * Safely performs a find operation on a Mongoose model.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {Object} filter - The filter to apply to find the documents.
 * @param {Object} [options] - Options for the operation.
 * @param {string} [options.errMessage] - The error message to use if the operation fails.
 * @param {boolean} [options.errOnNotFound=false] - Whether to throw an error if no documents are found.
 * @param {Object} [options.projection={}] - The projection to apply to the found documents.
 * @param {Object} [options.sort=null] - The sort to apply to the found documents.
 * @param {boolean} [options.lean=false] - Whether to use lean() to get plain objects instead of mongoose documents.
 * @returns {Promise<mongoose.Document[]>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */

export const safeFind = async (model, filter, options = {}) => {
    const { errMessage, errOnNotFound, projection = {}, sort = null, lean = false } = options;
    const { modelName } = model;
    try {
        let query = model.find(filter, projection).sort(sort);
        if (lean) query.lean()
        const result = await query.exec();
        if (result.length == 0 && errOnNotFound) throw new responseError(404, `No ${modelName}s found`);
        return result;
    } catch (error) {
        if (error instanceof responseError) throw error;
        throw new responseError(500, errMessage || `Error reading ${modelName}s from database`, error);
    }
};


/**
 * Safely performs a create operation on a Mongoose model.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {Object} data - The data to create the document with.
 * @param {Object} [options] - Options for the operation.
 * @param {string} [options.errMessage] - The error message to use if the operation fails.
 * @param {ClientSession} [options.session] - The session to use if you want to use a transaction.
 * @returns {Promise<mongoose.Document|mongoose.Document[]>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeCreate = async (model, data, options = {}) => {
    const { errMessage, session } = options;
    const { modelName } = model;
    try {
        let result;
        if (session) {
            result = await model.create(data, { session, ordered: true });
        } else {
            result = await model.create(data);
        }
        return result;
    } catch (error) {
        throw new responseError(500, errMessage || `Error creating ${modelName} in database`, error.message || error);
    }
};

/**
 * Safely performs an update operation on a Mongoose model.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {Object} filter - The filter to apply to find the document to update.
 * @param {Object} updateData - The data to update the document with.
 * @param {string} [errMessage="Error updating in database"] - The error message to use if the operation fails.
 * @returns {Promise<mongoose.UpdateWriteOpResult>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeUpdate = async (model, filter, updateData, errMessage) => {
    const { modelName } = model;
    try {
        const result = await model.updateOne(filter, updateData, { new: true, runValidators: true });
        return result;
    } catch (error) {
        throw new responseError(500, errMessage || `Error updating ${modelName} in database`, error);
    }
};

/**
 * Safely performs an update operation on a Mongoose model by Id, validating the update data.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {string} id - The id of the document to update.
 * @param {Object} updateData - The data to update the document with.
 * @param {string} [errMessage="Error updating in database"] - The error message to use if the operation fails.
 * @returns {Promise<mongoose.Document>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeUpdateById = async (model, id, updateData, errMessage) => {
    const { modelName } = model;
    if (!isValidObjectId(id)) throw new responseError(400, `Invalid ID format for ${modelName}`);
    try {
        const result = await model.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!result) throw new responseError(404, `${modelName} not found`);
        return result;
    } catch (error) {
        if (error instanceof responseError) throw error;
        throw new responseError(500, errMessage || `Error updating ${modelName} in database`, error);
    }
};




/**
 * Safely performs a delete operation on a Mongoose model, with soft delete by default.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {Object} filter - The filter to apply to find the documents to delete.
 * @param {Object} [options] - Options for the operation.
 * @param {boolean} [options.hardDelete=false] - Whether to perform a hard delete.
 * @param {boolean} [options.errOnNotFound=true] - Whether to throw an error if no documents are found.
 * @param {boolean} [options.addDeletedAt=false] - Whether to add a 'deletedAt' timestamp or a 'isDeleted' flag on soft delete.
 * @param {string} [options.errMessage] - The error message to use if the operation fails.
 * @param {ClientSession} [options.session] - The session to use if you want to use a transaction.
 * @returns {Promise<mongoose.DeleteWriteOpResultObject> | Promise<mongoose.UpdateWriteOpResult>} The result of the operation.
 * @throws {responseError} If the operation fails.
 */
export const safeDelete = async (model, filter, options = {}) => {
    const { hardDelete = false, errOnNotFound = true, addDeletedAt = true, errMessage, session } = options;
    const { modelName } = model;
    try {
        if (hardDelete) {
            await model.deleteMany(filter, { session });
        }
        else {
            const updateData = addDeletedAt ? { deletedAt: new Date() } : { isDeleted: true };
            let query = model.updateMany(filter, updateData);
            if (session) query = query.session(session);
            const results = await query.exec();
            if (results.length == 0 && errOnNotFound) throw new responseError(404, `${modelName} not found`);
            return results;
        }
    } catch (error) {
        if (error instanceof responseError) throw error;
        throw new responseError(500, errMessage || `Error deleting ${modelName} from database`, error.message || error);
    }
};


/**
 * Safely performs a delete operation on a Mongoose model by Id, soft deletes by default.
 * @param {mongoose.Model} model - The Mongoose model to perform the operation on.
 * @param {string} id - The id of the document to delete.
 * @param {Object} [options] - Options for the operation.
 * @param {boolean} [options.hardDelete=false] - Whether to perform a hard delete.
 * @param {boolean} [options.errOnNotFound=true] - Whether to throw an error if no document is found.
 * @param {boolean} [options.addDeletedAt=false] - Whether to add a 'deletedAt' timestamp on soft delete.
 * @param {string} [errMessage] - The error message to use if the operation fails.
 * @returns {Promise<mongoose.Document|null>} The result of the operation.
 * @throws {responseError} If the id is invalid, the document is not found, or an error occurs during the operation.
 */

export const safeDeleteById = async (model, id, options = {}) => { //TODOTEST
    const { hardDelete = false, errOnNotFound = true, addDeletedAt = true, errMessage } = options;
    const { modelName } = model;
    let result;
    if (!isValidObjectId(id)) throw new responseError(400, `Invalid ID format for ${modelName}`);
    try {
        if (hardDelete) await model.findByIdAndDelete(id);
        else {
            const updateData = addDeletedAt ? { deletedAt: new Date() } : { isDeleted: true };
            await model.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        }
        result = await model.findById(id);
        if (!result && errOnNotFound || result?.deletedAt && errOnNotFound) throw new responseError(404, `${modelName} not found`);
        return result;
    } catch (error) {
        if (error instanceof responseError) throw error;
        throw new responseError(500, errMessage || `Error deleting ${modelName} from database`, error);
    }
};



