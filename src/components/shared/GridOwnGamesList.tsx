import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type GridGamesListProps = {
  games: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridOwnGameList = ({
  games,
  showUser = true,
  showStats = true,
}: GridGamesListProps) => {
  const { user } = useUserContext();

  return (
    <ul className="grid-container">
      {games.map((game) => (
        <li key={game.game.$id} className="relative min-w-80 h-80">
          <Link to={`/ownGames/${game.$id}`} className="grid-post_link">
            <img
              src={game.game.imageUrl}
              alt="game"
              className="w-full h-full object-cover"
            />
          </Link>
          <div className="absolute top-0 right-0 p-1 opacity-75">
            <button
              type="button"
              className="text-white bg-gradient-to-r from-light-4 via-light-3 to-light-4 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300  font-bold rounded-lg text-base uppercase px-5 py-2.5 text-center me-2 mb-2"
            >
              {game?.State}
            </button>
          </div>
          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1 ">
                {/* <img
                  src={game.creator.imageUrl}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                /> */}
                <p className="line-clamp-1 font-semibold text-lg bg-dark-4 bg-opacity-40 rounded-xl">
                  {game.game.title}
                </p>
              </div>
            )}
            {showStats && <PostStats game={game} userId={user?.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridOwnGameList;
