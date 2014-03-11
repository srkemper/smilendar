$(document).ready(function(){
    console.log('this is splash view!!');
    initializeSplashView();
    // $(".weekday-num").on("click",".cal-cell1", selectDay);
})


function initializeSplashView() {


  setContentSize()
  $(window).resize(function(){
    setContentSize()
  })

  //Swiper Content
  var mySwiper = new Swiper('.swiper-container',{
    pagination: '.pagination',
    grabCursor: true,
    paginationClickable: true
  })

  //Update Nav Position

  $('.btn-check-in').on('click',function(){
    // console.log('user is about to login!');
    $('.check-in-view').addClass('check-in-view-show');
  });

  $('.go-back').on('click',function(){
    $('.check-in-view').removeClass('check-in-view-show');
  });

}


function setContentSize() {
    $('.swiper-content').css({
      height: $(window).height()//-$('.swiper-nav').height()
    })
  }

function updateNavPosition(){
    $('.swiper-nav .active-nav').removeClass('active-nav')
    var activeNav = $('.swiper-nav .swiper-slide').eq(contentSwiper.activeIndex).addClass('active-nav')
    if (!activeNav.hasClass('swiper-slide-visible')) {
      if (activeNav.index()>navSwiper.activeIndex) {
        var thumbsPerNav = Math.floor(navSwiper.width/activeNav.width())-1
        navSwiper.swipeTo(activeNav.index()-thumbsPerNav)
      }
      else {
        navSwiper.swipeTo(activeNav.index())
      }
    }
  }