"use client";

import Content from "@/components/become-seller/content";
import Side from "@/components/become-seller/side";
import Loading from "@/utils/loading";
import { fetchUserData, UserData } from "@/utils/useUserData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

interface BecomeSellerProps {}

const BecomeSeller: React.FC<BecomeSellerProps> = () => {
  const { id } = useParams();
  const [accountType, setAccountType] = useState<
    "company" | "individual" | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserData();
        await setUserData(data);
      } catch (error) {
        toast.error("Erreur du serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Toaster richColors={true} position="top-center" />
        <Loading h="h-11" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden h-screen w-screen flex flex-row">
      <Side />
      {!userData ? (
        <div className="w-full h-screen flex items-center justify-center">
          <Loading h="h-11" />
        </div>
      ) : (
        <Content userData={userData} />
      )}
    </div>
  );
};

export default BecomeSeller;
