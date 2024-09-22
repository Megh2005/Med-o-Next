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
exports.removeItemFromCart = exports.decreaseItemQuantity = exports.increaseItemQuantity = exports.getCartItems = exports.addToCart = void 0;
const cart_model_1 = require("../models/cart.model");
const product_model_1 = require("../models/product.model");
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const asyncHandler_1 = require("../utils/asyncHandler");
exports.addToCart = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "User id is required", null));
    }
    const { productId, quantity } = req.body;
    if (!productId) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "Product id is required", null));
    }
    const productInfo = yield product_model_1.ProductModel.findOne({ _id: productId });
    if (!productInfo) {
        return res
            .status(404)
            .json(new ApiResponse_1.default(404, "Product not found", null));
    }
    const alreadyExists = yield cart_model_1.CartModel.findOne({
        addedBy: userId,
        products: { $elemMatch: { product: productId } },
    });
    if (alreadyExists) {
        return res
            .status(200)
            .json(new ApiResponse_1.default(200, "Product already exists in cart", null));
    }
    const cart = yield cart_model_1.CartModel.findOne({ addedBy: userId });
    let currentTotalAmount = (cart === null || cart === void 0 ? void 0 : cart.totalAmount)
        ? parseFloat(cart.totalAmount)
        : 0;
    if (isNaN(currentTotalAmount)) {
        currentTotalAmount = 0; // Handle any cases where the conversion fails
    }
    // Calculate the new total amount
    const newTotalAmount = Math.round((currentTotalAmount + quantity * parseFloat(productInfo.price)) * 100) / 100;
    const response = yield cart_model_1.CartModel.findOneAndUpdate({
        addedBy: userId,
    }, {
        $push: { products: { product: productId, quantity } },
        $set: {
            totalAmount: newTotalAmount.toString(),
        },
    }, {
        upsert: true,
        new: true,
    });
    if (!response) {
        return res
            .status(500)
            .json(new ApiResponse_1.default(500, "Error updating cart", null));
    }
    const product = yield product_model_1.ProductModel.findOne({ _id: productId }).select("name genericName imageUrl _id price");
    return res
        .status(201)
        .json(new ApiResponse_1.default(201, "Product Added to cart", product));
}));
exports.getCartItems = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "User id is required", null));
    }
    const response = yield cart_model_1.CartModel.findOne({ addedBy: userId }).populate({
        path: "products.product",
        model: product_model_1.ProductModel,
        select: "name genericName imageUrl _id price",
    });
    return res
        .status(200)
        .json(new ApiResponse_1.default(200, "Cart Items fetched", response));
}));
exports.increaseItemQuantity = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "User id is required", null));
    }
    const { productId } = req.body;
    if (!productId) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "Product id is required", null));
    }
    const productInfo = yield product_model_1.ProductModel.findOne({ _id: productId });
    if (!productInfo) {
        return res
            .status(404)
            .json(new ApiResponse_1.default(404, "Product not found", null));
    }
    const cart = yield cart_model_1.CartModel.findOne({ addedBy: userId });
    let currentTotalAmount = (cart === null || cart === void 0 ? void 0 : cart.totalAmount)
        ? parseFloat(cart.totalAmount)
        : 0;
    if (isNaN(currentTotalAmount)) {
        currentTotalAmount = 0; // Handle any cases where the conversion fails
    }
    // Calculate the new total amount
    const newTotalAmount = Math.round((currentTotalAmount + parseFloat(productInfo.price)) * 100) /
        100;
    const response = yield cart_model_1.CartModel.findOneAndUpdate({
        addedBy: userId,
        "products.product": productId,
    }, { $inc: { "products.$.quantity": 1 }, totalAmount: newTotalAmount }, {
        new: true,
    });
    if (!response) {
        return res
            .status(500)
            .json(new ApiResponse_1.default(500, "Error updating cart", null));
    }
    return res
        .status(200)
        .json(new ApiResponse_1.default(200, "Product quantity increased", response));
}));
exports.decreaseItemQuantity = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "User id is required", null));
    }
    const { productId } = req.body;
    if (!productId) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "Product id is required", null));
    }
    const productInfo = yield product_model_1.ProductModel.findOne({ _id: productId });
    if (!productInfo) {
        return res
            .status(404)
            .json(new ApiResponse_1.default(404, "Product not found", null));
    }
    const cart = yield cart_model_1.CartModel.findOne({
        addedBy: userId,
        products: { $elemMatch: { product: productId } },
    });
    if (!cart) {
        return res
            .status(404)
            .json(new ApiResponse_1.default(404, "Product not found in cart", null));
    }
    const product = cart.products.find((med) => med.product === productId);
    if (cart.products.length === 1 && cart.products[0].quantity === 1) {
        yield cart_model_1.CartModel.findOneAndDelete({ addedBy: userId });
        return res
            .status(200)
            .json(new ApiResponse_1.default(200, "Product removed from cart successfully", null));
    }
    else if ((product === null || product === void 0 ? void 0 : product.quantity) === 1) {
        const newTotalAmount = Math.round((parseFloat(cart.totalAmount) - parseFloat(productInfo.price)) * 100) / 100;
        yield cart_model_1.CartModel.findOneAndUpdate({
            addedBy: userId,
        }, {
            $pull: { products: { product: productId } },
            totalAmount: newTotalAmount.toString(),
        }, {
            new: true,
        });
        return res
            .status(200)
            .json(new ApiResponse_1.default(200, "Product removed from cart successfully", null));
    }
    else {
        const newTotalAmount = Math.round((parseFloat(cart.totalAmount) - parseFloat(productInfo.price)) * 100) / 100;
        const response = yield cart_model_1.CartModel.findOneAndUpdate({
            addedBy: userId,
            "products.product": productId,
        }, {
            $inc: { "products.$.quantity": -1 },
            totalAmount: newTotalAmount.toString(),
        }, {
            new: true,
        });
        if (!response) {
            return res
                .status(500)
                .json(new ApiResponse_1.default(500, "Error updating cart", null));
        }
        return res
            .status(200)
            .json(new ApiResponse_1.default(200, "Product quantity decreased", response));
    }
}));
exports.removeItemFromCart = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.userId;
    if (!userId) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "User id is required", null));
    }
    const { productId } = req.params;
    if (!productId) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "Product id is required", null));
    }
    const cart = yield cart_model_1.CartModel.findOne({
        addedBy: userId,
        products: { $elemMatch: { product: productId } },
    });
    if (!cart) {
        return res
            .status(404)
            .json(new ApiResponse_1.default(404, "Product not found in cart", null));
    }
    if (cart.products.length === 1) {
        yield cart_model_1.CartModel.findOneAndDelete({ addedBy: userId });
        return res
            .status(200)
            .json(new ApiResponse_1.default(200, "Item removed from cart", null));
    }
    const product = yield product_model_1.ProductModel.findOne({ _id: productId });
    if (!product) {
        return res
            .status(404)
            .json(new ApiResponse_1.default(404, "Product not found", null));
    }
    const newTotalAmount = Math.round((parseFloat(cart.totalAmount) -
        parseFloat(product.price) *
            (((_a = cart.products.find((med) => med.product.toString() === productId)) === null || _a === void 0 ? void 0 : _a.quantity) || 0)) *
        100) / 100;
    const deletedItem = yield cart_model_1.CartModel.findOneAndUpdate({
        addedBy: userId,
    }, {
        $pull: {
            products: {
                product: productId,
            },
        },
        $set: {
            totalAmount: newTotalAmount.toString(),
        },
    }, {
        new: true,
    });
    if (!deletedItem) {
        return res
            .status(500)
            .json(new ApiResponse_1.default(500, "Error removing item from cart", null));
    }
    return res
        .status(200)
        .json(new ApiResponse_1.default(200, "Item removed from cart", deletedItem));
}));
