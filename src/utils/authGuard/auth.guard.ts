import { CanActivate, ExecutionContext, Injectable, UnauthorizedException,  } from "@nestjs/common";
import { jwtAuthService } from "../jwt/jwtAuthService.js";
import type { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly jwtAuthService: jwtAuthService) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);

        if(!token) {
            throw new UnauthorizedException("Token not provided !");
        }

        try {
            const payload = await this.jwtAuthService.verify(token);
            request['user'] = payload;
            
        }catch(error: any) {

            if(error.message === "jwt expired") {
                throw new UnauthorizedException("Token expired !");
            }

             if(error.message === "jwt malformed") {
                throw new UnauthorizedException("Token malformed or Invalid token !");
            }

            if(error.message === "invalid signature") {
                throw new UnauthorizedException("Invalid token !");
            }
            
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

}