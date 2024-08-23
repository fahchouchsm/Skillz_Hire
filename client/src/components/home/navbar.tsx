/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Link from "next/link";
import { UserData } from "@/utils/useUserData";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu, Package2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import axios from "axios";
import { baseUrl } from "@/app/siteSettings";
import { toast, Toaster } from "sonner";
import { NavigationMenuDemo } from "./navDropdown";

export interface NavBarProps {
  userData: UserData | null;
}

const NavBar: React.FC<NavBarProps> = ({ userData }) => {
  const router = useRouter();

  const logOutHandler = async () => {
    try {
      await axios.get(`${baseUrl}/logout`, { withCredentials: true });
      toast.warning("Vous vous êtes déconnecté avec succès.");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erreur lors de la déconnexion.");
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="w-full border">
      <Toaster richColors={true} position="top-center" />
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex w-full justify-between items-center">
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              {userData && (
                <>
                  <img
                    src="/logo/black/png/logo-no-background.png"
                    alt="logo"
                    className="h-6"
                  />
                  <span className="sr-only">Skillz Hire</span>
                </>
              )}
            </Link>
            <div className="flex mr-auto ">
              <NavigationMenuDemo />
            </div>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  {userData && (
                    <>
                      <Package2 className="h-6 w-6" />
                      <span className="sr-only">Acme Inc</span>
                    </>
                  )}
                </Link>
                {!userData ? (
                  <>
                    <Link
                      href="/login"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Se connecter
                    </Link>
                    <Link
                      href="/register"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      S&apos;inscrire
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Paramètres
                    </Link>
                    <Link
                      href={`/become-seller/${userData._id}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Devenir vendeur
                    </Link>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Logout
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <nav className="flex gap-4 md:ml-auto md:gap-2 lg:gap-4 ">
            {!userData ? (
              <>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:border-b-2 transition-colors hover:text-foreground"
                >
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  className="text-muted-foreground hover:border-b-2 transition-colors hover:text-foreground"
                >
                  S&apos;inscrire
                </Link>
              </>
            ) : (
              <>
                {userData.isSeller ? (
                  <></>
                ) : (
                  <Button
                    className="hidden sm:block"
                    onClick={() => {
                      router.push(`/become-seller/${userData._id}`);
                    }}
                  >
                    Devenir vendeur
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full"
                    >
                      <img
                        alt="pfp"
                        className="h-full w-full rounded-full"
                        src={userData.pfpLink}
                      />
                      <span className="sr-only">Toggle user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {userData.firstName} {userData.lastName}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userData.isSeller && (
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                          router.push(`/user/current/services/${userData._id}`);
                        }}
                      >
                        Mes Services
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        router.push(`/user/${userData._id}`);
                      }}
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={logOutHandler}
                    >
                      Se déconnecter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </nav>
        </div>
      </header>
    </div>
  );
};

export default NavBar;
