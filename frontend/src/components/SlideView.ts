import { ref, watch } from 'vue'
import axios from 'axios'
import router from '@/router'

class Slide {
  id: string
  isGo = ref({
    prev: false,
    next: false,
  })
  total_page = ref<number>(0)
  current_page = ref<number>(0)
  title = ref<string>('')
  path = ref<string>('')
  timeId: number = 0
  constructor(id: string, isRealtime: boolean = true) {
    // isRealtime: 定期的なページ情報の取得を行うかどうか
    this.id = id
    this.reloadSlide()
    if (isRealtime) {
      this.checkPage(true)
    }
    watch(
      [this.current_page, this.total_page],
      () => {
        this.checkGo()
      },
      { immediate: true, deep: true },
    )
    router.afterEach(() => {
      clearTimeout(this.timeId)
    })
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
      url: `http://localhost:8000/${this.id}/current_page`,
    })
      .then((response) => {
        if (this.current_page.value !== Number(response.data)) {
          this.current_page.value = Number(response.data)
          this.reloadSlide()
        }
        // axios完了後に再起的に呼び出すことで、通信途中に連続してリクエストを送信することを防ぐ
        clearTimeout(this.timeId) //念の為clearTimeout
        this.timeId = setTimeout(() => this.checkPage(true), 5000)
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
        clearTimeout(this.timeId)
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
  checkGo() {
    if (this.current_page.value + 1 < 0 || this.current_page.value + 1 >= this.total_page.value) {
      this.isGo.value.next = false
    } else {
      this.isGo.value.next = true
    }
    if (this.current_page.value - 1 < 0 || this.current_page.value - 1 >= this.total_page.value) {
      this.isGo.value.prev = false
    } else {
      this.isGo.value.prev = true
    }
  }
}

function renderPdf(path: string, canvasId: string) {
  // index.htmlよりpdfjs-distを読み込む
  const pdfPath = path

  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs-dist/build/pdf.worker.mjs'

  // 非同期でPDFファイルを読み込み
  const loadingTask = pdfjsLib.getDocument(pdfPath)
  ;(async () => {
    const pdf = await loadingTask.promise

    // 最初のページを取得
    const page = await pdf.getPage(1)
    const scale = 2 // スケールを上げると解像度が上がる
    const viewport = page.getViewport({ scale })

    // 高DPIをサポート
    const outputScale = window.devicePixelRatio || 1

    // PDFのページ寸法を使用してキャンバスを準備
    const canvas = document.getElementById(canvasId)
    const context = canvas.getContext('2d')

    canvas.width = Math.floor(viewport.width * outputScale)
    canvas.height = Math.floor(viewport.height * outputScale)
    canvas.style.width = Math.floor(viewport.width) + 'px'
    canvas.style.height = Math.floor(viewport.height) + 'px'

    const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null

    // PDFのページをキャンバスにレンダリング
    const renderContext = {
      canvasContext: context,
      transform,
      viewport,
    }
    page.render(renderContext)
  })()
}

export { Slide, renderPdf }
