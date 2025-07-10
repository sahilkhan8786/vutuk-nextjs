export interface Configuration {
  key: string;
  image: string;
  sku: string;
}

export interface PopulatedProduct {
  _id: string;
  title: string;
  price: number;
  images?: string[];
  configurations?: Configuration[];
}

export interface CartItem {
  productId: PopulatedProduct;
  sku: string;
  price: number;
  quantity: number;
}
