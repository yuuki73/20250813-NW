const app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    ID: '',
    Name: '',
    dataList: [],
    snackbar: false,     
    snackbarMessage: '',   
    dialog: false,       
    dialogMessage: '' 
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
      const response = await axios.post('https://m3h-tsukagoshi-0730.azurewebsites.net/api/INSERT?',param);
      
      //結果をコンソールに出力
      console.log(response.data);

    },
    // データベースからデータを取得する関数
    readData: async function() {
      //SELECT用のAPIを呼び出し      
      const response = await axios.get('https://m3h-tsukagoshi-0730.azurewebsites.net/api/SELECT?');
      
      //結果をコンソールに出力
      console.log(response.data);
      
      //結果リストを表示用配列に代入
      this.dataList = response.data.List;
    },
  },
});