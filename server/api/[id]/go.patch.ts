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
    // 他のパラメーターの取得
    const page = Number(getQuery(event)["page"]);
    if (isNaN(page) || page < 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
        });
    }
    // presentation情報を取得
    const presentations = await useDrizzle()
        .select({ total_page: tables.presentations.total_page })
        .from(tables.presentations)
        .where(eq(tables.presentations.presentation_id, id));
    const presentation = presentations[0];
    if (!presentation) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not Found",
        });
    }
    // pageの範囲チェック
    if (page >= presentation.total_page) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
        });
    }
    // 現在のページを更新
    await useDrizzle()
        .update(tables.presentations)
        .set({ current_page: page })
        .where(eq(tables.presentations.presentation_id, id))
        .catch(() => {
            throw createError({
                statusCode: 500,
                statusMessage: "Internal Server Error",
            });
        });
    // return
    return {
        current_page: page,
    };
});
