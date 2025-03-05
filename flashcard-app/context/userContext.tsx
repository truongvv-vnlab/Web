import { createContext, useContext, useState } from "react";

interface User {
  _id: string;
  email?: string;
  username?: string;
  name: string;
  googleId?: string;
}

export type UserStateType = {
  user?: User;
};

export type UserContextType = {
  user?: User;
  setUser: (user: User) => void;
  updateUser: (user: User) => void;
  removeUser: () => void;
};

export const UserContext = createContext<UserContextType | null>(null);

const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<User | undefined>(undefined);

  const setUser = (user: User) => {
    setUserState(user);
  };

  const updateUser = (user: User) => {
    setUserState(user);
  };

  const removeUser = () => {
    setUserState(undefined);
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, removeUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext) as UserContextType;
};

export default UserProvider;
