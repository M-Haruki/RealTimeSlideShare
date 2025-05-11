export default defineEventHandler(async (event) => {
    // パラメーターの取得
    const id = presentationId(event);
    // presentation情報を取得
    const presentations = await useDrizzle()
        .select({ current_page: tables.presentations.current_page, title: tables.presentations.title })
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
    // slide情報を取得(PDFのバイナリデータ)
    const slides = await useDrizzle()
        .select({ content: tables.slides.content })
        .from(tables.slides)
        .where(and(eq(tables.slides.presentation_id, id), eq(tables.slides.page, presentation.current_page)))
        .catch(() => {
            throw createError({
                statusCode: 500,
                statusMessage: "Internal Server Error",
            });
        });
    const slide = slides[0];
    if (!slide || !slide.content) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not Found",
        });
    }
    // return
    return new Response(Buffer.from(slide.content as ArrayBuffer), {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${encodeURIComponent(presentation.title)}-${
                presentation.current_page
            }.pdf"`,
        },
        status: 200,
    });
});
