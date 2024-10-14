import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  useDeleteGame,
  useGetGameById,
} from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { Loader } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

const GameDetails = () => {
  const { id } = useParams();
  const { data: game, isPending } = useGetGameById(id || "");
  const { mutate: deleteGame } = useDeleteGame();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const handleDeletePost = () => {
    deleteGame({ gameId: id || "", imageId: game?.imageId });
    navigate("/");
  };

  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img src={game?.imageUrl} alt="game" className="post_details-img" />
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${game?.creator.$id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    game?.creator.imageUrl ||
                    "assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {game?.creator.name}
                  </p>
                  <div className="flex flex-start text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {multiFormatDateString(game?.$createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex-center">
                <Link
                  to={`/update-game/${game?.$id}`}
                  className={user.id !== game?.creator.$id ? "hidden" : ""}
                >
                  <img
                    src="/assets/icons/edit.svg"
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>
                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ghost_details-delete_btn ${
                    user.id !== game?.creator.$id ? "hidden" : ""
                  }`}
                >
                  <img
                    src="/assets/icons/delete.svg"
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="small-medium lg:base-medium py-2">
              <p>{game?.title}</p>
              <p className="text -light-3">{game?.description}</p>
            </div>

            <div className="w-full">
              <PostStats game={game} userId={user.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDetails;
