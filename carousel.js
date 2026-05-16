const INTERVAL = 4000; // 自動切替の間隔（ms）
let current = 0;
let total = 0;
let timer = null;
let auto = true;

async function initCarousel() {
  const res = await fetch('https://assets.momokiji.com/shop.json');
  const items = await res.json();
  total = items.length;

  const track = document.querySelector('.carousel-track');
  track.innerHTML = items.map(item => `
    <div class="carousel-item">
      <img src="${item.image}" alt="${item.title}">
      <div class="carousel-info">
        <p class="carousel-title">${item.title}</p>
        <p class="carousel-description">${item.description}</p>
        <p class="carousel-price">${item.price}</p>
        <a href="${item.url}" target="_blank" class="carousel-btn">BOOTHで購入</a>
      </div>
    </div>
  `).join('');

    // initCarousel内のstartTimer()の前に追加
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
    current = (index + total) % total;
    document.querySelector('.carousel-track').style.transform = 
      `translateX(-${current * 100}%)`;
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