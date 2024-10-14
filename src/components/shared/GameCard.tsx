import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type GameCardProps = {
  game: Models.Document;
};

const GameCard = ({ game }: GameCardProps) => {
  const { user } = useUserContext();

  if (!game.creator) return;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${game.creator.$id}`}>
            <img
              src={
                game.creator.imageUrl || "assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {game.creator.name}
            </p>
            <div className="flex flex-start text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(game.$createdAt)}
              </p>
            </div>
          </div>
        </div>
        <Link
          to={`/update-game/${game.$id}`}
          className={`${user.id !== game.creator.$id && "hidden"}`}
        >
          <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>
      <Link to={`/games/${game.$id}`}>
        <div className="flex flex-col flex-1 w-full small-medium lg:base-regular py-5">
          <p className="">{game.title}</p>
          <p className="text-light-3">{game?.description}</p>
        </div>
        <img
          src={game.imageUrl || "assets/icons/profile-placeholder.svg"}
          alt="image"
          className="post-card_img"
        />
      </Link>
      <PostStats game={game} userId={user.id} />
    </div>
  );
};

export default GameCard;
