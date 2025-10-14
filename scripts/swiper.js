const swiper = new Swiper(".swiper", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  on: {
    init: function(){
      updateNavButtons(this);
    },
    slideChange: function(){
      updateNavButtons(this);
    }
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

function updateNavButtons(swiper) {
  const prevBtn = document.querySelector('.swiper-button-prev');
  const nextBtn = document.querySelector('.swiper-button-next');

  if (swiper.isBeginning) {
    prevBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'block';
  }

  if (swiper.isEnd) {
    nextBtn.style.display = 'none';
  } else {
    nextBtn.style.display = 'block';
  }
}