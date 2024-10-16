import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  createGame,
  createUserAccount,
  deleteGame,
  deleteSavedGame,
  getCurrentUser,
  getGamebyId,
  getInfiniteGames,
  getOwnGamebyId,
  getRecentGames,
  likeGame,
  saveGame,
  searchGames,
  signInAccount,
  signOutAccount,
  uploadGame,
} from "../appwrite/api";
import { INewGame, INewUser, IUpdatePost } from "@/types";
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
        queryKey: [QUERY_KEYS.GET_RECENT_GAMES],
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

export const useDeleteSavedGame = () => {
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

export const useGetGameById = (gameId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_GAME_BY_ID, gameId],
    queryFn: () => getGamebyId(gameId),
    enabled: !!gameId,
  });
};

export const useOwnGameById = (gameId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_GAME_BY_ID, gameId],
    queryFn: () => getOwnGamebyId(gameId),
    enabled: !!gameId,
  });
};

export const useUpdateGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (game: IUpdatePost) => uploadGame(game),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_GAME_BY_ID, data?.$id],
      });
    },
  });
};

export const useDeleteGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gameId, imageId }: { gameId: string; imageId: string }) =>
      deleteGame(gameId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_GAMES],
      });
    },
  });
};

export const useGetGames = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_GAMES],
    queryFn: getInfiniteGames,
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.documents.length === 0) return null;
      const lastId = lastPage?.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
    initialPageParam: undefined, // Agregado para evitar el error
  });
};

export const useSearchGames = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_GAMES, searchTerm],
    queryFn: () => searchGames(searchTerm),
    enabled: !!searchTerm,
  });
};
