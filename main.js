
/* Slider */
const swiper = new Swiper('.carousel', {
  // Optional parameters
  loop: true,

  // If we need pagination
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