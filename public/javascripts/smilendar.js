$(document).ready(function(){
    initializePage();
})
function initializePage() {
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
    console.log(result);
    eventlist = {events: result};
    var source = $('#this_day').html(); // gets the contents of handlebars template
    var template = Handlebars.compile(source);
    $('#this_day').html(template(eventlist));
}
