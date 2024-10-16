import EditPost from "@/components/forms/EditPost";
import Loader from "@/components/shared/Loader";
import { useOwnGameById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";

const EditOwnGame = () => {
  const { id } = useParams();
  const { data: game, isPending } = useOwnGameById(id || "");

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            alt="add"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Game</h2>
        </div>
        <EditPost game={game} />
      </div>
    </div>
  );
};

export default EditOwnGame;
