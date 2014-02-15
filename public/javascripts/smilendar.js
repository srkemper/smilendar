
$(document).ready(function(){
    initializePage();
})


function initializePage() {
    urlToPass ='/dayEvent/wed'
    // Load the event list of today
    $.get(urlToPass, renderDayEvent);
    console.log('initialize page');
}


function renderDayEvent(result) {
  // Using handlebars template to render event list of a day
	console.log("renderDayEvent results:");
    console.log(result);

    // Retrieve templates from template file
    var template = Smilendar.Templates["templates/eventList.handlebars"];
    Handlebars.registerPartial('eventItem', Smilendar.Templates["templates/eventItem.handlebars"]);
    var htmlText = template(result);
    $('#this_day').html(htmlText);

    // append event handler to AJAX created content
    initDynamicEventHandlers();
}

function initDynamicEventHandlers() {
    // Dynamically append event handler to AJAX created content.
    console.log('initialized!');
    $(".smile").on('click','.mood-status',chooseMood);
    $('.cal-cell1').on('click',selectDay);

}

function chooseMood(e) {
    // Choose the mood for according event
    e.preventDefault();
    console.log("did it!");
    var mood = $(this).attr('id');
    console.log(mood);
    $(this).parent().siblings(".mood-display").attr('id',mood);

    // Update mood to database using AJAX
    var dbid = $(this).parent().siblings(".mood-display").attr('data-identifier');
    console.log(dbid);
    $.ajax({
     url: '/changeMood',
     type: 'POST',
     success: function(){console.log("ajax post success")},
     contentType: 'application/json',
     data: JSON.stringify({id:dbid, mood: mood})
    });
}

function selectDay(e) {
    // Retrieve event list of a day using AJAX
    e.preventDefault();
    console.log('selecting day-----');
    var day = $(this).attr('id');
    console.log(day);
    var urlToPass = '/dayEvent/'+day;
    $.get(urlToPass, renderDayEvent);
    console.log(urlToPass);

}