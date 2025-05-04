import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    // パラメーターの取得
    const id = presentationId(event);
    // JWTの検証
    checkPermission(event, id);
    // 他のパラメーターの取得
    const page = Number(getQuery(event)["page"]);
    if (isNaN(page) || page < 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
        });
    }
    // presentation情報を取得
    const presentation = await prisma.presentations.findUnique({
        where: {
            presentation_id: id,
        },
        select: {
            total_page: true,
        },
    });
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
    await prisma.presentations
        .update({
            where: {
                presentation_id: id,
            },
            data: {
                current_page: page,
            },
        })
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
