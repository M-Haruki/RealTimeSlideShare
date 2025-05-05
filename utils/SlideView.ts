type Timeout = NodeJS.Timeout; // Use this for Node.js

export class Slide {
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
    constructor(id: string, isRealtime: boolean = true) {
        this.id = id;
        this.path = `/api/${this.id}/slide`;
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
        if (isRealtime) {
            this.getInfo(true);
        }
    }
    delete(success: () => void) {
        $fetch(`/api/${this.id}/delete`, { method: "delete" })
            .then(() => {
                if (this.timeId) clearTimeout(this.timeId);
                success();
            })
            .catch(() => {
                alert("エラーが発生しました。");
            });
    }
    go(page: number) {
        if (page < 0 || this.total_page.value === null || page >= this.total_page.value) {
            alert("ページ数が不正です。");
            return;
        }
        $fetch(`/api/${this.id}/go?page=${page}`, { method: "patch" })
            .then((res) => {
                this.current_page.value = res.current_page;
                // this.reloadSlide();
            })
            .catch(() => {
                alert("エラーが発生しました。");
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
                    // this.reloadSlide();
                }
                if (re) {
                    // axios完了後に再起的に呼び出すことで、通信途中に連続してリクエストを送信することを防ぐ
                    if (this.timeId) clearTimeout(this.timeId); //念の為clearTimeout
                    this.timeId = setTimeout(() => this.getInfo(true), 5000); // 5秒ごと
                }
            })
            .catch(() => {
                alert("スライド情報の取得に失敗しました\nページをリロードしてください");
            });
    }
    // reloadSlide() {
    //     this.path.value = `/api/${this.id}/slide#${this.current_page.value}`;
    //     console.log(`reloadSlide: ${this.path.value}`);
    // }
}
