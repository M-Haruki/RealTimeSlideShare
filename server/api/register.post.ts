import { PDFDocument } from "pdf-lib";
import { randomUUID } from "crypto"; // importしなくても開発環境では動くが、production環境ではimportが必須

export default defineEventHandler(async (event) => {
    // パラメーターの取得
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
    const file_pdfDoc = await PDFDocument.load(file_buffer, {
        ignoreEncryption: true,
    }).catch(() => {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            data: { reason: "pdf_error" },
        });
    });

    // page_num
    if (file_pdfDoc.getPageCount() > 50) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            data: { reason: "page_num" },
        });
    }

    // 16字のUUIDを生成
    const uuid = randomUUID().replaceAll("-", "").slice(0, 16);
    // UUIDを生成する別の方法
    // const uuid = [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");

    // PDFを分割
    const pdfs: Buffer[] = [];
    for (let i = 0; i < file_pdfDoc.getPageCount(); i++) {
        const pdfDoc = await PDFDocument.create();
        const [copiedPage] = await pdfDoc.copyPages(file_pdfDoc, [i]);
        pdfDoc.addPage(copiedPage);
        const pdfBytes = await pdfDoc.save();
        pdfs.push(Buffer.from(pdfBytes));
        // pdfs.push(pdfBytes);
    }

    // pdfs -> pdf
    // pdfsの中身はUint8Array[]なので、Bufferに変換する必要がある
    // pdfs = pdfs.map((pdf) => Buffer.from(pdf));

    // DBに登録する(トランザクションを使用)
    await useDrizzle()
        .transaction(async (tx) => {
            await tx.insert(tables.presentations).values({
                presentation_id: uuid,
                title: title,
                total_page: file_pdfDoc.getPageCount(),
                current_page: 0, // 初期値を設定しているが、ないとエラーになるので、ここでも設定している
            });
            for (let i = 0; i < pdfs.length; i++) {
                // スライドの登録
                await tx.insert(tables.slides).values({
                    presentation_id: uuid,
                    page: i,
                    content: pdfs[i],
                });
            }
            await tx.insert(tables.log).values({
                ip: ipaddress(event),
                action: "create",
                presentation_id: uuid,
            });
        })
        .catch(() => {
            throw createError({
                statusCode: 500,
                statusMessage: "Internal Server Error",
            });
        });

    const permitted_ids = getPermittedIds(event);
    // すでに権限が付与されている場合は、そこに追加する
    permitted_ids.push(uuid);
    setPermissionCookie(permitted_ids, event);

    // return
    return {
        message: "OK",
        uuid: uuid,
    };
});
