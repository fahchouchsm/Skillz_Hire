"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios, { AxiosError, AxiosResponse } from "axios";
import { baseUrl } from "../siteSettings";

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const result: AxiosResponse = await axios.post(
        `${baseUrl}/register`,
        {
          email,
          firstName,
          lastName,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(result);

      if (result.data.success) {
        toast.success(result.data.msg);
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        toast.error(result.data.msg);
      }
    } catch (err: any) {
      toast.error(err.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="h-screen w-full flex items-center justify-center bg-gray-100"
      onSubmit={submitHandler}
    >
      <Toaster richColors={true} position="top-center" />
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">S'inscrire</CardTitle>
          <CardDescription>
            Entrez vos informations pour créer un compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              {" "}
              <div className="grid gap-2">
                <Label htmlFor="last-name">Nom de famille</Label>
                <Input
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nom de famille"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="first-name">Prénom</Label>
                <Input
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Prénom"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exp@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                placeholder="Confirmez le mot de passe"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Créer un compte"
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                router.push("/login");
              }}
            >
              Se connecter
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default Register;
