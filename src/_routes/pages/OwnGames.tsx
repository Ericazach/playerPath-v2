import GridGameList from "@/components/shared/GridGameList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

const OwnGames = () => {
  const { data: user } = useGetCurrentUser();

  const saveGames = user?.ownGame
    .map((saveGame: Models.Document) => ({
      ...saveGame.game,
      creator: {
        imageUrl: user.imageUrl,
      },
    }))
    .reverse();

  if (!saveGames) {
    return <Loader />;
  }
  console.log(user);
  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Games</h2>
      </div>

      {!user ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {saveGames.length === 0 ? (
            <p className="text-light-4">No available Games</p>
          ) : (
            <GridGameList games={saveGames} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default OwnGames;
