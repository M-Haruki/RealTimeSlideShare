import { verifyJwtToken } from "../utils/jwt";
import type { H3Event } from "h3";

export function checkPermission(event: H3Event, id: string): boolean {
    const cookies = parseCookies(event);
    if (!cookies.jwt) {
        // JWTがない場合は401エラーを返す
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    }
    // JWTの検証
    const decoded = verifyJwtToken(cookies.jwt);
    if (!decoded || !decoded.permitted_ids || !id) {
        // JWTが無効な場合は401エラーを返す
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    }
    if (!decoded.permitted_ids.includes(id)) {
        // JWTの中にIDが含まれていない場合は403エラーを返す
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden",
        });
    }
    return true;
}
