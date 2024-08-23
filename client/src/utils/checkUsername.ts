import axios, { AxiosError } from "axios";
import { baseUrl } from "@/app/siteSettings";

export interface UsernameCheckResult {
  success: boolean;
  msg: string;
}

export const checkUsername = async (
  username: string
): Promise<UsernameCheckResult> => {
  console.log("on axios");

  try {
    const response = await axios.get<UsernameCheckResult>(
      `${baseUrl}/check/username/?username=${username}`,
      {
        withCredentials: true,
      }
    );

    const data = response.data;
    console.log("done");

    if (data.success) {
      return { success: true, msg: "Nom d'utilisateur disponible." };
    } else {
      return { success: false, msg: "Nom d'utilisateur déjà pris." };
    }
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error("Error in axios request:", err.response?.data);
      return {
        success: false,
        msg: err.response?.data.msg || "Une erreur s'est produite.",
      };
    } else {
      console.error("Unknown error in axios request:", err);
      return {
        success: false,
        msg: "Une erreur s'est produite lors de la requête.",
      };
    }
  }
};
