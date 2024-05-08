const performanceItems = document.querySelector('.performance-items');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');
const itemWidth = performanceItems.querySelector('.performance-item').offsetWidth;

let currentIndex = 0;

nextButton.addEventListener('click', () => {
  if (currentIndex < performanceItems.children.length - 3) {
    currentIndex++;
    performanceItems.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  } else {
    currentIndex = 0;
    performanceItems.style.transform = 'translateX(0)';
  }
});

prevButton.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    performanceItems.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  } else {
    currentIndex = performanceItems.children.length - 3;
    performanceItems.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  }
});