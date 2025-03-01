import { BaseRepository } from "./base-repository";

class UserRepository extends BaseRepository {}
const userRepository = new UserRepository("users");
export { userRepository };
