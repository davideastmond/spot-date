import { algoliasearch } from "algoliasearch";
import { ALGOLIA_INDEXES } from "../definitions/algolia/algolia-indexes";
import type { SecureThirdPartyUser, User } from "../models/user";
import type { UserPost } from "../models/user-post";

const algoliaClient = algoliasearch(
  process.env.ANGOLIA_APP_ID as string,
  process.env.ALGOLIA_API_KEY as string
);

export const SearchController = {
  searchUsers: async (query: string): Promise<SecureThirdPartyUser[]> => {
    // Following the example from the Algolia documentation
    const response =
      await algoliaClient.searchSingleIndex<SecureThirdPartyUser>({
        indexName: ALGOLIA_INDEXES.users,
        searchParams: { query: query },
      });
    return response.hits as SecureThirdPartyUser[];
  },
  searchUserPosts: async (query: string): Promise<UserPost[]> => {
    const response = await algoliaClient.searchSingleIndex<UserPost>({
      indexName: ALGOLIA_INDEXES.userPosts,
      searchParams: { query: query },
    });
    return response.hits;
  },
  indexPost: async (userPost: UserPost) => {
    const data = await algoliaClient.saveObject({
      indexName: ALGOLIA_INDEXES.userPosts,
      body: userPost,
    });

    console.info("post was indexed", data.objectID);
  },
  indexUser: async (user: Partial<User>) => {
    const data = await algoliaClient.saveObject({
      indexName: ALGOLIA_INDEXES.users,
      body: {
        nickname: user.nickname,
        userId: user.id,
        image: user.image,
        name: user.name,
      },
    });

    console.info("user was indexed", data.objectID);
  },
  updateNickname: async (userId: string, nickname: string) => {
    const response = await SearchController.searchUsers(userId);
    if (response.length === 0) return;

    const objectID = response[0].objectID;
    await algoliaClient.partialUpdateObject({
      indexName: ALGOLIA_INDEXES.users,
      objectID,
      attributesToUpdate: { nickname },
    });
  },
};
