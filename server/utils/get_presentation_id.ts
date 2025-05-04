import type { H3Event } from "h3";
export function presentationId(event: H3Event): string {
    // idが正しく構成されているかどうかをチェック
    const id = getRouterParam(event, "id") as string;
    console.log(id);
    if (!id || id.length !== 16 || id.match(/^[0-9a-fA-F]+$/) === null) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
        });
    }
    return id;
}
