"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { setAuthCookie } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/accounts/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Set authentication cookie with the JWT token
      setAuthCookie(data.access);
      
      // Store token in localStorage as well for API calls
      localStorage.setItem('auth-token', data.access);
      
      // Store user data in localStorage if needed
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to orders page
      router.push("/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[hsl(222.2,84%,8%)] pt-20">
      <div className="container mx-auto px-4">
        <Card className="w-full max-w-[500px] mx-auto border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-[hsl(222.2,84%,6%)] backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-[hsl(222.2,84%,6%)]/60 shadow-lg dark:shadow-[0_0_15px_rgba(0,0,0,0.3)]">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription className="text-base">Enter your credentials to access the dispatcher</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 bg-gray-50 dark:bg-[hsl(222.2,84%,7%)] border-gray-200 dark:border-gray-700/50"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 bg-gray-50 dark:bg-[hsl(222.2,84%,7%)] border-gray-200 dark:border-gray-700/50"
                />
              </div>
              <Button type="submit" className="w-full h-11 text-base">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 