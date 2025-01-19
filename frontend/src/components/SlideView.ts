import { ref } from 'vue'
import axios from 'axios'

class Slide {
  id: string

  total_page = ref<number>(0)
  current_page = ref<number>(0)
  title = ref<string>('')
  path = ref<string>('')
  constructor(id: string) {
    this.id = id

    this.reloadSlide()
    this.checkPage(true)
    axios({
      method: 'get',
      url: `http://localhost:8000/${this.id}/info`,
    })
      .then((response) => {
        this.title.value = response.data.title
        this.total_page.value = response.data.total_page
        this.current_page.value = response.data.current_page
      })
      .catch((error) => {
        alert('スライド情報の取得に失敗しました')
      })
  }
  reloadSlide() {
    this.path.value = `http://localhost:8000/${this.id}/slide?${this.generateRandomHash(4)}`
  }
  generateRandomHash(length: number) {
    return Math.random()
      .toString(36)
      .substring(2, length + 2)
  }
  checkPage(re: boolean = false) {
    // re: 再起呼び出しフラグ
    axios({
      method: 'get',
      url: `http://localhost:8000/${this.id}/info`,
    })
      .then((response) => {
        if (this.current_page.value !== response.data.current_page) {
          this.current_page.value = response.data.current_page
          this.reloadSlide()
        }
        // axios完了後に再起的に呼び出すことで、通信途中に連続してリクエストを送信することを防ぐ
        setTimeout(() => this.checkPage(true), 5000)
      })
      .catch((error) => {
        alert('スライド情報の取得に失敗しました\nページをリロードしてください')
      })
  }
  delete(success: () => void) {
    axios({
      method: 'delete',
      url: `http://localhost:8000/${this.id}/delete`,
      withCredentials: true,
    })
      .then(() => {
        success()
      })
      .catch(() => {
        alert('エラーが発生しました。')
      })
  }
  go(num: number) {
    if (
      this.current_page.value + num < 0 ||
      this.current_page.value + num >= this.total_page.value
    ) {
      return
    }
    axios({
      method: 'post',
      url: `http://localhost:8000/${this.id}/go?num=${num}`,
      withCredentials: true,
    })
      .then((res) => {
        this.current_page.value = res.data.current_page
        this.reloadSlide()
      })
      .catch(() => {
        alert('エラーが発生しました。')
      })
  }
}

export default Slide
