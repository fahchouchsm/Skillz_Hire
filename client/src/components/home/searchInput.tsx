/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import data from "../../app/data/morocco/ville.json";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface SearchInputProps {
  setSearch: (search: string) => void;
  setCity: (city: string) => void;
  search: string;
  city: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  search,
  setSearch,
  city,
  setCity,
}) => {
  const autocompleteData = ["Product 1", "Product 2", "Product 3"];
  const cityAutocompleteData = data.map((item) => item.ville);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [isCityInputFocused, setIsCityInputFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    setSearchSuggestions(filterSuggestions(search, autocompleteData));
  }, [search]);

  useEffect(() => {
    setCitySuggestions(filterSuggestions(city, cityAutocompleteData));
  }, [city]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleSearchSelect = (value: string) => {
    setSearch(value);
    setSearchSuggestions([]);
  };

  const handleCitySelect = (value: string) => {
    setCity(value);
    setCitySuggestions([]);
    setIsCityInputFocused(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLLIElement>,
    onSelect: (value: string) => void
  ) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission behavior

      if (e.currentTarget instanceof HTMLInputElement) {
        onSelect(e.currentTarget.value || "");
        handleSearchButtonClick(); // Call search function when Enter is pressed
      } else if (e.currentTarget instanceof HTMLLIElement) {
        onSelect(e.currentTarget.textContent || "");
        handleSearchButtonClick(); // Call search function when Enter is pressed
      }
    }
  };

  const handleSearchButtonClick = () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append("search", search);
    params.append("city", city);
    const queryString = params.toString();
    router.push(`/search?${queryString}`);
  };

  return (
    <div className="flex flex-row items-center w-full drop-shadow-lg rounded-lg">
      <div className="w-7/12 md:w-6/12 lg:w-7/12 xl:w-3/5 relative">
        <Input
          onChange={handleSearchChange}
          onKeyDown={(e) => handleKeyDown(e, setSearch)}
          value={search}
          type="text"
          placeholder="Search products..."
          className="py-7 w-full bg-white rounded-e-none"
        />
        {searchSuggestions.length > 0 && search.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full">
            {searchSuggestions.map((item, index) => (
              <li
                key={item} // Use item as key
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => handleSearchSelect(item)}
                onKeyDown={(e) => handleKeyDown(e, handleSearchSelect)}
                tabIndex={0}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="w-3/12 md:w-2/12 lg:w-3/12 xl:w-1/5 relative">
        <Input
          onChange={handleCityChange}
          onKeyDown={(e) => handleKeyDown(e, setCity)}
          value={city}
          type="text"
          placeholder="Enter city..."
          className="py-7 bg-white w-full rounded-none"
          onFocus={() => setIsCityInputFocused(true)}
          onBlur={() => setIsCityInputFocused(false)}
        />
        {isCityInputFocused && citySuggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full">
            {citySuggestions.map((item, index) => (
              <li
                key={item} // Use item as key
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => handleCitySelect(item)}
                onKeyDown={(e) => handleKeyDown(e, handleCitySelect)}
                tabIndex={0}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="relative">
        <Button
          className="py-7 w-full rounded-s-none"
          onClick={handleSearchButtonClick}
          disabled={loading}
        >
          {loading ? "Chargement..." : "Chercher"}
        </Button>
      </div>
    </div>
  );
};

export default SearchInput;
