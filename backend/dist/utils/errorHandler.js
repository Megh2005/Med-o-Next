"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = __importDefault(require("./ApiResponse"));
const errorHandler = (err, req, res, next) => {
    // Handle the error
    res
        .status(err.statusCode || 500)
        .json(new ApiResponse_1.default(err.status || 500, err.message, null));
};
exports.default = errorHandler;
