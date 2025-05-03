import "dotenv/config";
import { RegisterProps } from "../models/requests/RegisterProps";

export const api = {
  async register(data: RegisterProps): Promise<Response> {
    return await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/Account/registration`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
  },
};
