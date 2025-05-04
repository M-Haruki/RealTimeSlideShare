import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    // パラメーターの取得
    const id = presentationId(event);
    // presentation情報を取得
    const presentation = await prisma.presentations.findUnique({
        where: {
            presentation_id: id,
        },
        select: {
            current_page: true,
            title: true,
        },
    });
    if (!presentation) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not Found",
        });
    }
    // slide情報を取得(PDFのバイナリデータ)
    const slide = await prisma.slides.findFirst({
        where: {
            presentation_id: id,
            page: presentation.current_page,
        },
        select: {
            content: true,
        },
    });
    if (!slide || !slide.content) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not Found",
        });
    }
    // return
    return new Response(Buffer.from(slide.content), {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${presentation.title}-${presentation.current_page}.pdf"`,
        },
        status: 200,
    });
});
