

$(document).ready(function(){
    initializeDayView();
    $(".weekday-num").on("click",".cal-cell1", selectDay);
})


function initializeDayView() {
    var curUrl = window.location.pathname;
    var dayUrl = curUrl.split('/')[1];
    console.log('dayUrl: '+dayUrl);
    if(dayUrl == '11') {
      var urlToPass ='/dayEvent/tue';
    } else {
      var urlToPass ='/dayEvent/wed';
    }
    // Load the event list of today
    $.get(urlToPass, renderDayEvent);
    highlightDay(dayUrl);
    console.log('initialize page');
}


function highlightDay(dayUrl) {
    $("div.cal-cell1[href='"+dayUrl+"']").find('.day-order').addClass("active");
}


function selectDay(e) {
    // Retrieve event list of a day using AJAX
    pageurl = $(this).attr('href');
    e.preventDefault();
    console.log('selecting day-----');
    $(this).siblings().find(".day-order").removeClass("active");
    $(this).find(".day-order").addClass("active");
    var day = $(this).attr('id');
    console.log(day);
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
    console.log(result);

    // Retrieve templates from template file
    var template = Smilendar.Templates["templates/eventList.handlebars"];
    Handlebars.registerPartial('eventItem', Smilendar.Templates["templates/eventItem.handlebars"]);
    var htmlText = template(result);
    $("#this_day").html(htmlText);

    // append event handler to AJAX created content
    initDynamicEventHandlers();
}
