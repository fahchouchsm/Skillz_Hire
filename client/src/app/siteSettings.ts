export const site = {
  imgs: {
    homeCover: "/images/home/768.webp",
  },
};

export const baseUrl = "http://localhost:3031";
export const wsUrl = "ws://localhost:3031";

export interface response {
  msg: string | null;
  success: boolean;
  data: any | null | undefined;
}
