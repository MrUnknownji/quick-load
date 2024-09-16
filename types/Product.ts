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
}

export interface ProductOwner {
  productOwnerId: string;
  productOwnerName: string;
  productPrizeFrom: number;
  productPrizeTo: number;
  productLocation: string;
  productRating: number;
  productType: string;
  productImage: string;
}
