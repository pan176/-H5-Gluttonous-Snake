var nowDirection = "right";
var nextDirection = "right";

var score = 0;

var focusInterval = null;
var moveInterval = null;

// 模糊效果
function blur() {
  if ($(".start").is(":visible")) {
    $("#screen").addClass("blur");
  }
  else {
    $("#screen").removeClass("blur");
  }
}

// 开始游戏
function start() {
  $(".start").hide();
  blur();
  $(".stop").show();
  var screen = document.getElementById("screen");

  // 对焦
  screen.focus();

  // 监听键盘
  screen.onkeydown = function (e) {
    alterDirection(e);
  };

  focusInterval = window.setInterval("screenFocus()", 10);
  moveInterval = window.setInterval("move()", 100);
}

// 暂停游戏
function stop() {
  if (focusInterval != null) {
    window.clearInterval(focusInterval);
  }
  if (moveInterval != null) {
    window.clearInterval(moveInterval);
  }

  $(".start").show();
  blur();
  $(".stop").hide();
}

// 监听键盘，修改移动方向
function alterDirection(e) {
  e = e || window.event;

  // 左 - 37
  if (e.keyCode == 37 && nowDirection != "right") {
    nextDirection = "left";
  }

  // 上 - 38
  else if (e.keyCode == 38 && nowDirection != "down") {
    nextDirection = "up";
  }

  // 右 - 39
  else if (e.keyCode == 39 && nowDirection != "left") {
    nextDirection = "right";
  }

  // 下 - 40
  else if (e.keyCode == 40 && nowDirection != "up") {
    nextDirection = "down";
  }

  // console.log("当前方向：" + nowDirection + " 移动方向：" + nextDirection);
}

// 屏幕对焦
function screenFocus() {
  document.getElementById("screen").focus();
}

var size = 40;

// 获取浏览器的宽高
var windowHeight = Math.round($(window).height() / size) * size;
var windowWidth = Math.round($(window).width() / size) * size;
// console.log(" height:" + windowHeight + " width:" + windowWidth);

// 移动
function move() {
  // 确定蛇头位置
  var snakeList = document.getElementsByName("snake");
  var head = snakeList.item(0);
  var headLeft = head.style.left;
  var headTop = head.style.top;

  // 根据下一个方向，移动蛇头
  nowDirection = nextDirection;
  if (nextDirection == "left") {
    // 间距必须保证是整数
    head.style.left = (parseInt(headLeft) - size + windowWidth) % windowWidth + "px";
  } else if (nextDirection == "right") {
    head.style.left = (parseInt(headLeft) + size) % windowWidth + "px";
  } else if (nextDirection == "up") {
    head.style.top = (parseInt(headTop) - size + windowHeight) % windowHeight + "px";
  } else if (nextDirection == "down") {
    head.style.top = (parseInt(headTop) + size) % windowHeight + "px";
  }

  // 移动蛇身
  for (var i = 1; i < snakeList.length; i++) {
    // 保存当前蛇身的位置
    var bodyLeft = snakeList.item(i).style.left;
    var bodyTop = snakeList.item(i).style.top;

    // 移动当前蛇身到蛇头位置
    snakeList.item(i).style.left = headLeft;
    snakeList.item(i).style.top = headTop;

    headLeft = bodyLeft;
    headTop = bodyTop;
  }

  // 判断是否碰到自己
  if (IsTouch()) {
    gameover();
  }

  // 判断是否吃到食物
  if (checkFood()) {
    // 增加长度
    var screen = document.getElementById("screen");
    var body = snakeList.item(snakeList.length - 1).cloneNode(true);

    // 在最后一个节点的位置添加身体
    body.style.top = headTop;
    body.style.left = headLeft;

    screen.appendChild(body);
  }

}

// 判断是否吃到食物
function checkFood() {
  var food = document.getElementById("food");

  // .style 无法获取 css里的样式
  // console.log("head.top：" + head.style.top + " head.left：" + head.style.left);
  // console.log("food.top：" + $("#food").css("top") + " food.left：" + $("#food").css("left"));

  if (head.style.top == $("#food").css("top") && head.style.left == $("#food").css("left")) {
    // 移动食物的位置
    food.style.left = parseInt(Math.random() * 13) * size + "px";
    food.style.top = parseInt(Math.random() * 13) * size + "px";
    // console.log(food.style.left + " " + food.style.top);

    // 判断是否和蛇的位置重叠
    if (IsOverlap()) {
      // 移动食物的位置
      food.style.left = parseInt(Math.random() * 13) * size + "px";
      food.style.top = parseInt(Math.random() * 13) * size + "px";
    }

    // 加分数
    score++;
    return true;
  }
  return false;
}

function IsOverlap() {
  // 获得蛇的位置
  var snakeList = document.getElementsByName("snake");

  for (var i = 0; i < snakeList.length; i++) {
    if (snakeList.item(i).style.top == $("#food").css("top") && snakeList.item(i).style.left == $("#food").css("left")) {
      return true;
    }
  }

  return false;
}

// 判断是否咬到自己
function IsTouch() {
  console.log('咬到自己了');
  var snakeList = document.getElementsByName("snake");
  var head = snakeList.item(0);
  var headLeft = head.style.left;
  var headTop = head.style.top;

  for (var i = 1; i < snakeList.length; i++) {
    if (snakeList.item(i).style.top == headTop && snakeList.item(i).style.left == headLeft) {
      return true;
    }
  }

  return false;
}

// 游戏结束
function gameover() {
  confirm("游戏结束，您一共吃到食物：" + score + "次", continuer());
}

// 继续
function continuer() {
  $("#screen").remove();
  init();
  stop();
}

// 游戏初始化
function init() {
  // 初始化方向值
  nowDirection = "right";
  nextDirection = "right";

  // 初始化吃到食物的次数
  score = 0;

  // 屏幕
  var screen = $('<div>', {
    id: "screen",
    tabindex: "0"
  });
  screen.appendTo('body');

  // 蛇
  var left = 760;
  for (var i = 0; i <= 4; i++) {
    if (i == 0) {
      var snake = $('<div>', {
        class: "snake",
        name: "snake",
        id: "head"
      });
    } else {
      var snake = $('<div>', {
        class: "snake",
        name: "snake",
      });
    }
    snake.appendTo('#screen');
    snake.css('left', left + 'px');
    snake.css('top', 480 + 'px');
    left = left - size;
  }

  // 食物
  var screen = $('<div>', {
    id: "food"
  });
  screen.appendTo('#screen');
}