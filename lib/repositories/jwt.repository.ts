import { BaseRepository } from "./base-repository";

class JwtRepository extends BaseRepository {}
const jwtRepository = new JwtRepository("jwt");
export { jwtRepository };
