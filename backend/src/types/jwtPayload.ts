export type JwtPayload = {
  id: number;
  role: "admin" | "patient";
  name?: string;
  email?: string;
  cpf?: string;
};
