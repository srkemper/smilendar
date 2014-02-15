

$(document).ready(function(){
    initializePage();
})
function initializePage() {
    urlToPass ='/dayEvent/wed'
    $.get(urlToPass, renderDayEvent);
    $(".smile").on('click','.mood-status',chooseMood);
    $('.cal-cell1').on('click',selectDay);
    console.log('initialize page');
}

function chooseMood(e) {
  e.preventDefault();
  console.log("did it!");
  var mood = $(this).attr('id');
  console.log(mood);
  $(this).parent().siblings(".mood-display").attr('id',mood);

  // database magic
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
    event.preventDefault();
    console.log('selecting day-----');
    var day = $(this).attr('id');
    console.log(day);
    var urlToPass = '/dayEvent/'+day;
    $.get(urlToPass, renderDayEvent);
    console.log(urlToPass);

}

function renderDayEvent(result) {
	console.log("renderDayEvent results:");
    console.log(result);
    console.log('this is template: ' + Smilendar.Templates["templates/eventList.handlebars"]);
    var template = Smilendar.Templates["templates/eventList.handlebars"];
    Handlebars.registerPartial('eventItem', Smilendar.Templates["templates/eventItem.handlebars"]);
    var htmlText = template(result);
    $('#this_day').html(htmlText);
}
