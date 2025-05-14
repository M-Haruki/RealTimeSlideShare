import type { H3Event } from "h3";

export function ipaddress(event: H3Event) {
    // X-Forwarded-Forヘッダー（プロキシやロードバランサ経由の場合）
    const xff = event.node.req.headers["x-forwarded-for"];
    // ソケットから直接取得
    const remoteAddress = event.node.req.socket?.remoteAddress;

    // X-Forwarded-Forがあれば最初の値を使う
    const ip = xff ? (Array.isArray(xff) ? xff[0] : xff.split(",")[0].trim()) : remoteAddress;

    return ip;
}
