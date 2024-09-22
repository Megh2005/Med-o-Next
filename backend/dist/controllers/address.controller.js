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
exports.addNewAddress = exports.getAddresses = void 0;
const address_schema_1 = __importDefault(require("../lib/schemas/address.schema"));
const address_model_1 = require("../models/address.model");
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getAddresses = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const addresses = yield address_model_1.AddressModel.find({ addressOf: userId });
    return res
        .status(200)
        .json(new ApiResponse_1.default(200, "Addresses fetched", addresses));
}));
exports.addNewAddress = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const formData = req.body;
    const billingAddress = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        pincode: formData.pincode,
        state: formData.state,
        city: formData.city,
        houseNumber: formData.houseNumber,
        street: formData.street,
        landmark: formData.landmark,
    };
    const { success } = address_schema_1.default.safeParse(billingAddress);
    if (!success) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "Invalid request body", null));
    }
    const savedAddress = yield address_model_1.AddressModel.create(Object.assign(Object.assign({}, billingAddress), { addressOf: userId }));
    if (!savedAddress) {
        return res
            .status(500)
            .json(new ApiResponse_1.default(500, "Error saving address", null));
    }
    return res
        .status(201)
        .json(new ApiResponse_1.default(201, "Address added successfully", savedAddress));
}));
