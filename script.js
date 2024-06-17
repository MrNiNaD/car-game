let speed = null;
let carPosition = {
  top: 0,
  left: 0,
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

const createSetup = () => {
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
}

createSetup()

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

const play = () => {
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

  const roadTrack = document.querySelector('.road-track');

  roadTrack.style.top = `-${count}%`;

  driveCar();

  window.requestAnimationFrame(play)
}

window.requestAnimationFrame(play)

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