import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  createGame,
  createUserAccount,
  signInAccount,
  signOutAccount,
} from "../appwrite/api";
import { INewGame, INewUser } from "@/types";
import { QUERY_KEYS } from "./queryKeys";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

export const useCreateGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (game: INewGame) => createGame(game),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: {
          queryKey: [QUERY_KEYS.GET_RECENT_GAMES],
        },
      });
    },
  });
};
