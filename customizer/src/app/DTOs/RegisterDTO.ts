import { ClientData } from "./ClientData";

export interface RegisterDTO {
  clientData?: ClientData;
  email?: string | null;
  password?: string | null;
  passwordConfirmation?: string | null;
  role?: string | null;
}
