import Stepper from "@/components/newSeller/stepper";
import Input from "@/components/services/input";
import { UserData } from "@/utils/useUserData";
import { ScrollArea, ScrollAreaViewport } from "@radix-ui/react-scroll-area";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ContentProps {
  userData: UserData;
}

const Content: React.FC<ContentProps> = ({ userData }) => {
  const [step, setStep] = useState<number>(1);
  const router = useRouter();

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <div className="shadow-lg px-10 py-3 flex flex-row justify-between items-center gap-4">
        <Stepper step={step} />
        <div
          className="cursor-pointer hover:underline p-4"
          onClick={() => {
            router.back();
          }}
        >
          Quitter
        </div>
      </div>
      <Input />
    </div>
  );
};

export default Content;
