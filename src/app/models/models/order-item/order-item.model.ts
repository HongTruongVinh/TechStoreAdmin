export interface OrderItemModel {
    productId: string;
    productName: string;
    categoryName: string;
    //sku?: string; // mã hàng hóa nếu có
    //variantId?: string; // nếu có biến thể (màu, size,...)
    quantity: number;
    priceAtOrderTime: number; // giá mỗi đơn vị (chưa chiết khấu, chưa thuế)
    discount?: number; // giảm giá theo dòng
    //tax?: number; // thuế theo dòng (nếu có)
    totalPrice: number; // quantity * unitPrice - discount + tax
    mainImageUrl: string; // để hiển thị đẹp hơn
    note?: string; // ghi chú riêng cho dòng hàng này
}