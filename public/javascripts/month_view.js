
$(document).ready(function(){
    console.log('this is month view!!');
    initializeMonthView();
    $(".to-cal").on("click",hideMood);
    $(".to-mood").on("click",showMood);
    showMood();
    // $(".weekday-num").on("click",".cal-cell1", selectDay);
})


function initializeMonthView() {
    console.log('initialize page');
    initDynamicEventHandlers();

    var curUrl = window.location.pathname;
    var monthUrl = curUrl.split('/')[2];
    console.log('monthUrl: '+monthUrl);
    var urlToPass = '/monthEvent/' + monthUrl;
    $.get(urlToPass, renderMonthEvent);
    $(".month-nav").on("click","a",changeMonth); // it is weird that this event listener would not be removed when AJAX updates the html
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


function changeMonth(e) {
  console.log($(this).attr('href'));
  var monthUrl = $(this).attr('href');
  e.preventDefault();
  var urlToPass = '/monthEvent/'+monthUrl;
    $.get(urlToPass, renderMonthEvent);

  var pageurl = '/month/'+monthUrl;
  console.log('pageurl is '+pageurl);

  // Dynamically update the url while AJAX loads
  if(pageurl!=window.location){
      window.history.pushState({path:pageurl},'',pageurl);
    }
}


function renderMonthEvent(result) {
  console.log("AJAX successful!!");
  // Using handlebars template to render month days for a month view
    // console.log("renderMonthEvent results:");
    // console.log(result.weeks);
    var template_1 = Smilendar.Templates["templates/monthNav.handlebars"];
    var template_2 = Smilendar.Templates["templates/monthDay.handlebars"];
    var htmlText_1 = template_1(result);
    var htmlText_2 = template_2(result);
    $('.month-nav').html(htmlText_1);
    $('.month-day').html(htmlText_2);
    // $(".month-nav").on("click","a",changeMonth); // Add event listener to month pager
}