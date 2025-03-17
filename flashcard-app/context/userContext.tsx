import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER } from '@/lib/graphql/userGraphQL';

interface User {
  email?: string;
  username?: string;
  name: string;
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
  const { data, loading, error } = useQuery(GET_USER);

  useEffect(() => {
    if (!loading) {
      if (data?.whoami) {
        setUserState(data.whoami);
      } else if (error) {
        setUserState(undefined);
      }
    }
  }, [data, loading, error]);

  const setUser = (user: User) => {
    setUserState(user);
  };

  const removeUser = () => {
    setUserState(undefined);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        removeUser,
        isLoading: loading,
        setIsLoading: () => {},
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext) as UserContextType;
};

export default UserProvider;
