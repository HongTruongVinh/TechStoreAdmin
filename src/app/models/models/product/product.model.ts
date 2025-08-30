import { BrandModel } from "../brand/brand.model";
import { CategoryModel } from "../category/category.model";

export interface ProductModel {
    productId: string;
    name: string;
    shortDescription: string;
    description: string;
    slug:string;
    tag: string[];
    stock: number;
    price: number;
    importPrice: number;
    category: CategoryModel;
    brand: BrandModel;
    mainImageUrl: string;
    galleryImageUrls?: string[];
    startSellingDate?: Date;
    endSellingDate?: Date;
    isFeatured: boolean;
    averageRating: number;
    soldCount: number;
    ratedCount: number;
    salePrice: number;
    saleStart?: Date;
    saleEnd?: Date;
}