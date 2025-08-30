export interface ProductUpdateModel {
    name: string;
    categoryId: string;
    brandId: string;

    shortDescription: string;
    description: string;
    slug:string;
    
    tag: string[];
    stock: number;
    price: number;

    importPrice: number;
    mainImageUrl?: string;
    galleryImageUrls?: string[];

    startSellingDate?: Date;
    endSellingDate?: Date;
    isFeatured: boolean;
    
    salePrice: number;
    saleStart?: Date;
    saleEnd?: Date;
}