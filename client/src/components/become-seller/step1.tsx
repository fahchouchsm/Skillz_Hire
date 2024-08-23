import { Building, Building2, CompassIcon, User } from "lucide-react";
import { Button } from "../ui/button";

interface step1 {
  accountType: "company" | "individual" | null;
  setAccountType: (e: "company" | "individual" | null) => void;
}

const Step1: React.FC<step1> = ({ accountType, setAccountType }) => {
  const individualHandler = () => {
    if (accountType === "individual") {
      setAccountType(null);
    } else {
      setAccountType("individual");
    }
  };
  const companyHandler = () => {
    if (accountType === "company") {
      setAccountType(null);
    } else {
      setAccountType("company");
    }
  };
  return (
    <div className="flex flex-col gap-4 py-5">
      <div className="font-semibold">Type de compte :</div>
      <Button
        onClick={individualHandler}
        className={`flex text-base shadow-md gap-2 px-6 justify-start py-6 ${
          accountType === "individual"
            ? "bg-emerald-500 text-white hover:bg-emerald-400"
            : "bg-white text-gray-800 border hover:bg-gray-100 "
        }`}
      >
        <User className="w-4 h-4" />
        Individual
      </Button>
      <Button
        onClick={companyHandler}
        className={`flex text-base shadow-md gap-2 px-6 justify-start py-6 ${
          accountType === "company"
            ? "bg-emerald-500 text-white hover:bg-emerald-400"
            : "bg-white text-gray-800 border hover:bg-gray-100 "
        }`}
      >
        <Building className="w-4 h-4" />
        Entreprise
      </Button>
    </div>
  );
};

export default Step1;
