import {
  useDeleteSavedGame,
  useGetCurrentUser,
  useLikeGame,
  useSaveGame,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";

type GameStatsProps = {
  game?: Models.Document;
  userId: string;
};

const PostStats = ({ game, userId }: GameStatsProps) => {
  const likesList = game?.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likeGame } = useLikeGame();
  const { mutate: saveGame, isPending: isSaving } = useSaveGame();
  const { mutate: deleteGame, isPending: isDeleting } = useDeleteSavedGame();

  const { data: currentUser } = useGetCurrentUser();

  const savedGame = currentUser?.ownGame.find(
    (record: Models.Document) => record.game.$id === game?.$id
  );

  useEffect(() => {
    setIsSaved(!!savedGame);
  }, [currentUser]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    let newLikes = [...likes];

    const hasLiked = newLikes.includes(userId);
    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }

    setLikes(newLikes);

    likeGame({ gameId: game?.$id || "", likedArray: newLikes });
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (savedGame) {
      setIsSaved(false);
      deleteGame(savedGame.$id);
      return;
    }

    saveGame({ gameId: game?.$id || "", userId });
    setIsSaved(true);
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-3 mr-5">
        <img
          src={
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="like"
          width={20}
          height={20}
          onClick={handleLike}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-3 ">
        {isSaving || isDeleting ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="like"
            width={20}
            height={20}
            onClick={handleSave}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
