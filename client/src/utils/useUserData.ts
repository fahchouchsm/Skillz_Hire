import { baseUrl } from "@/app/siteSettings";
import axios from "axios";

export interface UserData {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  isSeller: boolean;
  pfpLink: string;
  sellerId?: string;
  lastOnline: Date;
}

export interface SellerData {
  username: string;
  firstName?: string;
  lastName?: string;
  mainCategory: string;
  subCategories: string[];
  accountType: "individual" | "company";
  individualData?: {
    username: string;
    firstName?: string;
    lastName?: string;
  };
  companyData?: {
    username: string;
    adresse?: string;
    url?: string;
  };
  bio: string;
  reviews: Array<{
    rating: number;
    comment?: string;
    userId: string;
  }>;
  reviewCount: number;
  totalRating: number;
  averageRating: number;
}
export interface PostData {
  sellerId: string;
  title: string;
  content: string;
  reviews: Array<{
    rating: number;
    comment?: string;
    userId: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export const fetchUserData = async (): Promise<UserData | null> => {
  try {
    axios.defaults.withCredentials = true;

    const response = await axios.get<UserData>(`${baseUrl}/protected`, {
      withCredentials: true,
    });

    if (response.data && response.data._id) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching protected data:", error);
    return null;
  }
};
