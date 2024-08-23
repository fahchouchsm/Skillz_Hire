"use client";
import { wsUrl } from "@/app/siteSettings";
import useWebSocket from "@/app/ws";
import { fetchUserData, UserData } from "@/utils/useUserData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Content from "./content";
import Loading from "@/utils/loading";

const Page: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { sendMessage } = useWebSocket(wsUrl);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { id } = useParams();
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

  if (loading || !userData) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading h="h-11" />
      </div>
    );
  }

  return <Content userData={userData} />;
};

export default Page;
