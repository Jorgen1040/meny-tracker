export interface ProductData {
  ean: string;
  title: string;
  subtitle: string;
  description: string;
  slugifiedUrl: string;
  pricePerUnit: number;
  pricePerUnitOriginal: number;
  comparePricePerUnit?: number;
  compareUnit: string;
  isOffer: boolean;
  isLoweredPrice: boolean;
  associated: {
    products: string[];
  };
}

export type ProductViewData = Omit<ProductData, "associated">;

export type ProductTileData = Omit<ProductViewData, "description" | "slugifiedUrl">;