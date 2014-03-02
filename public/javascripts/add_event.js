
$(document).ready(function(){
    initializePageView();
    console.log("add_event");
    $("#add-event-datepicker").datepicker();    
})

function getDateTimeFromISOTime(startTimeISOString) {
    var startTime = new Date(startTimeISOString );
     startTime =   new Date( startTime.getTime() + ( startTime.getTimezoneOffset() * 60000 ) );
     return startTime
}

function initializePageView() {
	console.log('page view')
    $("#postEvent-form").submit(function() {
        var name = $("#name-input").val();
        var starttimestr = $("#start_time").val();
        var endtimestr = $("#end_time").val();
        var startime = getDateTimeFromISOTime(starttimestr);
        var endtime = getDateTimeFromISOTime(endtimestr);

        
        // validate doesn't work: see documentation at
        // http://stackoverflow.com/questions/17858360/twitter-bootstrap-and-jquery-validation-plugin-use-class-control-group-error
        // $("#name-input").validate({
        //     errorClass: "control-group error"
        // });


        if (!name) {
        	$('#name-input').css({ "border": '#FF0000 1px solid'});
        }

        console.log('submit')
        console.log(name);
    });
}