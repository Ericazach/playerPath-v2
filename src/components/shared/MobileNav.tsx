import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { INavLink } from "@/types";
import { Link, NavLink, useLocation } from "react-router-dom";

const MobileNav = () => {
  const { pathname } = useLocation();

  const { user } = useUserContext();
  return (
    <section className="">
      <Sheet>
        <SheetTrigger asChild>
          <img
            src="/assets/icons/hamburger.svg"
            alt="hamburger"
            width={50}
            height={50}
            className="cursor-pointer lg:hidden"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-dark-2">
          <Link to="/" className="flex gap-3 items-center mb-32">
            <img
              src="/assets/images/logo.png"
              alt="logo"
              width={60}
              height={60}
            />
          </Link>
          <ul className="flex flex-col gap-6">
            {sidebarLinks.map((link: INavLink) => {
              const isActive = pathname === link.route;

              if (link.label === "Create Game" && user?.isAdmin === false) {
                return null;
              }

              return (
                <li
                  key={link.label}
                  className={`leftsidebar-link group ${
                    isActive ? "bg-primary-500" : ""
                  }`}
                >
                  <SheetClose asChild>
                    <NavLink
                      to={link.route}
                      className="flex gap-4 items-center p-4"
                    >
                      <img
                        src={link.imgURL}
                        alt={link.label}
                        className={`group-hover:invert-white ${
                          isActive ? "invert-white" : ""
                        }`}
                      />
                      {link.label}
                    </NavLink>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
