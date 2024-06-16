let speed = null;

const createSetup = () => {
  const roadTrack = document.querySelector('.road-track');

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
  
}

createSetup()

let count = 100;

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

  window.requestAnimationFrame(play)
}

window.requestAnimationFrame(play)

try {
  navigator.getBattery().then((data) => {
    if (data.charging) {
      speed = 30;
    }
  })
  
} catch (error) {
}