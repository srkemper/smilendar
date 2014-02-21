$(document).ready(function(){
    showMenu();
    $(".go-to-today a").attr('href','/'+getTagAndDate(new Date()));
});


function chooseMood(e) {
    // Choose the mood for according event
    e.preventDefault();
    console.log("did it!");
    var mood = $(this).attr('id');
    console.log(mood);
    $(this).parent().parent().siblings(".mood-display").attr('id',mood);

    // Update mood to database using AJAX
    var dbid = $(this).parent().parent().siblings(".mood-display").attr('data-identifier');
    console.log(dbid);
    $.ajax({
     url: '/changeMood',
     type: 'POST',
     success: function(){console.log("ajax post success")},
     contentType: 'application/json',
     data: JSON.stringify({id:dbid, mood: mood})
    });
}

function initDynamicEventHandlers() {
    // Dynamically append event handler to AJAX created content.
    console.log('initialized!');
    $(".smile").on('click','.mood-status',chooseMood);
}

function showMenu() {
    $(".menu-button").on('click', function(e){
        console.log('menu clicked!');
        $('.menu-drop-down').toggleClass("show-menu"); //you can list several class names
        e.preventDefault();
    })
}

function getTagAndDate(currDate) {
    var month = currDate.getMonth()+1;
    month = month.toString();
    var date = currDate.getDate();
    date = date.toString();

    // month = appendZero(month);
    // date = appendZero(date);

    tag = month+'-'+date;

    return tag;
}
