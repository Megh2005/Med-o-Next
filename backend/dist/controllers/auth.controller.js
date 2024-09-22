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
exports.checkAdmin = exports.login = exports.signup = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const signup_schema_1 = __importDefault(require("../lib/schemas/signup.schema"));
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const user_model_1 = require("../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.signup = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, confirmPassword, phoneNumber } = req.body;
    const { success } = signup_schema_1.default.safeParse({
        name,
        email,
        password,
        confirmPassword,
        phoneNumber,
    });
    if (!success) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "Invalid request body", null));
    }
    const isExistingUser = yield user_model_1.UserModel.findOne({
        $or: [{ email }, { phoneNumber }],
    });
    if (isExistingUser) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "User already exists", null));
    }
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
    let isAdmin = false;
    if (email === process.env.ADMIN_EMAIL) {
        isAdmin = true;
    }
    const createdUser = yield user_model_1.UserModel.create({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        isAdmin,
    });
    if (!createdUser) {
        return res
            .status(500)
            .json(new ApiResponse_1.default(500, "Error creating user", null));
    }
    return res.status(201).json(new ApiResponse_1.default(201, "User created successfully", {
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        phoneNumber: createdUser.phoneNumber,
        isAdmin: createdUser.isAdmin,
    }));
}));
exports.login = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_model_1.UserModel.findOne({ email });
    if (!user) {
        return res.status(404).json(new ApiResponse_1.default(404, "User not found", null));
    }
    const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "Invalid credentials", null));
    }
    // generate token
    const token = jsonwebtoken_1.default.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
    return res.status(200).json(new ApiResponse_1.default(200, "Login successful", {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
        },
        token,
    }));
}));
exports.checkAdmin = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const isAdmin = decodedToken.isAdmin;
    return res.status(200).json(new ApiResponse_1.default(200, "Success", { isAdmin }));
}));
