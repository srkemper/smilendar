var moodToString = {
    4: "excited",
    3: "happy",
    2: "soso",
    1: "sad",
    0: "angry",
    
};

$(document).ready(function(){
    initializeDayView();
    initializeCheckIn();
    initializeWeekSwipe();
    $(".weekday-num").on("click",".cal-cell1", selectDay);
    var addEventPostSucess = $("#addEventPostSucess").val();
    console.log('addEventPostSucess', addEventPostSucess);
    if (addEventPostSucess) {
        ga('send', 'event', 'add event', 'post');
    }
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

function initializeWeekSwipe() {
    $('.day-view .this-week').hammer().on("swipeleft", function(event) {
        console.log('nextweek');
        window.location = $('#nextweek').attr('href');
    });
    $('.day-view .this-week').hammer().on("swiperight", function(event) {
        console.log('lastweek')
        window.location = $('#lastweek').attr('href');
    });
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

function initializeCheckIn() {
    // listeners on the button check in to start the page
    $('.btn-check-in').on('click',function(){
        // console.log('user is about to login!');
        $('.check-in-view').addClass('check-in-view-show');
      });

      $('.go-back').on('click',function(){
        $('.check-in-view').removeClass('check-in-view-show');
    });

    var numMoods = Object.keys(moodToString).length;

    $('#moodchooser').hammer().on("swipeleft", function(event) {
        var curr = $(this)
        var attr = parseInt(curr.attr('attr'));
        var newattr = (attr+1+numMoods) % numMoods;
        console.log(newattr);
        console.log('left');
        curr.attr('attr', newattr.toString())
        curr.css('background-color', '#555555');
        // $(this).attr('_id','sad');
        $(this).html('happy');
    });

    $('#moodchooser').hammer().on("swiperight", function(event) {
        var curr = $(this)
        var attr = parseInt(curr.attr('attr'));
        var newattr = (attr-1+numMoods) % numMoods;
        console.log(newattr);
        console.log('left');
        curr.attr('attr', newattr.toString())
        console.log('right');
        $(this).css('background-color', '#57ad68');
        $(this).html('sad');
    });

    // Ajax posting mood and comment
    $('#check-in-done').on('click',postMoodAndComment);


    // var element = document.getElementById('good');
    // console.log('what is this? '+element);
    // var hammertime = Hammer(element).on("tap", function(event) {
    //     alert('hello!');
    // });


    // setContentSize();
    // $(window).resize(function(){
    //     setContentSize();
    // })

    // //Swiper Content
    // var mySwiper = new Swiper('.swiper-container',{
    // pagination: '.pagination',
    // grabCursor: true,
    // paginationClickable: true
    // });
}

function setContentSize() {
    $('.swiper-content').css({
      height: $(window).height()//-$('.swiper-nav').height()
    })
}

function postMoodAndComment(e) {
    e.preventDefault();
    console.log('---postMoodAndComment---');
    var curr = $(this);
    // console.log(curr)
    var commentElem = curr.parent().siblings('#comment-check-in-group').children('#comment-check-in');
    // console.log(commentElem);
    var comment = commentElem.val();
    console.log(comment);

    var moodElem = curr.parent().siblings('.moodchooser-group').children('#moodchooser');
    // console.log(moodElem);
    var moodId = moodElem.attr('attr');
    console.log(moodToString[moodId]);

    // get username
    var userElem = commentElem.siblings('#user-check-in');
    var user = userElem.val();
    console.log(user);

    // get URL to render
    var month = new Date().getMonth() + 1;
    var date = new Date().getDate();
    var day = month + "-" + date;
    var urlToPass = '/dayEvent/'+day;

    $.ajax({
        url: 'newMoodAndComment',
        type: 'POST',
        success: function() {
            console.log('ajax post mood and comment success');
            $.get(urlToPass, renderDayEvent);
        },
        contentType: 'application/json',
        data: JSON.stringify({
            'mood': moodToString[moodId],
            'comment': comment,
            'user': user
        })
    });
}

function updateNavPosition(){
    $('.swiper-nav .active-nav').removeClass('active-nav')
    var activeNav = $('.swiper-nav .swiper-slide').eq(contentSwiper.activeIndex).addClass('active-nav')
    if (!activeNav.hasClass('swiper-slide-visible')) {
      if (activeNav.index()>navSwiper.activeIndex) {
        var thumbsPerNav = Math.floor(navSwiper.width/activeNav.width())-1
        navSwiper.swipeTo(activeNav.index()-thumbsPerNav)
      }
      else {
        navSwiper.swipeTo(activeNav.index())
      }
    }
}