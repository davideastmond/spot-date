import { BaseRepository } from "./base-repository";

class UserPostsRepository extends BaseRepository {}
const userPostsRepository = new UserPostsRepository("userPosts");
export { userPostsRepository };
