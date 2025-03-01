import { algoliasearch } from "algoliasearch";
import { ALGOLIA_INDEXES } from "../definitions/algolia/algolia-indexes";
import type { SecureThirdPartyUser } from "../models/user";

export const SearchController = {
  searchUsers: async (query: string): Promise<SecureThirdPartyUser[]> => {
    // Following the example from the Algolia documentation
    const algoliaClient = algoliasearch(
      process.env.ANGOLIA_APP_ID as string,
      process.env.ALGOLIA_API_KEY as string
    );

    const response =
      await algoliaClient.searchSingleIndex<SecureThirdPartyUser>({
        indexName: ALGOLIA_INDEXES.users,
        searchParams: { query: query },
      });
    return response.hits as SecureThirdPartyUser[];
  },
};
