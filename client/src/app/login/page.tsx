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
import { Checkbox } from "@/components/ui/checkbox";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const result: AxiosResponse = await axios.post(
        `${baseUrl}/login`,
        {
          email,
          password,
          rememberMe,
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

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked === true);
  };

  return (
    <form
      className="h-screen w-full flex items-center justify-center bg-gray-100"
      onSubmit={submitHandler}
    >
      <Toaster richColors={true} position="top-center" />
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Se connecter</CardTitle>
          <CardDescription>
            Entrez votre e-mail ci-dessous pour vous connecter à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
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
              <div className="flex items-center space-x-2 mt-1">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={handleRememberMeChange}
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 "
                >
                  souviens-toi de moi
                </label>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  S&apos;il vous plaît, attendez
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={() => {
                router.push("/register");
              }}
            >
              S&apos;inscrire
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default Login;
