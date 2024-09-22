"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    genericName: {
        type: String,
        required: true,
        trim: true,
    },
    manufacturer: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
    },
    dosageForm: {
        type: String,
        required: true,
    },
    strength: {
        type: String,
        required: true,
    },
    packSize: {
        type: Number,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    prescriptionRequired: {
        type: Boolean,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    manufacturedDate: {
        type: Date,
        required: true,
    },
    batchNumber: {
        type: String,
        required: true,
    },
    activeIngredients: {
        type: String,
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.ProductModel = mongoose_1.default.models.Product ||
    mongoose_1.default.model("Product", productSchema);
