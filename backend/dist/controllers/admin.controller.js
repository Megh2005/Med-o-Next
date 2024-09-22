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
exports.getProductDetails = exports.getProducts = exports.deleteProduct = exports.updateProduct = exports.addProduct = void 0;
const product_schema_1 = require("../lib/schemas/product.schema");
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const asyncHandler_1 = require("../utils/asyncHandler");
const product_model_1 = require("../models/product.model");
const cloudinary_1 = require("../utils/cloudinary");
const getCloudinaryId_1 = require("../utils/getCloudinaryId");
const constants_1 = require("../utils/constants");
exports.addProduct = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.isAdmin) {
        return res.status(401).json(new ApiResponse_1.default(401, "Unauthorized", null));
    }
    const imageFilePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    const formData = req.body;
    if (!imageFilePath) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "Image is required", null));
    }
    const medicineInfo = {
        name: formData.name,
        genericName: formData.genericName,
        manufacturer: formData.manufacturer,
        description: formData.description,
        category: formData.category,
        dosageForm: formData.dosageForm,
        strength: formData.strength,
        packSize: formData.packSize,
        price: formData.price,
        prescriptionRequired: Boolean(formData.prescriptionRequired),
        stock: formData.stock,
        expiryDate: new Date(formData.expiryDate),
        manufacturedDate: new Date(formData.manufacturedDate),
        batchNumber: formData.batchNumber,
        activeIngredients: formData.activeIngredients,
        instructions: formData.instructions,
    };
    const { success } = product_schema_1.productSchema.safeParse(medicineInfo);
    if (!success) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "Invalid request body", null));
    }
    // check expiry date
    if (medicineInfo.expiryDate <= medicineInfo.manufacturedDate) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "Expiry date should be greater than manufactured date", null));
    }
    // upload image to cloudinary
    const uploadResult = yield (0, cloudinary_1.uploadImageToCloudinary)(imageFilePath);
    if (!uploadResult) {
        return res
            .status(500)
            .json(new ApiResponse_1.default(500, "Error uploading image to cloudinary", null));
    }
    // save medicine to database
    const savedMedicine = yield product_model_1.ProductModel.create(Object.assign(Object.assign({}, medicineInfo), { imageUrl: uploadResult.secure_url }));
    if (!savedMedicine) {
        return res
            .status(500)
            .json(new ApiResponse_1.default(500, "Error saving medicine to database", null));
    }
    return res
        .status(201)
        .json(new ApiResponse_1.default(201, "Medicine added successfully", savedMedicine));
}));
exports.updateProduct = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (!req.isAdmin) {
        return res.status(401).json(new ApiResponse_1.default(401, "Unauthorized", null));
    }
    const url = req.url;
    const medicineId = url.split("/").pop();
    const imageFilePath = (_b = req.file) === null || _b === void 0 ? void 0 : _b.path;
    const formData = req.body;
    const medicineInfo = {
        name: formData.name,
        genericName: formData.genericName,
        manufacturer: formData.manufacturer,
        description: formData.description,
        category: formData.category,
        dosageForm: formData.dosageForm,
        strength: formData.strength,
        packSize: formData.packSize,
        price: formData.price,
        prescriptionRequired: Boolean(formData.prescriptionRequired),
        stock: formData.stock,
        expiryDate: new Date(formData.expiryDate),
        manufacturedDate: new Date(formData.manufacturedDate),
        batchNumber: formData.batchNumber,
        activeIngredients: formData.activeIngredients,
        instructions: formData.instructions,
    };
    const { success } = product_schema_1.productSchema.safeParse(medicineInfo);
    if (!success) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "Invalid request body", null));
    }
    const medicine = yield product_model_1.ProductModel.findById(medicineId);
    if (!medicine) {
        return res.json(new ApiResponse_1.default(400, "Medicine not found", null));
    }
    if (imageFilePath) {
        const response = yield (0, cloudinary_1.uploadImageToCloudinary)(imageFilePath);
        if (!response) {
            return res.json(new ApiResponse_1.default(400, "Failed to upload image", null));
        }
        // delete old image from cloudinary
        const deletedImage = yield (0, cloudinary_1.deleteImageFromCloudinary)((0, getCloudinaryId_1.getCloudinaryPublicId)(medicine.imageUrl));
        if (!deletedImage) {
            return res.json(new ApiResponse_1.default(400, "Failed to delete old image", null));
        }
        medicine.imageUrl = response.secure_url;
    }
    medicine.name = medicineInfo.name;
    medicine.genericName = medicineInfo.genericName;
    medicine.manufacturer = medicineInfo.manufacturer;
    medicine.description = medicineInfo.description;
    medicine.category = medicineInfo.category;
    medicine.dosageForm = medicineInfo.dosageForm;
    medicine.strength = medicineInfo.strength;
    medicine.packSize = parseInt(medicineInfo.packSize);
    medicine.price = medicineInfo.price;
    medicine.prescriptionRequired = medicineInfo.prescriptionRequired;
    medicine.stock = parseInt(medicineInfo.stock);
    medicine.expiryDate = medicineInfo.expiryDate;
    medicine.manufacturedDate = medicineInfo.manufacturedDate;
    medicine.batchNumber = medicineInfo.batchNumber;
    medicine.activeIngredients = medicineInfo.activeIngredients;
    medicine.instructions = medicineInfo.instructions;
    const updatedMedicine = yield medicine.save();
    if (!updatedMedicine) {
        return res.json(new ApiResponse_1.default(400, "Failed to update medicine", null));
    }
    return res
        .status(201)
        .json(new ApiResponse_1.default(201, "Medicine updated successfully", updatedMedicine));
}));
exports.deleteProduct = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAdmin) {
        return res.status(401).json(new ApiResponse_1.default(401, "Unauthorized", null));
    }
    const url = req.url;
    const medicineId = url.split("/").pop();
    if (!medicineId) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "Medicine ID is required", null));
    }
    const deletedMedicine = yield product_model_1.ProductModel.findByIdAndDelete(medicineId);
    if (!deletedMedicine) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "Error deleting medicine", null));
    }
    return res.status(200).json(new ApiResponse_1.default(200, "Medicine deleted", null));
}));
exports.getProducts = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAdmin) {
        return res.status(401).json(new ApiResponse_1.default(401, "Unauthorized", null));
    }
    const query = req.query;
    const searchQuery = query.q;
    const sortBy = query.sortBy || "createdAt";
    const page = parseInt(query.page || "1");
    const pageSize = parseInt(query.pageSize || `${constants_1.PAGINATION_OFFSET}`);
    const medicines = yield product_model_1.ProductModel.aggregate([
        {
            $match: {
                $or: [
                    { name: { $regex: searchQuery, $options: "i" } },
                    { manufacturer: { $regex: searchQuery, $options: "i" } },
                ],
            },
        },
        {
            $sort: { [sortBy]: sortBy === "createdAt" ? -1 : 1 },
        },
        {
            $facet: {
                metadata: [{ $count: "totalCount" }],
                data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
            },
        },
        {
            $project: {
                data: 1,
                totalCount: {
                    $ifNull: [{ $arrayElemAt: ["$metadata.totalCount", 0] }, 0],
                },
            },
        },
    ]);
    const response = {
        data: medicines[0].data,
        metadata: {
            totalCount: medicines[0].totalCount,
            page,
            pageSize,
            hasNextPage: medicines[0].totalCount - page * pageSize > 0,
        },
    };
    return res
        .status(200)
        .json(new ApiResponse_1.default(200, "Medicines fetched successfully", response));
}));
exports.getProductDetails = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAdmin) {
        return res.status(401).json(new ApiResponse_1.default(401, "Unauthorized", null));
    }
    const url = req.url;
    const medicineId = url.split("/").pop();
    const medicineDetails = yield product_model_1.ProductModel.findById(medicineId);
    if (!medicineDetails) {
        return res
            .status(404)
            .json(new ApiResponse_1.default(404, "Medicine Details not found", null));
    }
    return res
        .status(200)
        .json(new ApiResponse_1.default(200, "Medicine Details found", medicineDetails));
}));
