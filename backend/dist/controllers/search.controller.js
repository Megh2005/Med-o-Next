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
exports.search = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const constants_1 = require("../utils/constants");
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const product_model_1 = require("../models/product.model");
exports.search = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const searchQuery = query.q;
    const inStock = Boolean(query.inStock) || false;
    const dosageForm = query.dosageForm || "";
    const category = query.category || "";
    const sortBy = query.sortBy || "price";
    const sortOrder = parseInt(query.sortOrder) || 1;
    const page = parseInt(query.page || "1");
    const pageSize = parseInt(query.pageSize || `${constants_1.PAGINATION_OFFSET}`);
    if (!searchQuery) {
        return res
            .status(400)
            .json(new ApiResponse_1.default(400, "Search Query is required", null));
    }
    const sort = {};
    if (sortBy === "price") {
        sort["convertedPrice"] = sortOrder;
    }
    else {
        sort[sortBy] = sortOrder;
    }
    const products = yield product_model_1.ProductModel.aggregate([
        {
            $match: {
                $and: [
                    inStock ? { stock: { $gt: 0 } } : {},
                    { dosageForm: { $regex: dosageForm, $options: "i" } },
                    { category: { $regex: category, $options: "i" } },
                    {
                        $or: [
                            { name: { $regex: searchQuery, $options: "i" } },
                            { genericName: { $regex: searchQuery, $options: "i" } },
                        ],
                    },
                ],
            },
        },
        {
            $addFields: {
                convertedPrice: { $toDouble: "$price" },
            },
        },
        {
            $facet: {
                metadata: [{ $count: "totalCount" }],
                data: [
                    {
                        $sort: sort,
                    },
                    { $skip: (page - 1) * pageSize },
                    { $limit: pageSize },
                ],
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
        data: products[0].data,
        metadata: {
            totalCount: products[0].totalCount,
            page,
            pageSize,
            hasNextPage: products[0].totalCount - page * pageSize > 0,
        },
    };
    return res
        .status(200)
        .json(new ApiResponse_1.default(200, "Search results fetched successfully", response));
}));
