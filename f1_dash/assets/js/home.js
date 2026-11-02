// Анимация 3: «живой» Live Timing в hero — пилоты обгоняют друг друга.
// Строки меняются местами плавно по технике FLIP (First, Last, Invert, Play).
const timingBoard = document.querySelector('.hero-telemetry');
const posColors = ['red-pos', 'orange-pos', 'blue-pos'];

function getRows() {
  return [...timingBoard.querySelectorAll('.telemetry-row')];
}

// Пересчитывает номера позиций и отставания от лидера
function updatePositions(rows) {
  let gap = 0;
  rows.forEach((row, index) => {
    const pos = row.querySelector('.pos');
    pos.textContent = String(index + 1).padStart(2, '0');
    pos.className = `pos ${posColors[index]}`;

    if (index === 0) {
      row.lastElementChild.textContent = 'LEADER';
    } else {
      gap += 0.15 + Math.random() * 0.9;
      row.lastElementChild.textContent = `+${gap.toFixed(3)}`;
    }
  });
}

function overtake() {
  const rows = getRows();
  const index = 1 + Math.floor(Math.random() * (rows.length - 1)); // P2 или P3 обгоняет того, кто впереди
  const attacker = rows[index];

  // First: запоминаем, где стоит каждая строка
  const before = rows.map((row) => row.offsetTop);

  // Last: переставляем строку в DOM и обновляем позиции
  rows[index - 1].before(attacker);
  updatePositions(getRows());

  // Invert + Play: сдвигаем строки обратно на старое место и плавно отпускаем
  rows.forEach((row, i) => {
    const shift = before[i] - row.offsetTop;
    if (shift) {
      row.animate(
        [{ transform: `translateY(${shift}px)` }, { transform: 'translateY(0)' }],
        { duration: 700, easing: 'cubic-bezier(.2, .8, .2, 1)' }
      );
    }
  });

  // Подсвечиваем обгоняющего зелёным
  attacker.animate(
    [{ backgroundColor: 'rgb(53 208 127 / 30%)' }, { backgroundColor: 'transparent' }],
    { duration: 1600, easing: 'ease-out' }
  );
}

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setInterval(overtake, 3000);
}
