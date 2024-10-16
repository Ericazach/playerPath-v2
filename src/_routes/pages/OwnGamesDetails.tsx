import PostStats from "@/components/shared/PostStats";
import { useUserContext } from "@/context/AuthContext";
import { useOwnGameById } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const OwnGamesDetails = () => {
  const { id } = useParams();
  const { data: game, isPending } = useOwnGameById(id || "");
  const { user } = useUserContext();

  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img
            src={game?.game.imageUrl}
            alt="game"
            className="post_details-img"
          />
          <div className="post_details-info">
            <div className="flex gap-3 flex-col small-medium lg:base-medium py-2 justify-center">
              <p className="font-bold text-xl md:text-2xl text-light-1">
                {game?.game.title}
              </p>
              <p className="text text-light-3">{game?.game.description}</p>
              <hr className="border w-full border-dark-4/80" />
              <div className="flex justify-between w-full">
                <div className="opacity-80">
                  <button
                    type="button"
                    className="text-white bg-gradient-to-r from-dark-4 via-dark-3 to-dark-4 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300  font-bold rounded-lg text-base uppercase px-5 py-2.5 text-center me-2 mb-2"
                  >
                    {game?.State}
                  </button>
                </div>
                <div className="flex justify-end ">
                  <div className="">
                    <Link
                      to={`/update-ownGames/${game?.$id}`}
                      className={user.id !== game?.user.$id ? "hidden" : ""}
                    >
                      <img
                        src="/assets/icons/edit.svg"
                        alt="edit"
                        width={24}
                        height={24}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full">
              <PostStats game={game?.game} userId={user.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnGamesDetails;
