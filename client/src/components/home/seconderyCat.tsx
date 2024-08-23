/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseUrl, response } from "@/app/siteSettings";
import { toast } from "sonner";
import { Input } from "../ui/input";
import _ from "lodash";
import { Button } from "../ui/button";

interface SeconderyCatProps {
  main: string;
  isMainCatValid: boolean;
  selectedMainCatId: string | null;
  setSelectedMainCatId: (e: string | null) => void;
  selectedSecondaryCats: SecondaryCategory[];
  setSelectedSecondaryCats: (e: SecondaryCategory[]) => void;
}

export interface SecondaryCategory {
  _id: string;
  name: string;
  description: string;
}

const SeconderyCat: React.FC<SeconderyCatProps> = ({
  main,
  isMainCatValid,
  selectedMainCatId,
  selectedSecondaryCats,
  setSelectedMainCatId,
  setSelectedSecondaryCats,
}) => {
  const [secondaryCatData, setSecondaryCatData] = useState<SecondaryCategory[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const [selectedSecCats, setSelectedSecCats] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSecondary = () => {
      setLoading(true);
      axios
        .post(
          `${baseUrl}/get/secondery-cats`,
          { main },
          { withCredentials: true }
        )
        .then(({ data }: { data: response }) => {
          if (data.success) {
            setSecondaryCatData(data.data);
            setSearchSuggestions(
              data.data.map((cat: SecondaryCategory) => cat.name)
            );
          } else {
            toast.error(data.msg);
            window.location.reload();
          }
        })
        .catch(({ data }: { data: response }) => {
          toast.error(data.msg);
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    if (isMainCatValid) {
      fetchSecondary();
    }
  }, [main]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim(); // Trim whitespace from input value
    setSearch(value);

    if (value === "") {
      setSearchSuggestions(secondaryCatData.map((cat) => cat.name));
    } else {
      const normalizedValue = _.deburr(value).toLowerCase();
      const suggestions = secondaryCatData
        .filter((cat) => {
          const normalizedCatName = _.deburr(cat.name).toLowerCase();
          return normalizedCatName.includes(normalizedValue);
        })
        .map((cat) => cat.name);
      setSearchSuggestions(suggestions);
    }
  };

  const handleSearchSelect = (value: string) => {
    const selectedCat = secondaryCatData.find((cat) => cat.name === value);
    if (selectedCat && selectedSecondaryCats.length < 5) {
      setSelectedSecondaryCats([...selectedSecondaryCats, selectedCat]);
      setSelectedSecCats([...selectedSecCats, selectedCat._id]);
    } else {
      toast.error("Vous pouvez sélectionner jusqu'à 5 catégories secondaires.");
    }
    setSearch("");
    setSearchSuggestions([]);
    setIsInputFocused(false);
  };

  const removeSecondaryCat = (id: string) => {
    const updatedCats = selectedSecondaryCats.filter((cat) => cat._id !== id);
    setSelectedSecondaryCats(updatedCats);
    const updatedCatIds = selectedSecCats.filter((catId) => catId !== id);
    setSelectedSecCats(updatedCatIds);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsInputFocused(false);
    }, 200);
  };

  const handlePlusClick = () => {
    setIsInputFocused(true);
    setSearchSuggestions(
      secondaryCatData
        .filter((cat) => !selectedSecCats.includes(cat._id))
        .map((cat) => cat.name)
    );
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  if (loading) {
    return <div>Chargement des catégories secondaires...</div>;
  }

  return (
    <div className="relative w-full">
      <label className="block font-medium">
        Sélectionnez vos sous-catégories :
      </label>
      <div className="flex flex-wrap gap-3 items-center">
        {selectedSecondaryCats.map((cat) => (
          <div
            key={cat._id}
            className="flex items-center gap-2 bg-gray-100 rounded-md p-2"
          >
            <span>{cat.name}</span>
            <button
              type="button"
              className="text-red-500"
              onClick={() => removeSecondaryCat(cat._id)}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
        <Button
          className="text-gray-600 cursor-pointer flex flex-row gap-1"
          variant={"outline"}
          onClick={handlePlusClick}
        >
          Ajouter
        </Button>
      </div>
      {isInputFocused && (
        <div className="mt-2">
          <Input
            ref={inputRef}
            onChange={handleSearchChange}
            value={search}
            type="text"
            placeholder="Ajouter une sous-catégorie..."
            className={`py-2 w-full bg-white`}
            onFocus={() => {
              setIsInputFocused(true);
              setSearchSuggestions(
                secondaryCatData
                  .filter((cat) => !selectedSecCats.includes(cat._id))
                  .map((cat) => cat.name)
              );
            }}
            onBlur={handleInputBlur}
          />
          <ul className="mt-1 bg-white border border-gray-300 rounded-lg w-full max-h-60 overflow-y-auto">
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
        </div>
      )}
    </div>
  );
};

export default SeconderyCat;
