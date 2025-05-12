export default defineEventHandler(async (event) => {
    // パラメーターの取得
    const id = presentationId(event);
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
        });
    }
    // JWTの検証
    checkPermission(event, id, () => {
        throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    });
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

    let permitted_ids = getPermittedIds(event);
    // 配列からUUIDを削除
    permitted_ids = permitted_ids.filter((permitted_id) => permitted_id !== id);
    setPermissionCookie(permitted_ids, event);

    // return
    return {
        message: "success",
    };
});
