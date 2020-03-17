// 描画してる状態の判定、と初期位置の値
let drawing = false;
let before_x = 0;
let before_y = 0;

// 描画するための2Dコンテキスト取得
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


// イベント設定
// マウスが動いている時に関数draw_canvasを呼び出し
canvas.addEventListener('mousemove', draw_canvas);

// マウスがクリックされている時にdrawingをtrueに。trueだけでは、描画の際に前回mouseupした位置から描画がされてしまうするので、またmousedown（押下）した際にはマウスカーソルの現在地から描画できるように代入。
// >getBoundingClientRect()メソッドは、要素の寸法と、そのビューポートに対する位置。
// >MouseEvent.clientX は event の起きた点の、クライアント内での X 座標を参照できる読み取り専用の属性です。  (21-23でマウスイベントの位置をbefore_x,y(座標位置)に入れている)
canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  const rect = e.target.getBoundingClientRect();
  before_x = e.clientX - rect.left;
  before_y = e.clienty - rect.top;
});
// クリックをやめた際にはdrawingをfalseにして描画ができないように。
canvas.addEventListener('mouseup', () => {
  drawing = false;
});

// ここから描画するための関数draw_canvasを書いていく。　位置を取得するために関数draw_canvasには引数eを渡しておきます。
//まずはクリックされていないときはfalseを返す。

function draw_canvas(e) {

if (!drawing){
  return
};
// マウス位置取得
const rect = e.target.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;

// 線の設定
ctx.lineCap = 'round';
ctx.strokeStyle = document.getElementById('color').value;
ctx.lineWidth = document.getElementById('width').value;;
ctx.beginPath(); // パス初期化
ctx.moveTo(before_x, before_y); // moveto:指定の地点で新規のサブパスを生成します。
ctx.lineTo(x, y); // 現在のマウス位置。 lineto:現在のパスに指定した地点を加え、サブパスからを直線で繋ぎます。
ctx.stroke(); // stroke:現在のストローク・スタイルを使って、サブパスに線を引きます。
ctx.closePath(); // サブパスを閉じます。

// パスを閉じた後にはbefore_◯に終了した現在の位置を代入。
before_x = x;
before_y = y;
}

// 消しゴムツール (lobalCompositeOperationプロパティでは合成方法が指定できsource-overがデフォルト)
const pen = document.getElementById('pencil');
const era = document.getElementById('eraser');
function tool(btnNum){ 
  // クリックされたボタンが鉛筆だったら
  if (btnNum == 1){
    ctx.globalCompositeOperation = 'source-over'; }
    // クリックされたボタンが消しゴムだったら
  else if (btnNum == 2){
     ctx.globalCompositeOperation = 'destination-out'; 
    } 
}
// strokeの色変更
const color = document.getElementById('color').value; //追加
ctx.strokeStyle = color; //変更

// lineWidthの値をinputの値から取得して変更
const w = document.getElementById('width').value; //追加
ctx.lineWidth = w; //変更


//　クリアボタン
// clearRectメソッドは指定した範囲をクリアします。 指定方法は clearRect(x, y, w, h);
function delete_canvas() {
  ret = confirm('描いた内容を削除します。');
  // アラートで「OK」を選んだ時
  if (ret == true){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}


// Downloadボタン処理

const downloadLink = document.getElementById('download_link');
const filename = 'download.png';

window.onload = ()=> {

const button = document.getElementById('download_button');
  button.addEventListener('click', () =>{
      // IE/EDGE向けの処理 msToBlob:IE10以降やEDGEで使えるメソッド 
      if (canvas.msToBlob) {
          var blob = canvas.msToBlob();
          window.navigator.msSaveBlob(blob, filename);
      } else {
          // canvasからtoDataURL()を使って画像データを取得し、
          // リンクのhrefに画像データ、downloadプロパティにファイル名を設定。するとaタグのdownload属性にファイルが指定される。
          downloadLink.href = canvas.toDataURL('image/png');
          downloadLink.download = filename;
          downloadLink.click();
      }

  });
}