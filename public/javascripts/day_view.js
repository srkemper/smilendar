

$(document).ready(function(){
    initializeDayView();
    $(".weekday-num").on("click",".cal-cell1", selectDay);
    var addEventPostSucess = $("#addEventPostSucess").val();
    console.log('addEventPostSucess', addEventPostSucess);
    if (addEventPostSucess) {
        ga('send', 'event', 'add event', 'post');
    }

      $('.btn-check-in').on('click',function(){
        // console.log('user is about to login!');
        $('.check-in-view').addClass('check-in-view-show');
      });

      $('.go-back').on('click',function(){
        $('.check-in-view').removeClass('check-in-view-show');
      });
    // $("#lastweek").on("click", showLastWeek);
    // $("#nextweek").on("click", showNextWeek);
})

function initializeDayView() {
    console.log('---initializeDayView---')
    var curUrl = window.location.pathname;
    var dayUrl = curUrl.split('/')[1];
    console.log('dayUrl: '+dayUrl);

    var urlToPass = 'dayEvent/' + dayUrl;
    // Load the event list of today
    console.log('urlToPass: '+urlToPass)
    $.get(urlToPass, renderDayEvent);
    highlightDay(dayUrl);
    console.log('initialize page');
}


function highlightDay(dayUrl) {
    $("div.cal-cell1[href='"+dayUrl+"']").find('.day-order').addClass("active");
}


function selectDay(e) {
    // Retrieve event list of a day using AJAX
    var pageurl = $(this).attr('href');
    e.preventDefault();
    console.log('selecting day-----');
    $(this).siblings().find(".day-order").removeClass("active");
    $(this).find(".day-order").addClass("active");
    var day = $(this).attr('id');
    // console.log(day);
    var urlToPass = '/dayEvent/'+day;
    $.get(urlToPass, renderDayEvent);
    console.log(urlToPass);

    //to change the browser URL to the given link location
    if(pageurl!=window.location){
      window.history.pushState({path:pageurl},'',pageurl);
    }

    return false;
}

function renderDayEvent(result) {
  // Using handlebars template to render event list of a day
    console.log("renderDayEvent results:");
    // console.log(result.eventList);

    renderFullDateInString(result.fullDateInString);
    renderLeftRightArrow(result.lastWeekURL, result.nextWeekURL);
    renderAddEventLink(result.dayId);

    // Retrieve templates from template file
    var template = Smilendar.Templates["templates/eventList.handlebars"];
    Handlebars.registerPartial('eventItem', Smilendar.Templates["templates/eventItem.handlebars"]);
    var htmlText = template(result);

    // console.log(htmlText);

    $("#this_day").html(htmlText);

    // append event handler to AJAX created content
    initDynamicEventHandlers();
}

function renderAddEventLink(dayId) {
    console.log($("#addeventget").attr('action'))
    $("#addeventget").attr('action','/addEvent/'+dayId);
    console.log($("#addeventget").attr('action'))
}

function renderLeftRightArrow(lastWeekURL, nextWeekURL) {
    console.log('---renderLeftRightArrow---')
    console.log(lastWeekURL);
    console.log(nextWeekURL);
    // set href of <a> tag
    $("#lastweek").attr('href',lastWeekURL);
    $("#nextweek").attr('href',nextWeekURL);
}

function renderFullDateInString(result) {
    console.log(result);
    $("#fullDate").html(result);
}

function showLastWeek(e) {
    e.preventDefault();
}

function checkIn(e) {

}