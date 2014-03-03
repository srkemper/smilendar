$(document).ready(function(){
    showMenu();
    $(".go-to-today a").attr('href','/'+getTagAndDate(new Date()));
    $(function() {
        $.stayInWebApp('a.stay');
    });
});

var curr = null;

function chooseMood(e) {
    // Choose the mood for according event
    e.stopImmediatePropagation();
    console.log("did it!");
    var mood = $(this).attr('id');
    // console.log(mood);
    $(this).parent().parent().siblings(".mood-display").attr('id',mood);

    // Update mood to database using AJAX
    var dbid = $(this).parent().parent().siblings(".mood-display").attr('data-identifier');
    // console.log(dbid);
    $.ajax({
     url: '/changeMood',
     type: 'POST',
     success: function(){
        console.log("ajax post mood success")
    },
     contentType: 'application/json',
     data: JSON.stringify({id:dbid, mood: mood})
    });
    e.preventDefault();
}

// post comment from dropdown menu
function postComment(e) {
    // e.stopImmediatePropagation();
    console.log('post comment');
    var dropdownButton = $(this).parent().parent().parent().siblings(".mood-display");
    var dbid = dropdownButton.attr('data-identifier');
    var comment = $(this).parent().siblings(".comment-input").val();
    console.log(dbid);
    // var comment = $(".comment-input").val();
    // console.log(comment);
    console.log(dropdownButton.parent().parent().siblings(".comment-in-dayview").text());
    console.log('begin ajax post comment')

    $.ajax({
        url: '/addCommentAJAX',
        type: 'POST',
        success: function() {
            console.log("ajax post comment success")
            // update on the page, by changing the html of the comment
            dropdownButton.parent().parent().siblings(".comment-in-dayview").text(comment);
            ga('send', 'event', 'comment-ajax', 'post', 'homepage ajax');
        },
        contentType: "application/json",
        data: JSON.stringify({"id":dbid, "comment": comment})
    });
    e.preventDefault();

}

function sendGoogleAnalyticsForCloseDropdown() {
    console.log('dropdown closed');
    var end = new Date().getTime();
    var diff = end - start; // units of miliseconds
    console.log(start);
    console.log(end);
    console.log(diff);
    // curr.addClass('closed');
    ga('send', 'event', 'smiley', 'click', 'close-dropdown');
    ga('send', {
      'hitType': 'timing',          // Required.
      'eventCategory': 'smiley',   // Required.
      'eventAction': 'chooseMood',      // Required.
      'eventLabel': 'dropdown',
      'eventValue': diff
    });
    curr = null;    // reset curr
}

function initDynamicEventHandlers() {
    // Dynamically append event handler to AJAX created content.
    console.log('initialized!');
    
    // send google analytics event for smiley dropdown
    // see boostrap.js, search for JimW

    $(".smile").on('click','.mood-status',chooseMood);

    // clicking on comment box
    $(".comment-input").on('click', function(e) {
        console.log("text box selected")
        e.stopImmediatePropagation();
        e.preventDefault();
    });

    // listener on Go button for posting comment in homepage
    // and send google analytics
    $(".smile").on('click','.Go-button', postComment);

    // send google analytics for posting comment via edit event
    $("#post-comment-edit-page").submit(function(e) {
        e.preventDefault();
        console.log('post comment edit page')
        ga('send', 'event', 'comment-eventpage', 'post', 'edit event page');
        var form = this;
        setTimeout(function(){ form.submit()}, 150);
        // window.location.replace("/3-2");
    });

    // listen to whether dropdown is active
    // see boostrap.js, search for JimW

    // $(document).delegate('.go-to-event','click',function(e){
    //     var dest = $(this).attr("href");
    //     console.log('damn!');
    //     e.preventDefault();
    //     // self.location = dest;
    // });
    $.stayInWebApp('a.go-to-event');
}

function showMenu() {
    $(".menu-button").on('click', function(e){
        console.log('menu clicked!');
        $(".menu-drop-down").toggleClass("show-menu"); //you can list several class names
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
