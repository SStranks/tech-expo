import { searchResults } from '@Data/MockData';

import SearchResult from './SearchResult';

// TODO:  Implement keyboard navigation - convert component/use 'cmdk'; pnpm add cmdk
function SearchResults(): JSX.Element {
  const searchResultsElements = searchResults.map((el, i) => (
    <SearchResult key={i} title={el.title} category={el.category} description={el.description} />
  ));
  return <div className="">{searchResultsElements}</div>;
}

export default SearchResults;
