export default defineEventHandler(async (event) => {
    // パラメーターの取得
    const id = presentationId(event);
    // JWTの検証
    checkPermission(event, id);
    // 削除処理はトランザクションで行う
    await useDrizzle()
        .transaction(async (tx) => {
            await tx.delete(tables.slides).where(eq(tables.slides.presentation_id, id));
            await tx.delete(tables.presentations).where(eq(tables.presentations.presentation_id, id));
        })
        .catch(() => {
            throw createError({
                statusCode: 500,
                statusMessage: "Internal Server Error",
            });
        });
    // JWTの更新
    let permitted_ids = new Array<string>();
    const cookies = parseCookies(event);
    // すでに権限が付与されている場合は、そこに追加する
    if (cookies.jwt) {
        const decoded = verifyJwtToken(cookies.jwt);
        if (decoded?.permitted_ids) {
            decoded.permitted_ids.forEach((id) => permitted_ids.push(id));
        }
        if (!decoded) {
            // JWTが無効な場合はCookieを消して、401エラーを返す
            setCookie(event, "jwt", "", {
                maxAge: -1,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
            });
            throw createError({
                statusCode: 401,
                statusMessage: "Unauthorized",
            });
        }
    }
    // 配列からUUIDを削除
    permitted_ids = permitted_ids.filter((permitted_id) => permitted_id !== id);

    // 権限付与
    const expiresIn = 60 * 60 * 24 * 7; // 1 week
    const token = generateJwtToken({ permitted_ids: permitted_ids }, expiresIn);
    setCookie(event, "jwt", token, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    // return
    return {
        message: "success",
    };
});
