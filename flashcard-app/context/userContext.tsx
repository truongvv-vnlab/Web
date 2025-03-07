import { createContext, useContext, useEffect, useState } from "react";

interface User {
  _id: string;
  email?: string;
  username?: string;
  name: string;
  googleId?: string;
}

export type UserContextType = {
  user?: User;
  setUser: (user: User) => void;
  removeUser: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const UserContext = createContext<UserContextType | null>(null);

const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = (user: User) => {
    setIsLoading(true);
    try {
      setUserState(user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error setting user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeUser = () => {
    setIsLoading(true);
    try {
      setUserState(undefined);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error removing user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, removeUser, isLoading, setIsLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext) as UserContextType;
};

export default UserProvider;
