import { ClientData } from "./ClientData";

export interface UpdateUserDTO {
  clientData: ClientData;
  email?: string | null;
  password?: string | null;
  passwordConfirmation?: string | null;
}
