import { JWTToken } from "../../domain/value-objects/JWTToken";
import { RefreshToken } from "../../domain/value-objects/RefreshToken";
import { UserID } from "../../domain/value-objects/UserId";

export interface ITokenService {
  generateAccessToken(
    userId: UserID,
    roles?: string[],
    permissions?: string[]
  ): Promise<JWTToken>;
  generateRefreshToken(userId: UserID): Promise<RefreshToken>;
}
