import { checkPresentationId } from "~/server/utils/check_presentation_id";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    // パラメーターの取得
    const id = getRouterParam(event, "id") as string;
    checkPresentationId(id);
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
