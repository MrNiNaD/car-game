let speed, carCount, carPositionMap, carPosition, ms;
const initialTop = -150;

const setInitalValue = () => {
  speed = null;
  carCount = 0;
  carPositionMap = {};
  carPosition = {
    top: 0,
    left: 0,
  };
  ms = 0;
};

setInitalValue();

const preScreen = document.querySelector('.pre-screen');
const playBtn = document.querySelector('.play-button');

preScreen.onclick = (e) => e.stopPropagation();

playBtn.onclick = (e) => {
  createSetup();
  preScreen.style.display = 'none';
};

const keyCodes = {
  37: 'arrowLeft',
  38: 'arrowUp',
  39: 'arrowRight',
  40: 'arrowDown'
}

const direction = {
  [keyCodes[37]]: false,
  [keyCodes[38]]: false,
  [keyCodes[39]]: false,
  [keyCodes[40]]: false,
};

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function doDivsIntersect(div1, div2) {
  const rect1 = div1.getBoundingClientRect();
  const rect2 = div2.getBoundingClientRect();

  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

let count = 100;

const driveCar = () => {
  const ourCar = document.querySelector('.our-car');
  const road = document.querySelector('.road');
  const movement = 5;

  if (direction.arrowUp) {
    const afterMovement = carPosition.top - movement;

    if (afterMovement >= 0) {
      carPosition.top = afterMovement;
  
      ourCar.style.top = `${carPosition.top}px`;
    }
  } else if (direction.arrowDown) {
    const afterMovement = carPosition.top + movement;

    if (afterMovement <= (road?.clientHeight - ourCar?.clientHeight)) {
      carPosition.top = afterMovement;
  
      ourCar.style.top = `${carPosition.top}px`;
    }
  } else if (direction.arrowLeft) {
    const afterMovement = carPosition.left - movement;

    if (afterMovement >= 0) {
      carPosition.left = afterMovement;
  
      ourCar.style.left = `${carPosition.left}px`;
    }
  } else if (direction.arrowRight) {
    const afterMovement = carPosition.left + movement;

    if (afterMovement <= (road?.clientWidth - ourCar?.clientWidth)) {
      carPosition.left = afterMovement;
  
      ourCar.style.left = `${carPosition.left}px`;
    }
  }
}

const newCar = () => {
  const key = `car-${carCount}`;
  const span = document.createElement("span");

  span.className = "enemy-car";
  span.setAttribute("data-id", key)
  span.innerHTML = '<span class="enemy-actual-car"></span><img src="./assets/enemy-car2.png" />';
  
  span.style.top = `${initialTop}px`;
  carPositionMap[key] = initialTop;
  carCount++

  return span
}

const play = () => {
  const road = document.querySelector('.road');
  const allEnemyCar = document.querySelectorAll('.enemy-car');
  const ourCar = document.querySelector('.our-car');
  let gameOver = false;

  if (ms === 400) {
    ms = 0;
  } else {
    ms++;
  }

  if (count <= 1) {
    count = 100;
  } else {
    const diff = 0.5;

    if (speed) {
      count = count - (diff * speed/100);
    } else {
      count = count - diff;
    }
  }

  if (ms === 0 && allEnemyCar.length < 4) {
    const elm = newCar();
    const clientWidth = road?.clientWidth - 100;
    const result = randomIntFromInterval(0, clientWidth);

    elm.style.left = `${result}px`;

    road.appendChild(elm);
  }

  const roadTrack = document.querySelector('.road-track');

  allEnemyCar.forEach((eachCar) => {
    const dataId = eachCar.getAttribute("data-id");
    carPositionMap[dataId] = carPositionMap[dataId] + 0.7;

    if (carPositionMap[dataId] >= road?.clientHeight) {
      eachCar?.remove();
      delete carPositionMap[dataId];
    } else {
      eachCar.style.top = `${carPositionMap[dataId]}px`;
    }

    if (!gameOver && doDivsIntersect(eachCar?.querySelector('.enemy-actual-car'), ourCar?.querySelector('.our-actual-car'))) {
      gameOver = true;
    }
  })

  roadTrack.style.top = `-${count}%`;

  driveCar();

  if (!gameOver) {
    window.requestAnimationFrame(play)
  }
}

try {
  navigator.getBattery().then((data) => {
    if (data.charging) {
      speed = 50;
    }
  })
  
} catch (error) {
}

const setDirection = (keyCode, flag) => {
  direction[keyCodes[keyCode]] = flag;
}

window.addEventListener("keydown", (e) => {
  setDirection(e.keyCode, true);
});

window.addEventListener("keyup", (e) => {
  setDirection(e.keyCode, false);
});

document.querySelector('.top-btn').addEventListener('touchstart', () => setDirection(38, true))
document.querySelector('.top-btn').addEventListener('touchend', () => setDirection(38, false))

document.querySelector('.right-btn').addEventListener('touchstart', () => setDirection(39, true))
document.querySelector('.right-btn').addEventListener('touchend', () => setDirection(39, false))

document.querySelector('.bottom-btn').addEventListener('touchstart', () => setDirection(40, true))
document.querySelector('.bottom-btn').addEventListener('touchend', () => setDirection(40, false))

document.querySelector('.left-btn').addEventListener('touchstart', () => setDirection(37, true))
document.querySelector('.left-btn').addEventListener('touchend', () => setDirection(37, false))

const createSetup = (option = {}) => {
  const roadTrack = document.querySelector('.road-track');
  const road = document.querySelector('.road');
  const ourCar = document.querySelector('.our-car');

  if (roadTrack) {
    const twoPercent = roadTrack.clientHeight * (2/100);
    
    let actualDivider = '';
    let eachLine = '';
    let drawLine = false;

    for (let i = 0; i < 100; i++) {
      actualDivider += `<span class="eachDivider" style="height: ${twoPercent}px; background: ${i % 2 === 0 ? '#ffdf00' : '#000'};"></span>`;

      if (i % 5 === 0) {
        drawLine = !drawLine;
      }

      eachLine += `<span class="eachLine" style="height: ${twoPercent}px; background: ${drawLine ? '#fff' : 'transparent'};"></span>`;
    }

    const divider = `<span class="divider">${actualDivider}</span>`;
    const dividerLine = `<span class="divider-line">${eachLine}</span>`;

    roadTrack.innerHTML = `${divider}${dividerLine}${divider}`;
  }
  
  if (road && ourCar) {
    const top = road?.clientHeight - ourCar?.clientHeight - 10;
    const left = (road?.clientWidth / 2) - (ourCar?.clientWidth / 2);

    ourCar.style.top = `${top}px`;
    ourCar.style.left = `${left}px`;

    carPosition = {
      top,
      left,
    };
  }

  !option.dontStart && window.requestAnimationFrame(play)
}

createSetup({ dontStart: true })