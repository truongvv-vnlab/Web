import { client } from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLogin = () => {
  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      try {
        const response = await client.post("/auth/login", {
          username: username,
          password: password,
        });
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || "Đăng nhập thất bại");
        }
        throw new Error("Đăng nhập thất bại");
      }
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      try {
        await client.post("/auth/google/logout");
      } catch (error: any) {
        if (error.response && error.response.data) {
          toast.error(error.response.data.message || "Đăng xuất thất bại");
        }
        toast.error("Đăng xuất thất bại");
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async ({
      username,
      password,
      name,
    }: {
      username: string;
      password: string;
      name: string;
    }) => {
      try {
        const response = await client.post("/auth/register", {
          username,
          password,
          name,
        });
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.data) {
          throw new Error(error.response.data.message || "Đăng ký thất bại");
        }
        throw new Error("Đăng ký thất bại");
      }
    },
  });
};
