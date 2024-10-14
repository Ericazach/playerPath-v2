import GameCard from "@/components/shared/GameCard";
import Loader from "@/components/shared/Loader";
import { useGetRecentGames } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

const Home = () => {
  const {
    data: games,
    isPending: isPostLoading,
    // isError: isErrorGames,
  } = useGetRecentGames();

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h2-bold md:h2-bold text-left w-full">Home Feed</h2>

          {isPostLoading && !games ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {games?.documents.map((game: Models.Document) => (
                <GameCard game={game} key={game.$id} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
