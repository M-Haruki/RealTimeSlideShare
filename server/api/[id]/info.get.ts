export default defineEventHandler(async (event) => {
    // パラメーターの取得
    const id = presentationId(event);
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
        });
    }
    // presentation情報を取得
    const presentations = await useDrizzle()
        .select()
        .from(tables.presentations)
        .where(eq(tables.presentations.presentation_id, id))
        .catch(() => {
            throw createError({
                statusCode: 500,
                statusMessage: "Internal Server Error",
            });
        });
    const presentation = presentations[0];
    if (!presentation) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not Found",
        });
    }
    // return
    return {
        title: presentation.title,
        total_page: presentation.total_page,
        current_page: presentation.current_page,
    };
});
