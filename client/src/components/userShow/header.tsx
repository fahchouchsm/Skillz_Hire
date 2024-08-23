import React from "react";
import { SellerData, UserData } from "@/utils/useUserData";
import { Separator } from "../ui/separator";
import { MapPin, Send, Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { TimeDayMonth } from "@/functions/functions";
import { Label } from "@radix-ui/react-dropdown-menu";
import { cats, user } from "@/app/user/[id]/page";

interface Props {
  user: user;
  cats: cats;
}

const Header: React.FC<Props> = ({ user, cats }) => {
  const { sellerData } = user;
  const current = user.userData;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row w-full gap-5 justify-between">
        <div className="flex flex-col gap-7">
          <HeaderUserInformation user={user} cats={cats} />
          <div className="flex flex-col gap-2">
            <Label className="font-semibold">À propos de moi :</Label>
            <p className="">
              {sellerData?.bio !== "" ? sellerData?.bio : "Aucune bio."}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-semibold">Domain :</Label>
            <p className="">{cats.mainCat.name}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-semibold">Compétences :</Label>
            <div className="flex flex-wrap">
              {cats.secCats.map((sub, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-3xl mb-2 mr-2 px-3 py-2 border"
                >
                  {sub.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <CardWithForm user={user} cats={cats} />
      </div>
    </div>
  );
};

const CardWithForm: React.FC<Props> = ({ user }) => {
  const { sellerData } = user;
  const current = user.userData;

  if (!sellerData) {
    return null;
  }

  return (
    <Card className="w-fit min-w-80 h-fit">
      <CardHeader>
        <CardContent>
          <div className="flex flex-row gap-3">
            <img
              src={current.pfpLink}
              className="h-10 rounded-full w-10"
              alt=""
            />
            <div className="">
              <div className="font-semibold text-sm">
                @{sellerData?.username}
              </div>
              <div className="font-normal text-gray-500 text-sm">
                En ligne • {TimeDayMonth(current.lastOnline)}
              </div>
            </div>
          </div>
        </CardContent>
      </CardHeader>
      <CardFooter className="w-full">
        <Button className="w-full">
          <Send className="h-4" /> Contacter-moi
        </Button>
      </CardFooter>
    </Card>
  );
};

const HeaderUserInformation: React.FC<Props> = ({ user }) => {
  const { sellerData } = user;
  const current = user.userData;

  if (!sellerData) {
    return null;
  }

  return (
    <div className="flex flex-row gap-5">
      <img
        src={user.userData.pfpLink}
        alt="Profile Picture"
        className="w-32 h-32 rounded-full"
      />
      <div className="flex flex-col justify-center">
        <div className="flex flex-col gap-1">
          <div className="font-semibold text-2xl">@{sellerData?.username}</div>
          {sellerData.accountType === "individual" && (
            <div className="text-gray-500 text-sm pl-1">
              {current.firstName} {current.lastName}
            </div>
          )}
          <div className="flex text-gray-800 items-center gap-2 text-sm">
            <div className="flex flex-row items-center">
              <Star className="h-4" />
              <div className="">
                {sellerData.averageRating} ({sellerData.totalRating})
              </div>
            </div>
            <Separator orientation="vertical" className="h-5" />
            <MapPin className="h-4" />
            <div className="">Maroc</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
