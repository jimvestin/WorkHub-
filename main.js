
/* Slider */
const swiper = new Swiper('.carousel', {
  
  loop: true,

  /* delar upp bilderna till en slide */
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
/* för att kolla så att swipe funktionen funkade */
console.log(swiper);