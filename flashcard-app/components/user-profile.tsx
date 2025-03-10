"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUserContext } from "@/context/userContext";
import { useMutation } from "@apollo/client";
import { CHANGE_PASSWORD, UPDATE_USER } from "@/lib/graphql/userGraphQL";

export function UserProfile() {
  const { user, isLoading, setIsLoading, setUser, removeUser } =
    useUserContext();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState(user!.name);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    rePassword: "",
  });
  const [changePassword] = useMutation(CHANGE_PASSWORD);
  const [updateUser] = useMutation(UPDATE_USER);

  const onChangeText = (key: keyof typeof passwords, value: string) => {
    setPasswords((values) => ({
      ...values,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name) {
      setError("Tên không được bỏ trống");
      setName(user!.name);
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await updateUser({
        variables: {
          input: { name },
        },
      });
      if (data.updateUser.success) {
        setSuccess("Người dùng đã được thay đổi thành công!");
        removeUser();
        console.log(data.updateUser.user);
        setUser(data.updateUser.user);
      } else {
        throw new Error(data.updateUser.message || "Có lỗi xảy ra.");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (
      !passwords.oldPassword ||
      !passwords.newPassword ||
      !passwords.rePassword
    ) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (passwords.newPassword !== passwords.rePassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await changePassword({
        variables: { input: passwords },
      });
      if (data.changePassword.success) {
        setSuccess("Mật khẩu đã được thay đổi thành công!");
        setPasswords({ oldPassword: "", newPassword: "", rePassword: "" });
      } else {
        throw new Error(data.changePassword.message || "Có lỗi xảy ra.");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
                  <AvatarImage src="/avatar.jpg" alt="Avatar" />
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
                  />
                </div>
              </div>
              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên</Label>
                  <Input
                    id="username"
                    name="username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên đăng nhập"
                  />
                </div>
                {user?.email && (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      disabled
                      value={user.email}
                      placeholder="Nhập địa chỉ email"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Lưu thay đổi</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {user?.username && (
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
                  value={passwords.oldPassword}
                  onChange={(e) => onChangeText("oldPassword", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={passwords.newPassword}
                  onChange={(e) => onChangeText("newPassword", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={passwords.rePassword}
                  onChange={(e) => onChangeText("rePassword", e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleChangePassword}>Đổi mật khẩu</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
