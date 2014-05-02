$(document).ready(function(){
  $('.tabs ul.tabs-nav li').click(function(){
    var tab_id = $(this).attr('data-tab');
    $('.tabs ul.tabs-nav li').removeClass('current');
    $('.tabs .tabs-content').removeClass('current');
    $(this).addClass('current');
    $("#"+tab_id).addClass('current');
  });
});