export class Slide {
    id: string;
    isGo = ref({
        prev: false,
        next: false,
    });
    total_page = ref<number>(0);
    current_page = ref<number>(0);
    title = ref<string>("");
    // path = ref<string>("");
    // timeId: number = 0;
    constructor(id: string, isRealtime: boolean = true) {
        this.id = id;
        // isGo変数を同期させる
        watch(
            [this.current_page, this.total_page],
            () => {
                this.checkGo();
            },
            { immediate: true, deep: true }
        );
        // データの取得
        $fetch(`/api/${this.id}/info`, { method: "get" })
            .then((response) => {
                this.title.value = response.title;
                this.total_page.value = response.total_page;
                this.current_page.value = response.current_page;
            })
            .catch(() => {
                alert("スライド情報の取得に失敗しました");
            });
    }
    delete(success: () => void) {
        $fetch(`/api/${this.id}/delete`, { method: "delete" })
            .then(() => {
                // clearTimeout(this.timeId);
                success();
            })
            .catch(() => {
                alert("エラーが発生しました。");
            });
    }
    go(page: number) {
        if (page < 0 || page >= this.total_page.value) {
            alert("ページ数が不正です。");
            return;
        }
        $fetch(`/api/${this.id}/go?page=${page}`, { method: "patch" })
            .then((res) => {
                this.current_page.value = res.current_page;
            })
            .catch(() => {
                alert("エラーが発生しました。");
            });
    }
    checkGo() {
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
