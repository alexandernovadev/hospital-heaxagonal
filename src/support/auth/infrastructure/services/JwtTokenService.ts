import { ITokenService } from "../../application/ports/ITokenService";
import { JWTToken } from "../../domain/value-objects/JWTToken";
import { RefreshToken } from "../../domain/value-objects/RefreshToken";
import { UserID } from "../../domain/value-objects/UserId";
import jwt from "jsonwebtoken";

// ⚙️ Comentario: Claves secretas de ejemplo. En un entorno real, deberían venir de variables de entorno.
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "supersecretrefreshkey";

export class JwtTokenService implements ITokenService {
  async generateAccessToken(
    userId: UserID,
    roles?: string[],
    permissions?: string[]
  ): Promise<JWTToken> {
    const payload = {
      userId: userId.getValue(),
      roles: roles || [],
      permissions: permissions || [],
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    return JWTToken.create(token);
  }

  async generateRefreshToken(userId: UserID): Promise<RefreshToken> {
    const payload = {
      userId: userId.getValue(),
    };
    const token = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
    return RefreshToken.create(token);
  }
}
