const INTERVAL = 4000; // 自動切替の間隔（ms）
let current = 0;
let total = 0;
let timer = null;
let auto = true;

let touchStartX = 0;

document.querySelector('.carousel').addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
});

document.querySelector('.carousel').addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) < 50) return; // 50px未満は無視
  stopTimer();
  if (diff > 0) {
    goTo(current + 1, true); // 左スワイプ → 次へ
  } else {
    goTo(current - 1, true); // 右スワイプ → 前へ
  }
});

async function initCarousel() {
  const res = await fetch('https://assets.momokiji.com/shop.json');
  const items = await res.json();
  total = items.length;

  const track = document.querySelector('.carousel-track');
  track.innerHTML = items.map(item => `
    <div class="carousel-item">
      <a href="${item.url}" target="_blank">
        <img src="${item.image}" alt="${item.title}">
      </a>
      <div class="carousel-info">
        <p class="carousel-title">${item.title}</p>
        <p class="carousel-description">${item.description}</p>
        <p class="carousel-price">${item.price}</p>
        <a href="${item.url}" target="_blank" class="carousel-btn">BOOTHで購入</a>
      </div>
    </div>
  `).join('');

  const dots = document.querySelector('.carousel-dots');
  dots.innerHTML = items.map((_, i) => 
    `<div class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}"></div>`
  ).join('');

  dots.querySelectorAll('.carousel-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      stopTimer();
      goTo(parseInt(dot.dataset.index), true);
    });
  });

  startTimer();
}

function goTo(index, manual = false) {
  const step = window.innerWidth > 1024 ? 50 : 100;
  current = (index + total) % total;
  document.querySelector('.carousel-track').style.transform = 
    `translateX(-${current * step}%)`;
    if (!manual) {
      resetBar();
    } else {
      // バーを止めたままにする
      const bar = document.querySelector('.carousel-bar');
      bar.style.transition = 'none';
      bar.style.width = '0%';
    }
    // goTo関数内に追加
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
    });
}

function resetBar() {
  const bar = document.querySelector('.carousel-bar');
  bar.style.transition = 'none';
  bar.style.width = '0%';
  setTimeout(() => {
    bar.style.transition = `width ${INTERVAL}ms linear`;
    bar.style.width = '100%';
  }, 50);
}

function startTimer() {
  resetBar();
  timer = setInterval(() => {
    goTo(current + 1);
  }, INTERVAL);
}

function stopTimer() {
  clearInterval(timer);
  auto = false;
}

document.querySelector('.carousel-prev').addEventListener('click', () => {
  stopTimer();
  goTo(current - 1, true);
});

document.querySelector('.carousel-next').addEventListener('click', () => {
  stopTimer();
  goTo(current + 1, true);
});

initCarousel();