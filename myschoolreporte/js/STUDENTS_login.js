//LOGIN.PHP

var ltimer;

function check_class(isDemo){

  if(ltimer) clearTimeout(ltimer);
 var cc=$('.class_check_result');
  cc.empty();
$('.login,.apply-demo').hide();
  var sa=$.trim($('.schoolalias').val());
  var u=$.trim($('.username').val());
if(sa.length<5||u.length<5) return;

cc.html('<div class="alert alert-info text-center"> <i class="fa fa-spinner fa-spin" aria-hidden="true">&nbsp;</i> checking...</div>');

  ltimer=setTimeout(function(){

$.ajax({ url:'AJAX-PHP/check_class.php',
  data:{
  "schoolalias":sa,
  "username":u
},
  type:'POST'
 }).done( function(data){
   //alert(data)
if(!data){
  cc.html('<div class="alert alert-danger">Sorry, no class found</div>');
return false;
}

 if(data.match(/(__NOT_FOUND__|__ERROR__|__EMPTY__|ERROR |DENIED |UNKNOWN |__DB_ERROR__|failed:)/i) ){
   cc.html('<div class="alert alert-danger">School alias/username combination not correct</div>');
return false;
}
else if(data.match(/__CLASSES_NOT_FOUND__/i) ){
  cc.html('<div class="alert alert-danger">Sorry, classes not found. Contact your teacher.</div>');
return false;
}
else if( data.match(/__TEACHER_LOCKED__/i) ){
   cc.html('<div class="alert alert-danger">Sorry, you won\'t be able to login at the moment. Contact your teacher.</div>');
return false;
}

 var md=' <label><i class="fa fa-building"></i> Choose class</label><select name="studentclass">';
var c=$.trim(data.replace(/\|\|/g,' '));
  c=c.split(' ');
if(c.length>10){
toast('Classes not safe to view');
cc.html('<div class="alert alert-danger">Classes not safe to view. Contact teacher.</div>');
return false;
}

var md_=''
var class_selected=localStorage.getItem('lclass_selected');
  class_selected=class_selected?class_selected.toUpperCase():'';

for(var i=0;i<c.length;i++){
 var d=c[i];
 if(d.match(/^[a-z0-9_-]+$/i) && !d.match(/first-class/i)){
  md_+='<option value="' +d + '"' + (class_selected==d?' selected':'') + '>' + d.toUpperCase().replace(/_/g,' ')+'</option>';
  }
}
if(!md_){
  cc.html('<div class="alert alert-danger">Sorry, no class found</div>');
return false;
}
md+=md_+ '</select>';
  cc.html(md);

 $('.login').fadeIn();
if( autoLoginClick ||isDemo){
 var p1=$('#pass1').val();
var p2=$('#pass2').val();
var p3=$('#pass3').val();

   if( $('.error').length<1 && p1 && p2 && p3) $('.login').click();
}else{

$('#pass1,#pass2,#pass3').val('');
 
 }
  
}).fail(function(){
$('.apply-demo').fadeIn();
 toast('Check your internet connection.');
 });

 },2000);

}


$(function(){

var ls=$.trim(localStorage.getItem('logschool_alias') );
var lu=$.trim(localStorage.getItem('logusername'));

if(ls && lu){
$('.schoolalias').val(ls);
$('.username').val(lu);

var p1_=localStorage.getItem('logpass1');
var p2_=localStorage.getItem('logpass2');
var p3_=localStorage.getItem('logpass3');

  check_class();
 $('#pass1').val(p1_);
 $('#pass2').val(p2_);
 $('#pass3').val(p3_);
}

$('body').on('click','.login',function(e){

if(!_supportsLocalStorage){
 toast('This site supports only modern technology.');
return false;
}

var s= $.trim($('.schoolalias').val());
var u= $.trim($('.username').val() );
var p1=$.trim($('#pass1').val() );
var p2=$.trim($('#pass2').val() );
var p3=$.trim( $('#pass3').val());
var p= p1 + p2 + p3;

if(!s.match(/^[a-z]+[a-z0-9]{4,20}$/i)){
toast('Enter a valid school alias');
return false;
}else if(!u.match(/^[a-z]+[a-z0-9]{4,20}$/i) ){
toast('Enter a valid username');
return false;
}
else
if(!p) { return; }
else if(!p.match(/^[0-9]{12}$/)){
 toast('Enter a valid pin');
 return false;
}

if(s.toLowerCase()!='rightpath' && u.toLowerCase()!='olusola'){
localStorage.setItem('logschool_alias',s);
localStorage.setItem('logusername',u);
}

var cc=$('.login_check');
cc.empty();

cc.html('<i class="fa fa-2x fa-spinner fa-spin" aria-hidden="true" style="display:block; margin-top: 10px;">&nbsp;</i>');

});


$('body').on('input','.schoolalias,.username',function(){
  check_class();
});


$(".password").keyup(function () {
  if(__INAPP) return;
    if (this.value.length == this.maxLength) {
    var n=$(this).next('.password');
  n.focus();
 if(n.val().length==n.prop('maxlength')) n.next('.password').focus(); 
    }
});

 });

document.body.addEventListener("focus", function(event) {
    var target = event.target;
    switch (target.tagName) {
        case "INPUT":
        case "TEXTAREA":
        case "SELECT":
document.body.classList.add("keyboard");
    }
}, true); 
document.body.addEventListener("blur", function(){   document.body.classList.remove("keyboard");
}, true); 






