
$(document).ready(function(){
    initializePageView();
    console.log("add_event");
    $("#add-event-datepicker").datepicker();    
})

function initializePageView() {
	console.log('page view')
    $("#postEvent-form").submit(function() {
        var name = $("#name-input").val();

        if (!name) {
        	$('#name-input').css({ "border": '#FF0000 1px solid'});
        }

        console.log('submit')
        console.log(name);
    });
}