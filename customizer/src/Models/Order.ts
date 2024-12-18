import Knife from "./Knife";

export default interface Order {
  id: number;
  number: string;
  total: number;
  knifes: Knife[];
  delivery: string;
  clientFullName: string;
  clientPhoneNumber: string;
  countryForDelivery: string;
  city: string;
  email: string;
  comment: string | null;
  status: string;
}
