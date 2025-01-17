import {ref} from 'vue';

class Slide {
    id: string;
    page: number;
    title: string;
    path=ref<string>("");
    constructor(id: string) {
        this.id = id;
        // axios{
        //     this.title = 
        //     this.page =
        // }
        this.checkPage();
    }
    reloadSlide() {
        this.path.value = `/api/${this.id}?${this.generateRandomHash(4)}`;
    }
    generateRandomHash(length: number) {
        return Math.random().toString(36).substring(2,length+2);
    }
    checkPage() {
        // axios{
        //     this.page = 
        // }
        if(true){
        this.reloadSlide();
    }
        // axios完了後に再起的に呼び出すことで、通信途中に連続してリクエストを送信することを防ぐ
        setTimeout(this.checkPage, 1000);
    }
}
