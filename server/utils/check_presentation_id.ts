export function checkPresentationId(id: string) {
    // idが正しく構成されているかどうかをチェック
    if (!id || id.length !== 16 || id.match(/^[0-9a-fA-F]+$/) === null) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
        });
    }
    return true;
}
