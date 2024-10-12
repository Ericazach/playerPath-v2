import { ID, Query } from "appwrite";

import { appwriteConfig, account, databases, avatars } from "./config";
import { INewUser } from "@/types";

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
