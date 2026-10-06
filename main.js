
/* Slider */
const swiper = new Swiper('.carousel', {
  
  loop: true,

  
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
/* kolla så att min swiper funkade */
console.log(swiper);