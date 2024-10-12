import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret_key";

interface DecodedToken extends JwtPayload {
  userId: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "AREA_MANAGER";
  locationId?: string;
}

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Unauthorized: Token expired" });
      }
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    const decoded = decodedToken as DecodedToken;

    if (decoded) {
      req.user = {
        userId: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        locationId: decoded.locationId,
      };
    } else {
      return res.status(403).json({ message: "Forbidden: Token malformed" });
    }

    next();
  });
};