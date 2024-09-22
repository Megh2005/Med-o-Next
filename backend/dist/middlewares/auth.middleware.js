"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
exports.verifyToken = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json(new ApiResponse_1.default(401, "Unauthorized", null));
    }
    const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
        return res.status(400).json(new ApiResponse_1.default(400, "Invalid Token", null));
    }
    const user = yield user_model_1.UserModel.findById(decodedToken.id).select("-password");
    decodedToken;
    if (!user) {
        return res.status(404).json(new ApiResponse_1.default(404, "User not found", null));
    }
    req.isAdmin = decodedToken.isAdmin;
    req.userId = decodedToken.id.toString();
    next();
}));
