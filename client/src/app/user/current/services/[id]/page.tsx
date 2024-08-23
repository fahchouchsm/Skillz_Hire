"use client";
import { wsUrl } from "@/app/siteSettings";
import useWebSocket from "@/app/ws";
import NavBar from "@/components/home/navbar";
import Content from "@/components/services/content";
import Loading from "@/utils/loading";
import { fetchUserData, UserData } from "@/utils/useUserData";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { sendMessage } = useWebSocket(wsUrl);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { id } = useParams();
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
      setLoading(false);
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

  if (userData && userData._id !== id) {
    router.push("/login");
  }

  if (loading || !userData) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading h="h-11" />
      </div>
    );
  }

  return (
    <div className="">
      <NavBar userData={userData} />
      <ScrollArea className="flex-1 max-h-screen overflow-y-auto">
        <Content router={router} userData={userData} />
      </ScrollArea>
    </div>
  );
};

export default Page;
