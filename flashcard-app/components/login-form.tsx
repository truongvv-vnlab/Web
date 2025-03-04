"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { client } from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";

const loginAPI = async () => {
  const response = await client.get("/auth/google/login");
  return response.data;
};

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  const googleLoginMutation = useMutation({
    mutationFn: loginAPI,
    onMutate: () => {
      setIsLoading(true);
      setError("");
    },
    onError: (error: any) => {
      setError("Something went wrong during Google login.");
      setIsLoading(false);
    },
    onSuccess: (data) => {
      setIsLoading(false);
      // Handle success (for example, you can store the token or navigate)
      router.push("/dashboard");
    },
  });

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError("");
    window.location.href = "http://localhost:4000/auth/google/login";
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
        <CardDescription>
          Đăng nhập vào ứng dụng quản lý thẻ bài của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input id="username" placeholder="Nhập tên đăng nhập" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Hoặc đăng nhập với
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="mr-2 h-4 w-4"
          >
            <path
              fill="currentColor"
              d="M12 22q-2.05 0-3.875-.788t-3.188-2.15-2.137-3.175T2 12q0-2.075.788-3.887t2.15-3.175 3.175-2.138T12 2q2.075 0 3.887.788t3.175 2.15 2.138 3.175T22 12q0 2.05-.788 3.875t-2.15 3.188-3.175 2.137T12 22m0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20m-1-8.5V8h2v3.5H16v2h-3V17h-2v-3.5H8v-2z"
            />
          </svg>
          Google
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-primary underline">
            Đăng ký
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
