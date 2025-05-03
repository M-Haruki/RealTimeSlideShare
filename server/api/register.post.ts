import { PDFDocument } from "pdf-lib";

export default defineEventHandler(async (event) => {
    const title = getQuery(event)["title"]?.toString();
    const files = await readMultipartFormData(event);
    if (!files || files.length !== 1 || !title) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            data: { reason: "other" },
        });
    }
    const file = files[0];
    const file_buffer = Buffer.from(file.data);

    // エラーハンドリング
    // - 50MB以上のファイルは受け付けない(size)
    // - PDF以外のファイルは受け付けない(content_type)
    // - タイトルが32文字以上の場合は受け付けない(title_length)
    // - 50ページ以上のファイルは受け付けない(page_num)
    // - PDF処理のエラー(pdf_error)
    // size
    if (file_buffer.length > 1024 * 1024 * 50) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            data: { reason: "size" },
        });
    }
    // content_type
    if (file.type !== "application/pdf") {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            data: { reason: "content_type" },
        });
    }
    // title_length
    if (title.length > 32) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            data: { reason: "title_length" },
        });
    }

    // pdfの読み込み
    const pdfDoc = await PDFDocument.load(file_buffer, {
        ignoreEncryption: true,
    }).catch((err) => {
        console.log(err);
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            data: { reason: "pdf_error" },
        });
    });

    // page_num
    if (pdfDoc.getPageCount() > 50) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            data: { reason: "page_num" },
        });
    }

    // 16字のUUIDを生成
    const uuid = crypto.randomUUID().replaceAll("-", "").slice(0, 16);

    // PDFを保存する

    return {
        message: "OK",
        uuid: uuid,
    };
});
