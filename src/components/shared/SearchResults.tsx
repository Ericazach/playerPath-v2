import { Models } from "appwrite";
import Loader from "./Loader";
import GridGameList from "./GridGameList";

type SearchResultsProps = {
  isSearchFetching: boolean;
  searchedGames: Models.Document[];
};

const SearchResults = ({
  isSearchFetching,
  searchedGames,
}: SearchResultsProps) => {
  if (isSearchFetching) return <Loader />;

  if (searchedGames && searchedGames.documents.length > 0) {
    return <GridGameList games={searchedGames.documents} />;
  }
  return (
    <p className="text-center text-light-4 mt-10 w-full">No results found</p>
  );
};

export default SearchResults;
