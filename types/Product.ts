export interface Product {
  _id: string;
  productOwner: string;
  productPrize: number;
  productSize: string;
  productQuantity: number;
  productLocation: string;
  productRating: number;
  productType: string;
  productDetails: string;
  countryCode: string;
  createdAt: string;
  updatedAt: string;
  productImage: string;
  __v: number;
}

export interface ProductOwner {
  _id: string;
  productOwnerId: string;
  productOwnerName: string;
  productPrizeFrom: number;
  productPrizeTo: number;
  productLocation: string;
  productRating: number;
  productType: string;
  productImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NewProduct {
  productOwnerId: string;
  productPrice: number;
  productSize: string;
  productQuantity: number;
  productLocation: string;
  productRating: number;
  productType: string;
  productDetails: string;
  productImage: File;
}

export interface NewProductOwner {
  productOwnerName: string;
  productPriceFrom: number;
  productPriceTo: number;
  productLocation: string;
  productRating: number;
  productType: string;
  productImage: File;
}

export interface UpdateProduct {
  productPrice?: number;
  productSize?: string;
  productQuantity?: number;
  productLocation?: string;
  productRating?: number;
  productType?: string;
  productDetails?: string;
  productImage?: File;
}
