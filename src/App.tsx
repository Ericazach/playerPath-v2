import { Routes, Route } from "react-router-dom";
import "./globals.css";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import AuthLayout from "./_auth/AuthLayout";
import {
  CreateGame,
  EditOwnGames,
  Explore,
  Home,
  OwnGames,
  OwnGamesDetails,
  Profile,
  UpdateProfile,
} from "./_routes/pages";
import RootLayout from "./_routes/RootLayout";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <main className="flex h-screen ">
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* PRIVATE ROUTES */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/ownGames" element={<OwnGames />} />
          <Route path="/update-ownGames/:id" element={<EditOwnGames />} />
          <Route path="/ownGames/:id" element={<OwnGamesDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
          <Route path="/create-game" element={<CreateGame />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
}

export default App;
