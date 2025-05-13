type Timeout = NodeJS.Timeout; // Use this for Node.js

export class Presentation {
    id: string;
    path: string;
    isGo = ref({
        prev: false,
        next: false,
    });
    total_page = ref<number | null>(null);
    current_page = ref<number | null>(null);
    title = ref<string | null>(null);
    timeId: Timeout | null = null;
    $i18n: any;
    constructor(id: string, $i18n: any, isRealtime: boolean = true) {
        this.id = id;
        this.$i18n = $i18n;
        this.path = `${useRuntimeConfig().app.baseURL}api/${this.id}/slide`;
        // isGo変数を同期させる
        watch(
            [this.current_page, this.total_page],
            () => {
                this.checkIsGo();
            },
            { immediate: true, deep: true }
        );
        // ルートを離れるときにタイマーをクリア
        onBeforeRouteLeave(() => {
            if (this.timeId) clearTimeout(this.timeId);
        });
        // データの取得(&以降自動で更新)
        this.getInfo(isRealtime);
    }
    delete(success: () => void) {
        $fetch(`/api/${this.id}/delete`, { method: "delete" })
            .then(() => {
                if (this.timeId) clearTimeout(this.timeId);
                success();
            })
            .catch(() => {
                alert(this.$i18n.t("error_alert"));
            });
    }
    go(page: number) {
        if (page < 0 || this.total_page.value === null || page >= this.total_page.value) {
            alert(this.$i18n.t("slide_error_alert_page"));
            return;
        }
        $fetch(`/api/${this.id}/go?page=${page}`, { method: "patch" })
            .then((res) => {
                this.current_page.value = res.current_page;
            })
            .catch(() => {
                alert(this.$i18n.t("error_alert"));
            });
    }
    checkIsGo() {
        if (this.current_page.value !== null && this.total_page.value !== null) {
            if (this.current_page.value + 1 < 0 || this.current_page.value + 1 >= this.total_page.value) {
                this.isGo.value.next = false;
            } else {
                this.isGo.value.next = true;
            }
            if (this.current_page.value - 1 < 0 || this.current_page.value - 1 >= this.total_page.value) {
                this.isGo.value.prev = false;
            } else {
                this.isGo.value.prev = true;
            }
        }
    }
    getInfo(re: boolean = false) {
        // re: 再起呼び出しフラグ
        $fetch(`/api/${this.id}/info`, { method: "get" })
            .then((response) => {
                this.title.value = response.title;
                this.total_page.value = response.total_page;
                if (this.current_page.value !== response.current_page) {
                    this.current_page.value = response.current_page;
                }
                if (re) {
                    // axios完了後に再起的に呼び出すことで、通信途中に連続してリクエストを送信することを防ぐ
                    if (this.timeId) clearTimeout(this.timeId); //念の為clearTimeout
                    this.timeId = setTimeout(() => this.getInfo(true), 5000); // 5秒ごと
                }
            })
            .catch((e) => {
                if (e.status === 404) {
                    alert(this.$i18n.t("slide_error_alert_not_found"));
                    navigateTo("/");
                } else {
                    alert(this.$i18n.t("slide_error_alert_failed"));
                }
            });
    }
}

export function pdfviewerStyling(pdfviewer: HTMLIFrameElement): void {
    const iframeWindow = pdfviewer.contentWindow;
    if (iframeWindow) {
        const toolbar = iframeWindow.document.getElementsByClassName("toolbar")[0] as HTMLDivElement;
        const viewerContainer = iframeWindow.document.getElementById("viewerContainer") as HTMLDivElement;
        if (toolbar) {
            toolbar.style.display = "none";
        }
        if (viewerContainer) {
            viewerContainer.style.inset = "0px";
        }
    }
}
