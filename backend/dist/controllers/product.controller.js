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
exports.getProductById = void 0;
const product_model_1 = require("../models/product.model");
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getProductById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.url;
    const id = url.split("/").pop();
    if (!id) {
        return res.json(new ApiResponse_1.default(400, "ID is required", null));
    }
    const response = yield product_model_1.ProductModel.findById(id);
    if (!response) {
        return res.json(new ApiResponse_1.default(400, "Product not found", null));
    }
    return res.json(new ApiResponse_1.default(200, "Product found", response));
}));
