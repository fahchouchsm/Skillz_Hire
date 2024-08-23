// Home.tsx

"use client";
import React, { useEffect, useState } from "react";
import useWebSocket from "./ws";
import Loading from "@/utils/loading";
import { wsUrl } from "./siteSettings";
import { fetchUserData, UserData } from "@/utils/useUserData";
import NavBar from "@/components/home/navbar";
import HomeSearch from "@/components/home/homeSearch";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  const { sendMessage } = useWebSocket(wsUrl);
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

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading h="h-11" />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <NavBar userData={userData} />
      <HomeSearch />
    </div>
  );
};

export default Home;
