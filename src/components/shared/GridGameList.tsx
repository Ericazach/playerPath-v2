import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type GridGamesListProps = {
  games: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridGameList = ({
  games,
  showUser = true,
  showStats = true,
}: GridGamesListProps) => {
  const { user } = useUserContext();

  return (
    <ul className="grid-container">
      {games.map((game) => (
        <li key={game.$id} className="relative min-w-80 h-80">
          <Link to={`/games/${game.$id}`} className="grid-post_link">
            <img
              src={game.imageUrl}
              alt="game"
              className="w-full h-full object-cover"
            />
          </Link>
          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1 ">
                <img
                  src={game.creator.imageUrl}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{game.creator.name}</p>
              </div>
            )}
            {showStats && <PostStats game={game} userId={user?.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridGameList;
