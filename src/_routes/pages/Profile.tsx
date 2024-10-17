import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
// import LikedGames from "./LikedGames";
// import GridGameList from "@/components/shared/GridGameList";
import GridOwnGameList from "@/components/shared/GridOwnGamesList";
import LikedGames from "./LikedGames";

const Profile = () => {
  const { user } = useUserContext();
  const { data: currentUser } = useGetCurrentUser();
  const { pathname } = useLocation();

  console.log(user);
  console.log(currentUser);

  if (!currentUser) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser?.imageUrl || "assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>
          </div>
        </div>
        <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
          {currentUser.bio}
        </p>
        <div className="flex justify-center gap-4">
          <div className={`${user.id !== currentUser.$id && "hidden"}`}>
            <Link
              to={`/update-profile/${currentUser.$id}`}
              className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                user.id !== currentUser.$id && "hidden"
              }`}
            >
              <img
                src={"/assets/icons/edit.svg"}
                alt="edit"
                width={20}
                height={20}
              />
              <p className="flex whitespace-nowrap small-medium">
                Edit Profile
              </p>
            </Link>
          </div>
        </div>
      </div>

      {currentUser.$id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${user.id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${user.id}` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Saved Games
          </Link>
          <Link
            to={`/profile/${user.id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${user.id}/liked-posts` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Games
          </Link>
        </div>
      )}
      <Routes>
        <Route
          index
          element={
            <GridOwnGameList
              games={currentUser.ownGame}
              showUser={true}
              showStats={false}
            />
          }
        />
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedGames />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
