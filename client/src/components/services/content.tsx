import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UserData } from "@/utils/useUserData";

interface content {
  router: AppRouterInstance;
  userData: UserData;
}

const Content: React.FC<content> = ({ router, userData }) => {
  return (
    <div className="container py-5">
      <div className="flex flex-row justify-between">
        <Label className="font-semibold text-2xl">Mes services :</Label>
        <Button
          onClick={() => {
            router.push(`/new/service/${userData._id}`);
          }}
        >
          Nouvelle service
        </Button>
      </div>
      <div className="text-gray-500 text-lg mt-4">
        Vous n'avais aucun services pour le moment.
      </div>
    </div>
  );
};

export default Content;
