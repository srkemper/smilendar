

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
	console.log("renderDayEvent results:");
    console.log(result);

    var htmlText = "";
    var i;
    for (i=0;i<result.length; i++) {
        htmlText += '<div class="event-item"><a href="/calendar_event/'+result[i].id+'"><div class="event-time col-xs-3"><h6 class="start-time">2:15 PM</h6><h6 class="end-time">3:30 PM</h6></div><div class="col-xs-9 event-info"><h5 class="event-title">'+result[i].name+'</h5><p class="event-brief">'+result[i].comment+'</p><div class="smile"><div class="dropdown"><button data-toggle="dropdown" class="btn-xs smile-face mood-display" id="'+result[i].mood+'" >smile</button><ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"><li id="happy" class="smile-face mood-status">Happy</li><li id="excited" class="smile-face mood-status">Excited</li><li id="sad" class="smile-face mood-status">Sad</li><li id="angry" class="smile-face mood-status">Angry</li></ul></div></div></div><div class="clearfix visible-xs"></div></a></div>';
        //htmlText += '<div class="event-item"><a href="/calendar_event/{{id}}"><div class="event-time col-xs-3"><h6 class="start-time">2:15 PM</h6><h6 class="end-time">3:30 PM</h6></div><div class="col-xs-9 event-info"><h5 class="event-title">{{name}}</h5><p class="event-brief">{{comment}}</p><div class="smile"><div class="dropdown"><button data-toggle="dropdown" class="btn-xs smile-face mood-display" id="{{mood}}" data-identifier="{{_id}}">smile</button><ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"><li id="happy" class="smile-face mood-status">Happy</li><li id="excited" class="smile-face mood-status">Excited</li><li id="sad" class="smile-face mood-status">Sad</li><li id="angry" class="smile-face mood-status">Angry</li></ul></div></div></div><div class="clearfix visible-xs"></div></a></div>';

    }

    console.log(htmlText);
    $('#this_day').html(htmlText);

//    eventlist = {events: result};
//    Handlebars.registerPartial('
//    var source = $('#this_day').html(); // gets the contents of handlebars template
//    var source = $('#ajax_comment').html(); // gets the contents of handlebars template
//    console.log('printing source');
//    console.log(source);
//    console.log(eventlist);
//    var template = Handlebars.compile(source);
//    console.log(template(eventlist));
//    $('#this_day').html(template(eventlist));
}
