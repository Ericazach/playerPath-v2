import { Link } from "react-router-dom";
// import { Button } from "../ui/button";
// import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import MobileNav from "./MobileNav";

const TopBar = () => {
  // const { mutate: signOut, isSuccess } = useSignOutAccount();
  // const navigate = useNavigate();
  const { user } = useUserContext();

  // useEffect(() => {
  //   if (isSuccess) {
  //     navigate(0);
  //   }
  // }, [isSuccess]);

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <div className="flex items-center">
          <Link to="/" className="flex gap-3 items-center">
            <img
              src="/assets/images/logoSm.png"
              alt="logo"
              width={70}
              height={70}
            />
          </Link>
          <p className="text-3xl font-Londrina tracking-wide">Player Path</p>
        </div>

        <div className="flex gap-4">
          {/* <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button> */}

          <Link to={`/profile/${user?.id}`} className="flex-center gap-3 ">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="w-8 h-8 rounded-full"
            />
          </Link>
          <MobileNav />
        </div>
      </div>
    </section>
  );
};

export default TopBar;
