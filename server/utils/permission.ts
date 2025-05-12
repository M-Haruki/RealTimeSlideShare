import type { H3Event } from "h3";

export function presentationId(event: H3Event): string | null {
    // idが正しく構成されているかどうかをチェック
    const id = getRouterParam(event, "id") as string;
    if (!id || id.length !== 16 || id.match(/^[0-9a-fA-F]+$/) === null) {
        return null;
    }
    return id;
}

export function getPermittedIds(event: H3Event): string[] {
    // CookieからJWTを取得
    const cookies = parseCookies(event);
    if (!cookies.jwt) {
        return [];
    }
    // JWTの検証
    const decoded = verifyJwtToken(cookies.jwt);
    if (!decoded || !decoded.permitted_ids) {
        // JWTが不正->Cookieを消す
        deletePermissionCookie(event);
        return [];
    }
    return decoded.permitted_ids;
}

export function checkPermission(event: H3Event, id: string, error: () => void): void {
    // JWTを検証し、対象のIDが含まれているかどうかをチェック
    const permitted_ids = getPermittedIds(event);
    if (!permitted_ids.includes(id)) {
        // JWTの中にIDが含まれていない場合は403エラーを返す
        error();
        return;
    }
    return;
}

export function setPermissionCookie(permitted_ids: string[], event: H3Event): void {
    // JWTを生成し、Cookieに保存
    const expiresIn = Number(process.env.DELETE_PERIOD_SECONDS);
    const token = generateJwtToken({ permitted_ids: permitted_ids }, expiresIn);
    setCookie(event, "jwt", token, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    return;
}

export function deletePermissionCookie(event: H3Event): void {
    // Cookieを削除
    setCookie(event, "jwt", "", {
        maxAge: -1,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    return;
}
