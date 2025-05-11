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
    // return
    return {
        message: "success",
    };
});
