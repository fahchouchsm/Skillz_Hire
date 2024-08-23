import { ArrowBigRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CompanyData, IndividualData } from "./content";
import { SecondaryCategory } from "../home/seconderyCat";
import { useEffect, useState } from "react";
import Loading from "@/utils/loading";
import axios from "axios";
import { baseUrl, response } from "@/app/siteSettings";
import { toast } from "sonner";
import { UserData } from "@/utils/useUserData";
import { Label } from "../ui/label";
import _ from "lodash";

interface step4 {
  individualData: IndividualData;
  CompanyData: CompanyData;
  accountType: "company" | "individual" | null;
  mainCat: string | null;
  subCat: SecondaryCategory[];
  username: string;
  userData: UserData;
}

interface main {
  name: string;
  description: string;
}

const Step4: React.FC<step4> = ({
  accountType,
  mainCat,
  subCat,
  username,
  userData,
}) => {
  const [loading, setLoading] = useState(true);
  const [main, setMain] = useState<main | null>(null);
  useEffect(() => {
    const fetchMainName = async () => {
      axios
        .post(
          `${baseUrl}/get/main-cat`,
          { id: mainCat },
          { withCredentials: true }
        )
        .then(({ data }: { data: response }) => {
          setMain(data.data);
          setLoading(false);
        })
        .catch(({ data }: { data: response }) => {
          toast.error(data.msg);
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        });
    };
    fetchMainName();
  }, []);

  if (loading || !accountType) {
    return (
      <div className="h-52 flex items-center justify-center">
        <Loading h="h-11" />
      </div>
    );
  }

  return (
    <div className="container mx-auto my-5 px-4 sm:px-6 lg:px-8">
      <Card className="w-full py-4 px-3">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Label className="text-gray-700">Nom d'utilisateur :</Label>
              <div className="font-semibold">{username}</div>
              <Label className="text-gray-700">Domain de Travail :</Label>
              <CardTitle>{main?.name}</CardTitle>
              <Label className="text-gray-700">Type de compte :</Label>
              <CardTitle>{_.capitalize(accountType)}</CardTitle>
            </div>
            <img
              alt="pfp"
              className="h-26 w-24 rounded-full"
              src={userData.pfpLink}
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            {subCat.map((sub, index) => (
              <div key={index} className="mb-4">
                <div className="space-y-1 flex flex-row">
                  <ArrowBigRight className="text-emerald-500" />
                  <p className="text-sm font-medium leading-none ml-2">
                    {sub.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step4;
