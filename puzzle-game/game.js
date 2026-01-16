const container = document.getElementById('game-container');

let data = [];
let x = 3, y = 3; // 空白块坐标
const win = [
  [1,2,3,4],
  [5,6,7,8],
  [9,10,11,12],
  [13,14,15,0]
];

// 背景音乐
const bgm = new Audio('sounds/bgm.mp3');
bgm.loop = true;
bgm.volume = 0.5;
let musicOn = true;

bgm.play().catch(() => {
    console.log("需要用户点击页面才能播放背景音乐");
});

// 音乐开关
function toggleMusic() {
    musicOn = !musicOn;
    const btn = document.getElementById('sound-btn');
    btn.innerText = musicOn ? '🔊 音乐: 开' : '🔇 音乐: 关';
    if(musicOn){
        bgm.play();
    } else {
        bgm.pause();
    }
}

// 初始化游戏
function initGame() {
  let arr = [...Array(16).keys()];
  arr.sort(() => Math.random() - 0.5);
  data = [];
  for (let i = 0; i < 4; i++) {
    data[i] = [];
    for (let j = 0; j < 4; j++) {
      data[i][j] = arr[i * 4 + j];
      if (data[i][j] === 0) { x = i; y = j; }
    }
  }
  render();
}

// 渲染拼图
function render() {
  container.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (data[i][j] === 0) continue;

      const tile = document.createElement('img');
      tile.className = 'tile';
      tile.style.top = `${i*153}px`;
      tile.style.left = `${j*153}px`;

      // 设置图片路径
      tile.src = `images/${data[i][j]}.jpg`;

      // 容错机制：如果图片加载失败，显示红色块
      tile.onerror = () => {
          tile.style.backgroundColor = '#ff4d4d';
          tile.src = ''; // 清掉路径
      };

      container.appendChild(tile);
    }
  }

  // 胜利覆盖层
  if(checkVictory()){
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(255,255,255,0.7)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.fontSize = '32px';
    overlay.style.fontWeight = 'bold';
    overlay.style.color = '#ff5722';
    overlay.style.borderRadius = '12px';
    overlay.innerText = '🎉 完成啦！ 🎉';
    container.appendChild(overlay);
  }
}

// 判断胜利
function checkVictory(){
  for(let i=0;i<4;i++){
    for(let j=0;j<4;j++){
      if(data[i][j] !== win[i][j]) return false;
    }
  }
  return true;
}

// 显示完整图片
function showAll(){
  container.innerHTML = '';
  const all = document.createElement('img');
  all.src = 'images/all.jpg';
  all.style.position = 'absolute';
  all.style.top = '0';
  all.style.left = '0';
  all.style.width = '100%';
  all.style.height = '100%';
  all.style.borderRadius = '12px';
  container.appendChild(all);
}

// 键盘控制
document.addEventListener('keydown', (e) => {

  // W 键直接胜利
  if(e.key === 'w' || e.key === 'W'){
    data = [
      [1,2,3,4],
      [5,6,7,8],
      [9,10,11,12],
      [13,14,15,0]
    ];
    x = 3; y = 3;
    render();
    return;
  }

  if(checkVictory()) return;

  let moved = false;

  if(e.key === 'ArrowLeft' && y < 3){
    data[x][y] = data[x][y+1];
    data[x][y+1] = 0;
    y++;
    moved = true;
  } else if(e.key === 'ArrowRight' && y > 0){
    data[x][y] = data[x][y-1];
    data[x][y-1] = 0;
    y--;
    moved = true;
  } else if(e.key === 'ArrowUp' && x < 3){
    data[x][y] = data[x+1][y];
    data[x+1][y] = 0;
    x++;
    moved = true;
  } else if(e.key === 'ArrowDown' && x > 0){
    data[x][y] = data[x-1][y];
    data[x-1][y] = 0;
    x--;
    moved = true;
  }

  render();
});

// 页面初始化
initGame();

