/* eslint-disable @next/next/no-img-element */
import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface SideProps {}

const Side: React.FC<SideProps> = () => {
  const bullets = [
    {
      name: "Gratuit à utiliser",
    },
    {
      name: "Aucun paiement nécessaire",
    },
    { name: "Trouvez des clients qui conviennent à votre travail" },
  ];

  return (
    <div className="hidden sm:flex sm:w-4/12 bg-emerald-500 h-full flex-col gap-6 p-4 py-10">
      <div className="flex items-center">
        <img
          src="/logo/white/png/logo-no-background.png"
          alt="logo"
          className="h-7 w-fit"
        />
        <span className="sr-only">Skillz Hire</span>
      </div>
      <Card className="w-full">
        <CardHeader className="pb-5">
          <CardTitle className="mb-0.5 text-lg">Devenir vendeur</CardTitle>
          <CardDescription>
            Commencez à offrir vos services à travers le monde!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-left">
            {bullets.map((bull, i) => (
              <li
                key={i}
                className="text-sm flex items-center space-x-2 text-emerald-500"
              >
                <Check className="" />
                <span>{bull.name}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Side;
