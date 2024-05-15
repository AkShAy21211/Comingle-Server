import jwt, { JwtPayload } from "jsonwebtoken";

class TokenManager {
   
    private _secret:string;

    constructor() {
        
       this._secret = process.env.JWT_SECRET || "";
    }

    createToken(id: string, role: string): string {
        try {
            const payload = { id, role };
            const token = jwt.sign(payload, this._secret, { expiresIn: "1d" });
            return token;
        } catch (error) {
            console.log('Unable to create token', error);
            throw error;
        }
    }


   
    verifyToken(token: string): JwtPayload | null {
        try {
            const decodedToken = jwt.verify(token, this._secret) as JwtPayload;
            return decodedToken;
        } catch (error) {
            console.error('Token verification failed:', error);
            return null; 
        }
    }
}

export default TokenManager;