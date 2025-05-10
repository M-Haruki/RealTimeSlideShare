import prisma from "~/server/lib/prisma";

export default defineEventHandler(async (event) => {
    // パラメーターの取得
    const id = presentationId(event);
    // JWTの検証
    checkPermission(event, id);
    // 削除処理はトランザクションで行う
    await prisma
        .$transaction(async (tx) => {
            await tx.slides.deleteMany({
                where: {
                    presentation_id: id,
                },
            });
            await tx.presentations.delete({
                where: {
                    presentation_id: id,
                },
            });
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
