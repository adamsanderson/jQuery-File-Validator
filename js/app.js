$(function(){
  
  $('input.demo').fileValidator({
    onValidation: function(files){      $(this).attr('class','');          },
    onInvalid:    function(type, file){ $(this).addClass('invalid '+type); }
  });
  
});