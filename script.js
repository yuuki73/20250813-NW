const app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
    data: {
    // Vue内部で使いたい変数は全てこの中に定義する
    ID: '', //パラメーター「ID」格納変数
    Name: '', //パラメーター「Name」格納変数
    dataList: [], // データ表示用配列
    snackbar: false, // スナックバー表示フラグ（成功通知用）
    snackbarMessage: '', // スナックバーに表示するメッセージ
    dialog: false, // ダイアログ表示フラグ（セッション切れ通知用）
    dialogMessage: '' // ダイアログに表示するメッセージ 
  },
  methods: {
    // DBにデータを追加する関数
    addData: async function() {

      //IDの入力チェック（空白か数字以外なら終了）
      if(!this.ID || isNaN(this.ID)){
        console.log("IDに数値が入力されていません");
        return;
      }
      
      //POSTメソッドで送るパラメーターを作成
      const param = {
        ID : this.ID,
        Name : this.Name
      };
      
      //INSERT用のAPIを呼び出し
      const response = await axios.post('https://m3h-tsukagoshi-0730.azurewebsites.net/api/INSERT',param);
      
      //結果をコンソールに出力
      console.log(response.data);

    },
    // データベースからデータを取得する関数
    readData: async function() {
      //SELECT用のAPIを呼び出し      
      const response = await axios.get('https://m3h-tsukagoshi-0730.azurewebsites.net/api/SELECT');
      
      //結果をコンソールに出力
      console.log(response.data);
      
      //結果リストを表示用配列に代入
      this.dataList = response.data.List;
    },
      // Cookieから指定された名前の値を取得する関数
    getCookie: function(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
      return null;
    },

    // サーバーに対してセッションチェックAPIを呼び出す関数
    checkSession: async function() {
      // CookieからセッションIDを取得
      const sessionId = this.getCookie("session_id");

      // セッションIDが存在しない場合は即エラー表示
      if (!sessionId) {
        this.dialogMessage = "セッションが存在しません。";
        this.dialog = true;
        return;
      }

      try {
        // CheckSession APIを呼び出してセッションの状態を確認
        const response = await axios.post('https://m3h-tsukagoshi-0730.azurewebsites.net/api/CheckSession?', {
          SessionId: sessionId
        });

        // セッションが有効な場合はスナックバーで通知
        if (response.data.status === "Success") {
          this.snackbarMessage = `セッションは有効です。更新時刻: ${response.data.updatedAt}`;
          this.snackbar = true;
          console.log("セッションチェック成功:", response.data);
        } else {
          // セッションが無効な場合はダイアログで警告表示
          this.dialogMessage = response.data.message;
          this.dialog = true;
        }
      } catch (error) {
        // API呼び出し失敗時の処理（ネットワークエラーなど）
        console.error("セッションチェックエラー:", error);
        this.dialogMessage = "セッションの確認に失敗しました。";
        this.dialog = true;
      }
    },

    // ログイン画面にリダイレクトする関数（セッション切れ時など）
    redirectToLogin: function() {
      window.location.href = "index.html";
    }
  }
});