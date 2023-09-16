function SELECTOPTIONS(obj,options_){
  try{
  var arr=false
 if($.isArray(obj) ) arr=true;
    
  var token='a_' + randomString(10);
  var o=$.extend({
  'pos':'-40px',
  'left':'',
  'container':'.select-options-container',
  'title':'Select option',
  'empty':'',
  'select_id':'',
  'select_class':'',
  'zindex': 50,
  'customSelectStyle':'',
  'default_selected2':'',
  'class':'btn-light',
  'size':'btn-sm',
  'type': 'light',
  'align': 'center',
  'font_size': '90%',
  'minSelectWidth':'100px',
  'maxSelectWidth':'200px',
  'width_':'150px',
  'text_color':'#333333',
  'background':'',
  'token': token,
  'callback':'',
  'repl':[],
  'capitalize':'AaA',
  'reset':'',
  'disabled': false
}, options_);   
  var options='';
  if(arr && o.empty) obj.unshift(' ');
  var index=-1;
var def=o.default_selected2;

  $.each( obj, function(i,v){
    index++;
  var rep=o.repl;
   var val_=v;
   var jump=-1;
    if(rep.length){
      
  for(var j=0; j<(rep.length/2);j++){
   jump++;
    var jmp=jump*2;
    var reg=new RegExp(rep[jmp],'gi');
    var re=jmp+1;
   val_=val_.toString().replace(reg,rep[re]);
  }
 }
 if(o.capitalize=='AaA'){
     var valu=Cap(val_); 
    }
    else if (o.capitalize=='AA'){
      var valu=val_.toUpperCase();
    }
 else{
   var valu=val_;
  }   
    
 if(arr) {
   options+='<div class="d-block so-options-' + o.token + ' ' + ( def && def.toString().toLowerCase()==v.toString().toLowerCase()?'selected_' + o.token:'') + ' so_' + index + '_' + o.token + ' text-left" style="color:' + o.text_color + '; padding: 10px; border-top: 1px solid rgba(0,0,0,.13); max-width: 300px; white-space: nowrap; text-overflow:ellipsis; overflow-x: hidden;" onclick="SELECTEDOPTION(\'' + o.token + '\',\'' + v + '\',\'' + valu + '\',\'' + index + '\',\'' + o.callback + '\');">' + valu + '</div>';
   }
  else {
   options+='<div class="d-block so-options-' + o.token + ' ' + (def && def.toString().toLowerCase()==i.toString().toLowerCase()?'selected_' + o.token:'') + ' so_' + index + '_' + o.token + ' text-left" style="color:' + o.text_color + '; padding: 10px; border-top: 1px solid rgba(0,0,0,.13); max-width: 300px; white-space: nowrap; text-overflow:ellipsis; overflow-x: hidden;" onclick="SELECTEDOPTION(\'' + o.token + '\',\'' + i + '\',\'' + valu + '\',\'' + index + '\',\'' + o.callback + '\');">' + valu + '</div>';
 }
  });
    
 var data='<span class="so-mouseout" style="display: inline-block; min-width: ' + o.minSelectWidth + ';">';
  data+='<button ' + (o.disabled?'disabled="disabled"':'') + 'id="' + o.select_id + '" data-index="" data-token="' + o.token + '" onclick="" value="" class="selectoptionclicked ' + o.select_class + ' btn ' + o.class + ' ' + o.size + ' so-title_' + token + ' text-left" style="margin: 0; min-width: ' + o.minSelectWidth + '; border-radius: 5px; max-width: ' + o.maxSelectWidth + '; white-space: nowrap; text-overflow: ellipsis; overflow-x: hidden;' + o.customSelectStyle + '">' + o.title + '</button>';
  data+='<div data-reset="' + o.reset + '" class="so-options-container so-mouseout-hide options_' + o.token + '" style="display: none; position: absolute; z-index: ' + o.zindex + '; font-weight: bold; font-family: san-serif; font-size: 12px; ' + ( o.left?' left:' + o.left +';':'') + ' max-height: 60vh; overflow-y: auto; min-width: ' + o.width_ + '; background: #fff; border: 0; -webkit-box-shadow: 3px 3px 20px rgba(0,0,0,.3); border-radius: 5px;">' + options + '</div>';
  data+='</span>';
 $(o.container).css({'z-index': o.zindex,'padding':0,'margin-left':0, 'margin-right':'6px','display':'inline-block','width': o.minSelectWidth}).addClass('btn text-left').html(data );
 $('.options_' + o.token).css({'margin-top': o.pos});
  
  //Add class 'No-callback' at first call because there 
  //should be no callback() call when select just loaded.
 if( def && $('.selected_' + o.token).length) {
    $('.selected_' + o.token).addClass('No-callback').click();
 }
  else {
  var ind=$('.so_0_' + o.token);
      ind.addClass('index_0');
      ind.addClass('No-callback').click();  
  }
    
  }catch(e){
    alert(e);
  }
}


function SELECTEDOPTION(token,value,text,index,callback){
 try{
   var d=$('.options_' + token);
  var select=$('.so-title_' + token);
  d.slideUp('fast');
  var ind=$('.so_0_' + token); 
  select.val( $.trim(value) ).text(text);

if( d.data('reset') && !ind.hasClass('index_0') ){
  var ind_text=ind.text();
    select.text(ind_text);
 }
  
ind.removeClass('index_0');
  var selected=$('.selected_' + token);
 
 if(!d.data('reset')){
   $('.so-options-' + token).removeClass('btn-info text-white');
  $('.so_' + index + '_' + token).addClass('btn-info text-white');
 }
  
if( ind.hasClass('No-callback')||selected.hasClass('No-callback') ){
  ind.removeClass('No-callback');
  selected.removeClass('No-callback');
  return;
}
 if(callback){
   setTimeout(function(){
     
  if(typeof callback==='string' ||callback instanceof String){ 
    window[callback](value,text,index);
  }
      else callback(value,text,index);
   },400);
}
   
 }catch(e){
   alert(e);
 }
  }
  
function closeSelectOptions(){
  $('.so-mouseout-hide').slideUp('fast');
}

$(function(){
  
  $('body').on('click','.selectoptionclicked',function(){
  try{
    var d=$(this); 
    var tok=d.data('token');
    var cls= $('.options_' + tok);
        cls.toggle();
   // alert('clicked');
  }catch(e){
   alert('selectedoptionclicked in myscript, error: ' + e);
 }
  
  });
   
$(document).on('click', function (e) {
  if ( $(e.target).closest(".so-mouseout").length === 0) {
      closeSelectOptions();
  //  closeDisplayData('.selectoptionsdummy');
      
    }
});

 
});

