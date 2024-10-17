import { ID, ImageGravity, Query } from "appwrite";

import { appwriteConfig, account, databases, avatars, storage } from "./config";
import { INewGame, INewUser, IUpdatePost, IUpdateUser } from "@/types";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrlString = avatars.getInitials(user.name);

    const avatarUrl = new URL(avatarUrlString);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
  isAdmin?: boolean;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SIGN IN
// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    // Create session when user signs in
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );

    if (!session) {
      throw new Error("Failed to create session.");
    }

    return session;
  } catch (error) {
    console.error("Error signing in:", error);
    return error;
  }
}

// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    // Fetch account details only if a session exists
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw new Error("No active session found. Please sign in.");
    }
    return currentAccount;
  } catch (error) {
    console.error("Error fetching account details:", error);
  }
}

// ============================== GET CURRENT USER
export async function getCurrentUser() {
  try {
    // Check if user is logged in
    const currentAccount = await getAccount();
    if (!currentAccount) {
      throw new Error("User is not authenticated.");
    }

    // Get user data from the database based on accountId
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) {
      throw new Error("User data not found.");
    }
    return currentUser.documents[0];
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

// ========CREATE GAME ================

export async function createGame(game: INewGame) {
  try {
    const uploadedFile = await uploadFile(game.file[0]);

    if (!uploadedFile) throw Error;

    const fileUrl = await getFilePreview(uploadedFile.$id);

    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }

    const newGame = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.gameCollectionId,
      ID.unique(),
      {
        creator: game.userId,
        title: game.title,
        description: game.description,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
      }
    );

    if (!newGame) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newGame;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export async function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      ImageGravity.Center,
      100
    );

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return {
      status: "ok",
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentGames() {
  const games = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.gameCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );

  if (!games) {
    throw Error;
  }
  return games;
}

export async function likeGame(gameId: string, likesArray: string[]) {
  try {
    const updatedGame = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.gameCollectionId,
      gameId,
      {
        likes: likesArray,
      }
    );
    if (!updatedGame) {
      throw Error;
    }
    return updatedGame;
  } catch (error) {
    console.log(error);
  }
}

export async function saveGame(gameId: string, userId: string) {
  try {
    const savedGame = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ownGameCollectionId,
      ID.unique(),
      {
        user: userId,
        game: gameId,
        State: "saved",
      }
    );
    if (!savedGame) {
      throw Error;
    }
    return savedGame;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSavedGame(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ownGameCollectionId,
      savedRecordId
    );
    if (!statusCode) {
      throw Error;
    }
    return {
      status: "ok",
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getGamebyId(gameId: string) {
  try {
    const game = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.gameCollectionId,
      gameId
    );
    return game;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadGame(game: IUpdatePost) {
  const hasFileToUpload = game.file.length > 0;

  try {
    let image = {
      imageUrl: game.imageUrl,
      imageId: game.imageId,
    };

    if (hasFileToUpload) {
      const uploadedFile = await uploadFile(game.file[0]);
      if (!uploadedFile) throw Error;

      const fileUrl = await getFilePreview(uploadedFile.$id);

      if (!fileUrl) {
        deleteFile(uploadedFile.$id);
        throw Error;
      }

      const newFileUrl = new URL(fileUrl);

      image = { ...image, imageUrl: newFileUrl, imageId: uploadedFile.$id };
    }

    const updatedGame = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.gameCollectionId,
      game.gameId,
      {
        title: game.title,
        description: game.description,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    if (!updatedGame) {
      await deleteFile(game.imageId);
      throw Error;
    }

    return updatedGame;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteGame(gameId: string, imageId: string) {
  try {
    if (!gameId || !imageId) throw Error;
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.gameCollectionId,
      gameId
    );

    return {
      status: "ok",
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getInfiniteGames({ pageParam }: { pageParam?: string }) {
  // Define the queries array with the correct type
  const queries: (
    | ReturnType<typeof Query.orderDesc>
    | ReturnType<typeof Query.limit>
    | ReturnType<typeof Query.cursorAfter>
  )[] = [Query.orderDesc("$createdAt"), Query.limit(20)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam));
  }

  try {
    const games = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.gameCollectionId,
      queries
    );

    if (!games) {
      throw new Error("Error al obtener los juegos");
    }

    return games;
  } catch (error) {
    console.log(error);
  }
}

export async function searchGames(searchTerm: string) {
  try {
    const games = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.gameCollectionId,
      [Query.search("title", searchTerm)]
    );

    if (!games) {
      throw Error;
    }
    return games;
  } catch (error) {
    console.log(error);
  }
}

export async function getOwnGamebyId(gameId: string) {
  try {
    const game = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ownGameCollectionId,
      gameId
    );
    return game;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserbyId(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );
    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadOwnGame(game: IUpdatePost) {
  // const hasFileToUpload = game.file.length > 0;

  try {
    const updatedGame = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ownGameCollectionId,
      game.gameId,
      {
        State: game.State,
      }
    );

    if (!updatedGame) {
      await deleteFile(game.imageId);
      throw Error;
    }

    return updatedGame;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = await getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      const newFileUrl = new URL(fileUrl);

      image = { ...image, imageUrl: newFileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}
