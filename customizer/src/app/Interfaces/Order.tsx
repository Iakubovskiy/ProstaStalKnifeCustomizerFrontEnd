interface Order {
  id: number;
  number: number;
  total: number;
  delivery: DeliveryType;
  clientFullName: string;
  clientPhoneNumber: string;
  countryForDelivery: string;
  city: string;
  address: string;
  zipCode: string | null;
  email: string;
  comment: string;
  status: string;
  paymentMethod: string;
  orderItems: OrderItem[];
}
