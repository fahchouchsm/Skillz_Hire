/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { baseUrl } from "@/app/siteSettings";
import { toast } from "sonner";
import { Input } from "../ui/input";
import Loading from "@/utils/loading";
import { Label } from "@radix-ui/react-dropdown-menu";
import SeconderyCat, { SecondaryCategory } from "../home/seconderyCat";
import { ScrollArea } from "../ui/scroll-area";

interface Step3Props {
  selectedMainCatId: string | null;
  setSelectedMainCatId: (e: string | null) => void;
  selectedSecondaryCats: SecondaryCategory[];
  setSelectedSecondaryCats: (e: SecondaryCategory[]) => void;
}

export interface MainCats {
  _id: string;
  name: string;
  description: string;
}

const Step3: React.FC<Step3Props> = ({
  selectedMainCatId,
  setSelectedMainCatId,
  selectedSecondaryCats,
  setSelectedSecondaryCats,
}) => {
  const [main, setMain] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [mainCatData, setMainCatData] = useState<MainCats[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMainCatValid, setIsMainCatValid] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isMainCatValidFn = (e: string) => {
    return mainCatData.some(
      (cat) => cat.name.toLowerCase() === e.toLowerCase()
    );
  };

  useEffect(() => {
    setIsMainCatValid(isMainCatValidFn(main));
    if (isMainCatValidFn(main)) {
      const selectedCat = mainCatData.find(
        (cat) => cat.name.toLowerCase() === main.toLowerCase()
      );
      if (selectedCat) {
        setSelectedMainCatId(selectedCat._id);
      }
    } else {
      setSelectedMainCatId(null);
    }
  }, [main, mainCatData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsInputFocused(true);
    const value = e.target.value;
    setMain(value);

    if (value) {
      const suggestions = mainCatData
        .filter((cat) => {
          const nameMatch = cat.name.toLowerCase() === value.toLowerCase();
          const descriptionMatch = cat.description
            .toLowerCase()
            .includes(value.toLowerCase());
          return nameMatch || descriptionMatch;
        })
        .map((cat) => cat.name);
      setSearchSuggestions(suggestions);
    } else {
      const all = mainCatData.map((cat) => cat.name);
      setSearchSuggestions(all);
    }
  };

  const handleSearchSelect = (value: string) => {
    setMain(value);
    setSearchSuggestions([]);
    setIsInputFocused(false);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (dropdownRef.current?.contains(document.activeElement)) {
        return;
      }
      setIsInputFocused(false);
    }, 200);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsInputFocused(false);
    }
  };

  const fetchMain = () => {
    axios
      .get(`${baseUrl}/get/main-cats`, { withCredentials: true })
      .then((response) => {
        const { data } = response;
        if (data.success) {
          setMainCatData(data.data);
        } else {
          toast.error(data.msg);
          window.location.reload();
        }
      })
      .catch((err) => {
        toast.error(err.message);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMain();
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full h-52 flex justify-center items-center">
        <Loading h="h-11" />
      </div>
    );
  }

  return (
    <div className="py-5 flex flex-col gap-3 relative">
      <div className="font-semibold">Information de compte </div>
      <div className="relative w-full" ref={dropdownRef}>
        <Label>Selectioné votre domain de travail :</Label>
        <Input
          onChange={handleSearchChange}
          value={main}
          type="text"
          placeholder="Catégories de recherche..."
          className={`py-5 w-full bg-white`}
          onFocus={handleSearchChange}
          onBlur={handleInputBlur}
        />
        {isInputFocused && (
          <ScrollArea className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-60 overflow-y-auto">
            <ul className="p-2">
              {searchSuggestions.map((item) => (
                <li
                  key={item}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onMouseDown={() => handleSearchSelect(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </div>
      {isMainCatValid && (
        <SeconderyCat
          selectedMainCatId={selectedMainCatId}
          selectedSecondaryCats={selectedSecondaryCats}
          setSelectedMainCatId={setSelectedMainCatId}
          setSelectedSecondaryCats={setSelectedSecondaryCats}
          main={main}
          isMainCatValid={isMainCatValid}
        />
      )}
    </div>
  );
};

export default Step3;
