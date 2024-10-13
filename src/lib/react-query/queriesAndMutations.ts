import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  createGame,
  createUserAccount,
  deleteSavedGame,
  getCurrentUser,
  getRecentGames,
  likeGame,
  saveGame,
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

export const useGetRecentGames = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_GAMES],
    queryFn: getRecentGames,
  });
};

export const useLikeGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      gameId,
      likedArray,
    }: {
      gameId: string;
      likedArray: string[];
    }) => likeGame(gameId, likedArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_GAME_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_GAMES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_GAMES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useSaveGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gameId, userId }: { gameId: string; userId: string }) =>
      saveGame(gameId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_GAMES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_GAMES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteGame = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (saveRecordId: string) => deleteSavedGame(saveRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_GAMES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_GAMES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};
