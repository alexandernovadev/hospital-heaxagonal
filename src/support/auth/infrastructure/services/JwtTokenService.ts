import { ITokenService } from "../../application/ports/ITokenService";
import { JWTToken } from "../../domain/value-objects/JWTToken";
import { RefreshToken } from "../../domain/value-objects/RefreshToken";
import { UserID } from "../../domain/value-objects/UserId";

export class JwtTokenService implements ITokenService {
  async generateAccessToken(userId: UserID): Promise<JWTToken> {
    return JWTToken.create(userId.getValue());
  }

  async generateRefreshToken(userId: UserID): Promise<RefreshToken> {
    return RefreshToken.create(userId.getValue());
  }
}
