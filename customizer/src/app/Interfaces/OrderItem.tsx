interface OrderItem {
  productId: string;
  orderId: number;
  quantity: number;
  product: Knife | Attachment | CompletedSheath;
}
