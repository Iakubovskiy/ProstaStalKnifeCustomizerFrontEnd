import {ClientData} from "@/app/DTOs/ClientData";
import { Order } from "./Order";

export interface User {
  id: string;
  email?: string | null;
  role?: string | null;
  userData: ClientData;
  orders?: Order[] | null;
}
