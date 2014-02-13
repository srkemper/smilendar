

$(document).ready(function(){
  $(".smile").on('click','.mood-status',chooseMood);

})


function chooseMood(e) {
  e.preventDefault();
  console.log("did it!");
  var mood = $(this).attr('id');
  console.log(mood);
  $(this).parent().siblings(".mood-display").attr('id',mood);
}