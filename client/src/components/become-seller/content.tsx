import React, { useState } from "react";
import { motion } from "framer-motion";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import { Button } from "../ui/button";
import { toast, Toaster } from "sonner";
import { UserData } from "@/utils/useUserData";
import { Loader2 } from "lucide-react";
import { checkUsername } from "@/utils/checkUsername";
import { isValidUrl } from "@/utils/functions";
import data from "../../app/data/morocco/ville.json";
import { SecondaryCategory } from "../home/seconderyCat";
import Step4 from "./step4";
import { baseUrl, response } from "@/app/siteSettings";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ContentProps {
  userData: UserData;
}

export interface IndividualData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birth: Date | null;
  city: string;
}
export interface CompanyData {
  username: string;
  adresse: string;
  email: string;
  city: string;
  url?: string;
}

const Content: React.FC<ContentProps> = ({ userData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [accountType, setAccountType] = useState<
    "company" | "individual" | null
  >(null);
  const [individualData, setIndividualData] = useState<IndividualData>({
    username: "",
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    birth: null,
    city: "",
  });
  const [companyData, setCompanyData] = useState<CompanyData>({
    adresse: "",
    username: "",
    email: userData.email,
    city: "",
    url: "",
  });
  const [selectedMainCatId, setSelectedMainCatId] = useState<string | null>(
    null
  );
  const [selectedSecondaryCats, setSelectedSecondaryCats] = useState<
    SecondaryCategory[]
  >([]);

  const stepsData = [
    {
      label: "Step 1",
      component: (
        <Step1 accountType={accountType} setAccountType={setAccountType} />
      ),
    },
    {
      label: "Step 2",
      component: (
        <Step2
          companyData={companyData}
          setCompanyData={setCompanyData}
          username={username}
          setUsername={setUsername}
          setIndividualData={setIndividualData}
          individualData={individualData}
          accountType={accountType}
          userData={userData}
        />
      ),
    },
    {
      label: "Step 3",
      component: (
        <Step3
          selectedMainCatId={selectedMainCatId}
          selectedSecondaryCats={selectedSecondaryCats}
          setSelectedMainCatId={setSelectedMainCatId}
          setSelectedSecondaryCats={setSelectedSecondaryCats}
        />
      ),
    },
  ];

  const [final, setFinal] = useState(false);

  const handleNext = async () => {
    if (activeStep < stepsData.length + 1) {
      if (activeStep === 0) {
        if (accountType !== null) {
          setActiveStep((prevStep) => prevStep + 1);
        } else {
          toast.error("Veuillez sélectionner le type de compte.");
        }
      } else if (activeStep === 1 && accountType === "individual") {
        setLoading(true);
        try {
          let isValid = true;

          if (
            individualData.username.length < 5 ||
            individualData.username.length > 15
          ) {
            toast.error(
              "Le nom d'utilisateur doit contenir entre 5 et 15 caractères."
            );
            isValid = false;
          }

          if (!individualData.birth) {
            toast.error("Veuillez entrer une date de naissance.");
            isValid = false;
          } else {
            const today = new Date();
            let age = today.getFullYear() - individualData.birth.getFullYear();
            const monthDiff =
              today.getMonth() - individualData.birth.getMonth();
            if (
              monthDiff < 0 ||
              (monthDiff === 0 &&
                today.getDate() < individualData.birth.getDate())
            ) {
              age--;
            }
            if (age < 18) {
              toast.error(
                "Vous devez avoir au moins 18 ans pour vous inscrire."
              );
              isValid = false;
            }
          }

          const cityList = data.map((item) => item.ville.toLowerCase());
          if (!cityList.includes(individualData.city.toLowerCase())) {
            toast.error("Veuillez entrer une ville valide.");
            isValid = false;
          }

          if (isValid) {
            const response = await checkUsername(individualData.username);
            if (response.success) {
              setActiveStep((prevStep) => prevStep + 1);
            } else {
              toast.error(response.msg);
            }
          }
        } catch (error) {
          console.error("Error checking username:", error);
          toast.error(
            "Une erreur s'est produite lors de la vérification du nom d'utilisateur."
          );
        } finally {
          setLoading(false);
        }
      } else if (activeStep === 1 && accountType === "company") {
        setLoading(true);
        try {
          let isValid = true;

          if (
            companyData.username.length < 5 ||
            companyData.username.length > 15
          ) {
            toast.error(
              "Le nom d'utilisateur doit contenir entre 5 et 15 caractères."
            );
            isValid = false;
          }

          if (!companyData.adresse.trim()) {
            toast.error("Veuillez entrer une adresse.");
            isValid = false;
          }

          if (companyData.url && !isValidUrl(companyData.url)) {
            toast.error("Veuillez entrer une URL valide.");
            isValid = false;
          }

          const cityList = data.map((item) => item.ville.toLowerCase());
          if (!cityList.includes(companyData.city.toLowerCase())) {
            toast.error("Veuillez entrer une ville valide.");
            isValid = false;
          }

          if (isValid) {
            const response = await checkUsername(companyData.username);
            if (response.success) {
              setActiveStep((prevStep) => prevStep + 1);
            } else {
              toast.error(response.msg);
            }
          }
        } catch (error) {
          console.error("Error in company validation:", error);
          toast.error("Une erreur s'est produite lors de la validation.");
        } finally {
          setLoading(false);
        }
      } else if (activeStep === 2) {
        setLoading(true);
        if (!selectedMainCatId) {
          toast.error("Aucune catégorie principale sélectionnée.");
          setLoading(false);
          return;
        } else if (selectedSecondaryCats.length === 0) {
          toast.error(
            "Veuillez sélectionner au moins une catégorie secondaire."
          );
          setLoading(false);
          return;
        } else if (selectedSecondaryCats.length > 5) {
          toast.error(
            "Vous pouvez sélectionner jusqu'à 5 catégories secondaires."
          );
          setLoading(false);
          return;
        } else {
          setActiveStep((prevStep) => prevStep + 1);
          setLoading(false);
          setFinal(true);
        }
      } else if (activeStep === 3) {
        setLoading(true);
        await axios
          .post(
            `${baseUrl}/new/seller`,
            {
              accountType,
              individualData,
              companyData,
              mainCatId: selectedMainCatId,
              subCatsId: selectedSecondaryCats.map((cat) => cat._id),
            },
            { withCredentials: true }
          )
          .then(({ data }: { data: response }) => {
            if (data.success) {
              toast.success(data.msg);
              setTimeout(() => {
                router.push(`/user/${userData._id}`);
              }, 3000);
            } else {
              toast.error(data.msg);
              window.location.reload();
            }
          })
          .catch(({ data }: { data: response }) => {
            console.log(data);
            toast.error(data.msg);
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          })
          .finally(() => {
            setTimeout(() => {
              setLoading(false);
            }, 2900);
          });
      }
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
      setFinal(false);
    }
  };

  return (
    <>
      <Toaster richColors={true} position="bottom-right" />
      <div className="w-full flex flex-col gap-5">
        <nav aria-label="Progress">
          <ol role="list" className="flex flex-row">
            {stepsData.map((step, index) => (
              <li
                key={index}
                className={`md:flex-1 ${
                  index <= activeStep
                    ? "border-emerald-500"
                    : "border-black group"
                }`}
              >
                <div
                  className={`flex flex-col py-2 pl-4 ${
                    index === activeStep
                      ? "border-emerald-500"
                      : "border-black group "
                  } md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4`}
                  aria-current={index === activeStep ? "step" : undefined}
                >
                  <span
                    className={`text-sm font-medium ${
                      index === activeStep ? "text-emerald-500" : "text-black"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
        <div className="container">
          <>
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="step-content-wrapper "
            >
              {final ? (
                <Step4
                  userData={userData}
                  username={username}
                  CompanyData={companyData}
                  accountType={accountType}
                  individualData={individualData}
                  mainCat={selectedMainCatId}
                  subCat={selectedSecondaryCats}
                />
              ) : (
                stepsData[activeStep].component
              )}
            </motion.div>
            <div className="relative flex flex-row justify-between">
              <Button
                onClick={handlePrevious}
                disabled={activeStep === 0}
                className="bg-white border text-gray-800 hover:bg-gray-100"
              >
                Précédent
              </Button>
              <Button
                onClick={handleNext}
                disabled={activeStep === stepsData.length + 1 || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Chargement...
                  </>
                ) : final ? (
                  "Confirmer"
                ) : (
                  "Suivant"
                )}
              </Button>
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default Content;
