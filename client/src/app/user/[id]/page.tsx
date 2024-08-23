"use client";
import { baseUrl, response, wsUrl } from "@/app/siteSettings";
import useWebSocket from "@/app/ws";
import { MainCats } from "@/components/become-seller/step3";
import NavBar from "@/components/home/navbar";
import { SecondaryCategory } from "@/components/home/seconderyCat";
import Content from "@/components/userShow/content";
import Loading from "@/utils/loading";
import { fetchUserData, SellerData, UserData } from "@/utils/useUserData";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import axios from "axios";
import _ from "lodash";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface user {
  userData: UserData;
  sellerData: SellerData | null;
}

export interface cats {
  mainCat: MainCats;
  secCats: SecondaryCategory[];
}

const User = () => {
  const { id } = useParams();
  const { sendMessage } = useWebSocket(wsUrl);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [user, setUser] = useState<user | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchUserData();
      if (data) {
        setUserData(data);
      } else {
        setUserData(null);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${baseUrl}/get/show/user/${id}`, { withCredentials: true })
        .then(({ data }: { data: response }) => {
          setUser(data.data);
          setLoading(false);
        })
        .catch(({ data }: { data: response }) => {
          toast.error(data.msg);
          setTimeout(() => {
            router.push("/");
          }, 3000);
        });
    };
    fetchData();
  }, []);

  const [isSended, setIsSended] = useState(false);
  useEffect(() => {
    if (userData && !isSended) {
      setIsSended(true);
      sendMessage({ type: "lastOnlineUpdate", data: { id: userData._id } });
    }
  }, [userData]);

  const [cats, setCats] = useState<cats | null>(null);
  useEffect(() => {
    if (user) {
      axios
        .post(
          `${baseUrl}/get/secondery-cats/id`,
          {
            subIds: user?.sellerData?.subCategories,
            mainId: user?.sellerData?.mainCategory,
          },
          { withCredentials: true }
        )
        .then(({ data }: { data: response }) => {
          setCats(data.data);
        })
        .catch(({ data }: { data: response }) => {
          toast.error(data.msg);
        });
    }
  }, [user]);
  console.log(cats);

  if (loading || !user || !cats) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading h="h-11" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <NavBar userData={userData} />
      <ScrollArea className="flex-1 max-h-screen overflow-y-auto">
        <Content user={user} cats={cats} />
      </ScrollArea>
    </div>
  );
};

export default User;
