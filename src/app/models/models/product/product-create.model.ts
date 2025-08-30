export interface ProductCreateModel {
    name: string;
    categoryId: string;
    brandId: string;

    shortDescription: string;
    description: string;
    slug:string;

    tag: string[];
    galleryImageUrls?: string[];
    mainImageUrl?: string;

    stock: number;
    price: number;
    importPrice: number;
    
    endSellingDate?: Date;
    startSellingDate?: Date;
    isFeatured: boolean;

    salePrice: number;
    saleStart?: Date;
    saleEnd?: Date;
}