import { ClientData } from "./ClientData";

export interface RegisterDTO {
  id?: string;
  clientData: ClientData;
  email?: string | null;
  password?: string | null;
  passwordConfirmation?: string | null;
  role?: string | null;
}
