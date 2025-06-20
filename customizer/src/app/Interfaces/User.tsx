import {ClientData} from "@/app/DTOs/ClientData";
import { Order } from "./Order";

export interface User {
  email?: string | null;
  role?: string | null;
  userData: ClientData;
  orders?: Order[] | null;
}
