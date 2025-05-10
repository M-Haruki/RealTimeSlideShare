import prisma from "~/server/lib/prisma";

export default defineEventHandler(async (event) => {
    // パラメーターの取得
    const id = presentationId(event);
    // presentation情報を取得
    const presentation = await prisma.presentations
        .findUnique({
            where: {
                presentation_id: id,
            },
        })
        .catch(() => {
            throw createError({
                statusCode: 500,
                statusMessage: "Internal Server Error",
            });
        });
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
