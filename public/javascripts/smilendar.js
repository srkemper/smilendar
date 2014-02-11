

$(document).ready(function(){
  $(".smile").on('click','.mood-status',chooseMood);

})


function chooseMood() {
  console.log("did it!");
  var mood = $(this).attr('id');
  console.log(mood);
  $(this).parent().siblings(".mood-display").attr('id',mood);
}