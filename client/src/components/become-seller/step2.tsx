import { UserData } from "@/utils/useUserData";
import CompanyInput from "./company";
import IndividualInput from "./individual";
import { CompanyData, IndividualData } from "./content";

interface step2 {
  accountType: "company" | "individual" | null;
  userData: UserData | null;
  individualData: IndividualData;
  setIndividualData: (e: IndividualData) => void;
  username: string;
  setUsername: (e: string) => void;
  companyData: CompanyData;
  setCompanyData: (e: CompanyData) => void;
}

const Step2: React.FC<step2> = ({
  accountType,
  individualData,
  setIndividualData,
  setUsername,
  username,
  companyData,
  setCompanyData,
}) => {
  return (
    <div className="py-5 flex flex-col gap-3">
      <div className="font-semibold">Information de compte :</div>
      {accountType === "individual" ? (
        <IndividualInput
          setUsername={setUsername}
          username={username}
          setIndividualData={setIndividualData}
          individualData={individualData}
        />
      ) : (
        <CompanyInput
          companyData={companyData}
          setCompanyData={setCompanyData}
        />
      )}
    </div>
  );
};

export default Step2;
