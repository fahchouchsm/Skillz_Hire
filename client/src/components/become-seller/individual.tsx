/* eslint-disable react-hooks/exhaustive-deps */
import { DateInput } from "../ui/datePicker";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "@/app/siteSettings";
import { IndividualData } from "./content";
import data from "../../app/data/morocco/ville.json";
import { ScrollArea } from "../ui/scroll-area";

interface UsernameCheckResult {
  success: boolean;
  msg: string;
}

export const checkUsername = async (
  username: string
): Promise<UsernameCheckResult> => {
  try {
    const response = await axios.get<UsernameCheckResult>(
      `${baseUrl}/check/username/?username=${username}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error("Error in axios request:", err.response?.data);
      return {
        success: false,
        msg: err.response?.data.msg || "Une erreur s'est produite.",
      };
    } else {
      console.error("Unknown error in axios request:", err);
      return {
        success: false,
        msg: "Une erreur s'est produite lors de la requête.",
      };
    }
  }
};

interface IndividualProps {
  individualData: IndividualData;
  setIndividualData: (data: IndividualData) => void;
  username: string;
  setUsername: (e: string) => void;
}

const IndividualInput: React.FC<IndividualProps> = ({
  individualData,
  setIndividualData,
  setUsername,
  username,
}) => {
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );

  const usernameHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setUsername(inputValue);
    setMsg("");

    if (inputValue.length === 0) {
      setMsg("");
      setIndividualData({ ...individualData, username: "" });
      setUsernameAvailable(null);
    } else if (inputValue.length < 5) {
      setMsg("Le nom d'utilisateur doit contenir au moins 5 caractères");
      setIndividualData({ ...individualData, username: "" });
      setUsernameAvailable(null);
    } else if (inputValue.length > 15) {
      setMsg("Le nom d'utilisateur doit contenir au maximum 15 caractères");
      setIndividualData({ ...individualData, username: "" });
      setUsernameAvailable(null);
    } else {
      setLoading(true);
      try {
        const data = await checkUsername(inputValue);
        setUsernameAvailable(data.success);
        setMsg(data.msg);
        setIndividualData({ ...individualData, username: inputValue });
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

  const dateHandler = (e: Date) => {
    setIndividualData({ ...individualData, birth: e });
  };

  const [isCityInputFocused, setIsCityInputFocused] = useState(false);
  const cityAutocompleteData = data.map((item) => item.ville);
  const filterSuggestions = (inputValue: string, data: string[]) => {
    if (!inputValue) return [];

    // Filter exact matches first
    const exactMatches = data.filter(
      (item) => item.toLowerCase() === inputValue.toLowerCase()
    );

    // Filter other matches
    const otherMatches = data.filter(
      (item) =>
        item.toLowerCase().includes(inputValue.toLowerCase()) &&
        !exactMatches.includes(item)
    );

    // Concatenate exact matches followed by other matches
    return [...exactMatches, ...otherMatches];
  };
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIndividualData({ ...individualData, city: e.target.value });
  };
  useEffect(() => {
    setCitySuggestions(
      filterSuggestions(individualData.city, cityAutocompleteData)
    );
  }, [individualData.city]);
  const handleCitySelect = (value: string) => {
    setIndividualData({ ...individualData, city: value });
    setCitySuggestions([]);
    setIsCityInputFocused(false);
  };

  const handleInputBlur = () => {
    // Use a timeout to ensure the click event is registered before the blur event hides the suggestions
    setTimeout(() => {
      setIsCityInputFocused(false);
    }, 200);
  };

  return (
    <div className="relative">
      <div className="">
        <Label>Nom d&apos;utilisateur :</Label>
        <Input placeholder="Nom" value={username} onChange={usernameHandler} />
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
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="">
          <Label>Nom :</Label>
          <Input
            placeholder="Nom"
            value={individualData.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setIndividualData({
                ...individualData,
                firstName: e.target.value,
              });
            }}
          />
        </div>
        <div className="">
          <Label>Prénom :</Label>
          <Input
            placeholder="Prénom"
            value={individualData.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setIndividualData({
                ...individualData,
                lastName: e.target.value,
              });
            }}
          />
        </div>
        <div className="">
          <Label>Email :</Label>
          <Input placeholder="Email" disabled value={individualData.email} />
        </div>
        <div className="relative">
          <Label>Ville :</Label>
          <Input
            onChange={handleCityChange}
            value={individualData.city}
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
          <Label>Date de naissance :</Label>
          <DateInput
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            onChange={dateHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default IndividualInput;
