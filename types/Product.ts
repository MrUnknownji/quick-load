export interface Product {
  _id: string;
  productOwner: string;
  productPrice: number;
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
  isVerified: boolean;
  __v: number;
}

export interface ProductOwner {
  _id?: string;
  userId: string;
  productOwnerName: string;
  phoneNumber: number;
  gstNumber: string;
  shopAddress: string;
  state: string;
  city: string;
  shopRating: number;
  productType: string[];
  shopImage: string;
  isVerified: boolean;
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
  phoneNumber: number;
  gstNumber: string;
  shopAddress: string;
  state: string;
  city: string;
  shopRating: number;
  productType: string[];
  shopImage: File;
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
  isVerified?: boolean;
}

export interface UpdateProductOwner {
  productOwnerName?: string;
  phoneNumber?: number;
  gstNumber?: string;
  shopAddress?: string;
  state?: string;
  city?: string;
  shopRating?: number;
  productType?: string[];
  shopImage?: File;
  isVerified?: boolean;
}

export interface ApiResponse<T> {
  resultMessage: {
    en: string;
    tr: string;
  };
  resultCode: string;
  data: T;
}
