export default defineI18nLocale(async () => ({
    catchphrase: "プレゼンをシームレスに",
    shortDescription:
        "PDFをアップロードしてリアルタイムにプレゼンを共有。スライドをめくると、聴衆の画面も瞬時に同期して同じ内容が表示されます。",
    desc1_title: "プレゼンをもっとスマートに",
    desc1_text:
        "大きなモニターはもう不要。PDFをアップロードしてURLを共有するだけで、どこでもすぐにスライドショーを開始できます。",
    desc2_title: "リアルタイム同期",
    desc2_text:
        "あなたがスライドをめくると、聴衆の画面も同時に切り替わります。通常、各端末は数秒以内に同期完了します。",
    desc3_title: "発表者のペースで",
    desc3_text:
        "聴衆が先のスライドに飛ぶ心配はありません。あなたの話すテンポに合わせて、確実に画面を切り替えられます。",
    desc4_title: "資料は発表者がコントロール",
    desc4_text:
        "スライドはあなたの好きなタイミングで削除できます。明示的に削除をしない場合は、アップロードから24時間以上経過後に自動で削除されます。聴衆はあなたの許可なしに資料をダウンロードしたり持ち帰ったりすることはできません。（技術的に不可能ではない点にはご留意ください。）",
    createButton: "プレゼンテーションを作成",
    desc_caution: "本サービスはベータ版です。予告なく変更・終了する可能性があります。",
    register_h: "新規プレゼンテーションを作成",
    register_title: "タイトル",
    register_title_detail: "最大32文字",
    register_pdf: "PDFファイル",
    register_pdf_detail: "合計最大50MB、50ページ以内、1ページあたり最大1MB",
    register_button: "アップロードして作成",
    register_button_processing: "アップロード中...",
    register_success_alert: "プレゼンテーションを作成しました",
    register_alert_input: "タイトルとファイルを入力してください",
    register_error_alert_size: "ファイルのサイズが50MB以上です",
    register_error_alert_content_type: "PDF以外のファイルは受け付けられません",
    register_error_alert_title_length: "タイトルが32字を超えています",
    register_error_alert_page_num: "ページ数が50ページを超えています",
    register_error_alert_pdf_error: "PDF処理エラーです",
    view_delete: "削除",
    view_delete_alert: "本当に削除しますか?",
    view_share: "共有",
    view_share_link_alert: "リンクをコピーしました",
    view_share_link_alert_error: "リンクのコピー及び共有に対応していません",
    view_close: "閉じる",
    error_alert: "エラーが発生しました",
    slide_error_alert_page: "ページ数が不正です。",
    slide_error_alert_not_found: "プレゼンテーションが見つかりません。",
    slide_error_alert_failed: "プレゼン情報の取得に失敗しました\nページをリロードしてください",
}));
