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
exports.placeOrder = exports.getOrderInfo = void 0;
const cart_model_1 = require("../models/cart.model");
const order_model_1 = require("../models/order.model");
const user_model_1 = require("../models/user.model");
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getOrderInfo = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const userInfo = yield user_model_1.UserModel.findById(userId);
    if (!userInfo) {
        return res.status(404).json(new ApiResponse_1.default(404, "User not found", null));
    }
    const cartInfo = yield cart_model_1.CartModel.findOne({ addedBy: userId });
    if (!cartInfo) {
        return res.status(404).json(new ApiResponse_1.default(404, "Cart not found", null));
    }
    return res.status(200).json(new ApiResponse_1.default(200, "Cart info fetched", {
        orderedBy: userId,
        items: cartInfo.products,
        total: cartInfo.totalAmount,
        phoneNumber: userInfo.phoneNumber,
    }));
}));
exports.placeOrder = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderInfo } = req.body;
    if (!orderInfo) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "Invalid order info", null));
    }
    const transactionId = `Tr-${new Date().getTime()}-${orderInfo.orderedBy}`;
    const newOrder = yield order_model_1.OrderModel.create({
        address: orderInfo.address,
        items: orderInfo.items,
        orderedBy: orderInfo.orderedBy,
        status: "completed",
        total: orderInfo.total,
        transactionId,
    });
    if (!newOrder) {
        return res.status(500).json(new ApiResponse_1.default(500, "Order failed", null));
    }
    yield cart_model_1.CartModel.findOneAndDelete({ addedBy: orderInfo.orderedBy });
    return res.status(201).json(new ApiResponse_1.default(201, "Order placed", null));
}));
