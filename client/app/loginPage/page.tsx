"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log({ email, password });
    // TODO: fetch POST /auth/login
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-own-dark">
      <Card className="w-full max-w-md p-6 sm:p-8 rounded-xl shadow bg-card">
        <CardHeader >
          <CardTitle className="mb-6 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold">Bon retour</h1>
          </CardTitle>
          <CardDescription className="mt-1 text-sm text-gray-500">
            On est content de te revoir !
          </CardDescription>
        </CardHeader>

        {/* Le form englobe aussi le footer pour que submit marche */}
        <form onSubmit={onSubmit}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Mot de passe oublié?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2 mt-5">
            <Button type="submit" className="w-full bg-purple-discord text-white hover:bg-gray-400 hover:text-white" >
              Connexion
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
