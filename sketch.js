"use strict";

let matrix = [];
let messageWords = ["HAPPY", "BIRTHDAY", "TO", "YOU"];
let messageAlpha = 0;
let messageFadeIn = true;
let messageTimer = 0;
let messageIndex = 0;
let messageDone = false;
let birthdayGif;
let showGif = false;
let matrixFontSize;
let matrixSpacing;
let bgMusic;

function preload() {
  birthdayGif = loadImage('../DemoImages/happy.gif');
  bgMusic = loadSound('../HappyBirthdayToYou-AMEEHoangDungTheVoiceObito-7128048.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight, P2D);
  stroke(0, 255, 0);
  matrixFontSize = max(10, min(width, height) * 0.025);
  matrixSpacing = matrixFontSize * 1.15;
  textSize(matrixFontSize);
  fillMatrix();
  // Phát nhạc nền lặp lại
  if (bgMusic && !bgMusic.isPlaying()) {
    bgMusic.setLoop(true);
    bgMusic.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  matrixFontSize = max(10, min(width, height) * 0.025);
  matrixSpacing = matrixFontSize * 1.15;
  matrix = [];
  fillMatrix();
}

function draw() {
  background(0, 60)
  matrix.forEach((stream) => { stream.animate() });

  // Hiệu ứng chữ trắng lần lượt ở giữa màn hình
  if (!messageDone) {
    textAlign(CENTER, CENTER);
    textSize(min(width, height) * 0.18); // chữ lớn, tự động theo màn hình
    noStroke();
    fill(255, 255, 255, messageAlpha);
    text(messageWords[messageIndex], width / 2, height / 2);

    // Điều khiển hiệu ứng hiện dần/mất dần từng chữ
    if (messageFadeIn) {
      messageAlpha += 8; // nhanh hơn
      if (messageAlpha >= 255) {
        messageAlpha = 255;
        messageTimer++;
        if (messageTimer > 45) { // 0.75s ở 60fps
          messageFadeIn = false;
        }
      }
    } else {
      messageAlpha -= 8; // nhanh hơn
      if (messageAlpha <= 0) {
        messageAlpha = 0;
        messageFadeIn = true;
        messageTimer = 0;
        messageIndex++;
        if (messageIndex >= messageWords.length) {
          messageDone = true;
          showGif = true;
        }
      }
    }
  } else if (showGif) {
    // Hiển thị gif và lời chúc mừng sinh nhật
    imageMode(CENTER);
    let gifW = min(width * 0.8, 400);
    let gifH = gifW * (birthdayGif.height / birthdayGif.width);
    image(birthdayGif, width / 2, height / 2 - gifH / 2, gifW, gifH);
    textAlign(CENTER, CENTER);
    textSize(min(width, height) * 0.06);
    fill(255);
    text('Chúc mừng sinh nhật Bình! \nChúc bạn luôn vui vẻ, hạnh phúc và thành công!', width / 2, height / 2 + gifH / 2 + 40);
  }
}

function getMatrixColor(i, len) {
  // Gradient xanh-lam-tím
  let t = i / len;
  let r = lerp(0, 128, t); // tím dần
  let g = lerp(255, 0, t); // xanh lá sang tím
  let b = lerp(0, 255, t); // xanh lá sang lam
  return color(r, g, b, 255 - floor(255 / len) * i);
}

class Stream {
  constructor(_x, _y, _length, _speed) {
    this.x = _x;
    this.y = _y;
    this.length = _length;
    this.speed = _speed;
    this.stream = this.generateStream();
  }
  generateStream() {
    let stream = [];
    for (let i = 0; i < this.length; i++) stream.push(random(['0', '1']));
    return stream;
  }
  animate() {
    this.y += this.speed;
    for (let i = 0; i < this.stream.length; i++) {
      if (round(random(50)) === 1) this.stream[i] = random(['0', '1']);
      if (round(random(100)) === 1) this.speed = random(2, 8); // speed nhanh hơn
      if (this.y > height + 200) this.y = -10;
      let c = getMatrixColor(i, this.stream.length);
      if (i === 0) {
        fill(255, 255, 255); // ký tự đầu màu trắng nổi bật
        stroke(200, 255, 255);
      } else {
        fill(c);
        stroke(c);
      }
      textSize(matrixFontSize);
      text(this.stream[i], this.x, this.y + i * -matrixSpacing);
    }
  }
}

function fillMatrix() {
  matrix = [];
  for (let i = 0; i * matrixSpacing < width; i++) {
    matrix.push(new Stream(i * matrixSpacing, floor(random(-300, height + 150)), floor(random(5, 10)), floor(random(2, 8))));
    matrix.push(new Stream(i * matrixSpacing, floor(random(-300, height + 150)), floor(random(5, 15)), floor(random(2, 8))));
  }
}