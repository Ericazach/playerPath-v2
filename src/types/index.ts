import React from "react";

export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewGame = {
  userId: string;
  title: string;
  file: File[];
  description: string;
};

export type IUpdatePost = {
  gameId: string;
  title: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  description?: string;
  State?: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
  isAdmin?: boolean;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
  isAdmin?: boolean;
};
