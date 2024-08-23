/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { checkUsername, UsernameCheckResult } from "@/utils/checkUsername";
import { CompanyData } from "./content";
import data from "../../app/data/morocco/ville.json";
import { ScrollArea } from "../ui/scroll-area";

interface CompanyProps {
  companyData: CompanyData;
  setCompanyData: (data: CompanyData) => void;
}

const CompanyInput: React.FC<CompanyProps> = ({
  companyData,
  setCompanyData,
}) => {
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [isCityInputFocused, setIsCityInputFocused] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);

  const cityAutocompleteData = data.map((item) => item.ville);
  const filterSuggestions = (inputValue: string, data: string[]) => {
    if (!inputValue) return [];
    const exactMatches = data.filter(
      (item) => item.toLowerCase() === inputValue.toLowerCase()
    );
    const otherMatches = data.filter(
      (item) =>
        item.toLowerCase().includes(inputValue.toLowerCase()) &&
        !exactMatches.includes(item)
    );
    return [...exactMatches, ...otherMatches];
  };

  const usernameHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setCompanyData({ ...companyData, username: inputValue });
    setMsg("");

    if (inputValue.length === 0) {
      setMsg("");
      setUsernameAvailable(null);
    } else if (inputValue.length < 5) {
      setMsg("Le nom d'utilisateur doit contenir au moins 5 caractères");
      setUsernameAvailable(null);
    } else if (inputValue.length > 15) {
      setMsg("Le nom d'utilisateur doit contenir au maximum 15 caractères");
      setUsernameAvailable(null);
    } else {
      setLoading(true);
      try {
        const data: UsernameCheckResult = await checkUsername(inputValue);
        setUsernameAvailable(data.success);
        setMsg(data.msg);
      } catch (err) {
        console.error("Error checking username:", err);
        setUsernameAvailable(false);
        setMsg(
          "Une erreur s'est produite lors de la vérification du nom d'utilisateur."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyData({ ...companyData, city: e.target.value });
  };

  useEffect(() => {
    setCitySuggestions(
      filterSuggestions(companyData.city, cityAutocompleteData)
    );
  }, [companyData.city]);

  const handleCitySelect = (value: string) => {
    setCompanyData({ ...companyData, city: value });
    setCitySuggestions([]);
    setIsCityInputFocused(false);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsCityInputFocused(false);
    }, 200);
  };

  return (
    <>
      <div className="">
        <Label>Nom d&apos;utilisateur :</Label>
        <Input
          placeholder="Nom"
          value={companyData.username}
          onChange={usernameHandler}
        />
        {loading && (
          <span className="text-yellow-500 text-sm">Chargement...</span>
        )}
        {!loading && usernameAvailable !== null && (
          <span
            className={
              usernameAvailable
                ? "text-green-500 text-sm"
                : "text-red-500 text-sm"
            }
          >
            {msg}
          </span>
        )}
        {!loading && usernameAvailable === null && (
          <span className="text-sm">&nbsp;</span>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div className="">
            <Label>Email :</Label>
            <Input placeholder="Email" disabled value={companyData.email} />
          </div>
          <div className="">
            <Label>
              URL <span className="text-gray-500">(optionel)</span> :
            </Label>
            <Input
              placeholder="URL"
              value={companyData.url || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCompanyData({ ...companyData, url: e.target.value })
              }
            />
          </div>
          <div className="relative">
            <Label>Ville :</Label>
            <Input
              onChange={handleCityChange}
              value={companyData.city}
              type="text"
              placeholder="Entrer la ville..."
              className=" w-full bg-white "
              onFocus={() => setIsCityInputFocused(true)}
              onBlur={handleInputBlur}
            />
            {isCityInputFocused && citySuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full">
                {citySuggestions.map((item) => (
                  <li
                    key={item}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    onMouseDown={() => handleCitySelect(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="">
            <Label>Adresse :</Label>
            <Input
              placeholder="Adresse"
              value={companyData.adresse}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCompanyData({ ...companyData, adresse: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyInput;
