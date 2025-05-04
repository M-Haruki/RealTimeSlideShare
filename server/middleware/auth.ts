export default defineEventHandler(async (event) => {
    // controlページ以外はスルー
    if (!event.node.req.url?.match(/\/[0-9a-zA-Z]+\/control/)) {
        return;
    }
    // パラメーターの取得
    const id = event.node.req.url?.match(/[0-9a-zA-Z]+/g)?.[0];
    console.log(id);
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
        });
    }
    // JWTの検証
    checkPermission(event, id);
});
