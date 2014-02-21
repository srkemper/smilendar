
$(document).ready(function(){
    console.log('this is month view!!');
    initializeEventView();
    $(".to-cal").on("click",hideMood);
    $(".to-mood").on("click",showMood);
    // $(".weekday-num").on("click",".cal-cell1", selectDay);
})


function initializeEventView() {
    console.log('initialize page');
    initDynamicEventHandlers();
}


function showMood() {
  console.log('show mood!');
  $(".month-view").addClass('show-mood');
  $(".to-cal").removeClass("active");
  $(".to-mood").addClass("active");
}

function hideMood() {
  console.log('hide mood!');
  $(".month-view").removeClass('show-mood');
  $(".to-mood").removeClass("active");
  $(".to-cal").addClass("active");
}