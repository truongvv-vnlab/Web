"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function UserProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLinked, setIsGoogleLinked] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    username: "Người dùng",
    email: "user@example.com",
    avatar: "/placeholder.svg?height=128&width=128",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccess("Thông tin tài khoản đã được cập nhật thành công!");
    }, 1000);
  };

  const handleLinkGoogle = () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Simulate Google linking
    setTimeout(() => {
      setIsLoading(false);
      setIsGoogleLinked(true);
      setSuccess("Tài khoản Google đã được liên kết thành công!");
    }, 1500);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setUserData((prev) => ({
            ...prev,
            avatar: event.target?.result as string,
          }));
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              <Check className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userData.avatar} alt="Avatar" />
                  <AvatarFallback>{userData.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2">
                  <Label
                    htmlFor="avatar-upload"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    <span className="sr-only">Thay đổi ảnh đại diện</span>
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>
              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input
                    id="username"
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ email"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tài khoản liên kết</CardTitle>
          <CardDescription>
            Quản lý các tài khoản liên kết với tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="h-6 w-6"
              >
                <path
                  fill="currentColor"
                  d="M12 22q-2.05 0-3.875-.788t-3.188-2.15-2.137-3.175T2 12q0-2.075.788-3.887t2.15-3.175 3.175-2.138T12 2q2.075 0 3.887.788t3.175 2.15 2.138 3.175T22 12q0 2.05-.788 3.875t-2.15 3.188-3.175 2.137T12 22m0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20m-1-8.5V8h2v3.5H16v2h-3V17h-2v-3.5H8v-2z"
                />
              </svg>
              <div>
                <p className="font-medium">Google</p>
                <p className="text-sm text-muted-foreground">
                  {isGoogleLinked
                    ? "Tài khoản đã được liên kết"
                    : "Liên kết tài khoản Google để đăng nhập nhanh hơn"}
                </p>
              </div>
            </div>
            {!isGoogleLinked ? (
              <Button
                variant="outline"
                onClick={handleLinkGoogle}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Liên kết"
                )}
              </Button>
            ) : (
              <Button variant="outline" disabled>
                <Check className="mr-2 h-4 w-4" />
                Đã liên kết
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bảo mật</CardTitle>
          <CardDescription>
            Quản lý mật khẩu và bảo mật tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <Input id="new-password" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
              />
            </div>
            <div className="flex justify-end">
              <Button>Đổi mật khẩu</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
