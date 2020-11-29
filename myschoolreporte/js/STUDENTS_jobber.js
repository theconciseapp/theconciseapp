function __JOBBER(classSelected,username1,username2,pattern,token,rawPassword,LSK,__INAPP){

$.ajax({
 url:'AJAX-PHP/login_data.php',
type:'POST',
data:{ 
  "stage":1,
  "username1": username1.toLowerCase(),
  "username2": username2.toLowerCase(),
  "token":token
}

}).done(function(data){

 if( data.match(/__NOT_FOUND__/)){
if(__INAPP){
 location.href='login.php?inApp=1&error=0&ch=1';
} else location.href='login.php?error=nf&ch=1'
return;
}
localStorage.setItem('lclass_selected',classSelected);
var T___=LZString.decompressFromBase64(data); 

 try{
 var T__=JSON.parse(T___.replace(/</g,'&lt;').replace(/>/g,'&gt;'));

}catch(e){
  alert('Error occured! We are working on it. ' + e);
T__=null;
T___=null;
if(__INAPP){
 location.href='login.php?inApp=1&error=0&ch=1';
} else location.href='login.php?error=0&ch=1';
 return;
}
  T___=null; 
  var lp='/' + classSelected + '/login_pins.my';
 lp=T__[lp];
 
 if(!lp){ 
  //alert('login not found');
 if(__INAPP) {
 location.href='login.php?inApp=1&error=1&ch=1';
}else location.href='login.php?error=1&ch=1';
return;
 }else{
 lp=lp.match(pattern);
  if(!lp){
  // alert('Details you entered are not correct')
 if(__INAPP){
 location.href='login.php?inApp=1&error=2&ch=1';
} else location.href='login.php?error=2&ch=1';
return;
}else {
  var lpdata=$.trim( lp[0] ).split('@@');
  var sid=lpdata[1].replace('"','');
  var sa__='/' + classSelected + '/' + sid + '/lock.my';

 if(T__[sa__]){
 alert('Access denied! Please contact teacher');
 if(__INAPP){
 location.href='login.php?inApp=1&error=3&ch=1';
} else location.href='login.php?error=3&ch=1';
return;

}else{
 var REB__=REBUILDDB__(T__,classSelected,sid,true);
 T__=null;
var key;
 for (var i = 0;i< localStorage.length; i++) {
 key = localStorage.key(i); 
 if(key.length>59){
   localStorage.removeItem(key); 
  } 
}
 localStorage.setItem(LSK,REB__);
REB__=null;

$.ajax({
 url:'AJAX-PHP/login_data.php',
type:'POST',
data:{id:sid }}).done(function(data){

if(data.match(/__SUCCESS__/) ){
 var rpwd=rawPassword.split('-');

 if(username1.toLowerCase()!='rightpath' && username2.toLowerCase()!='olusola'){

localStorage.setItem('logpass1',rpwd[0]);
localStorage.setItem('logpass2',rpwd[1]);
localStorage.setItem('logpass3',rpwd[2]);
}

setTimeout(function(){
 if(__INAPP){
 location.href=formatUrl('tcaindex://','index.php','close2=1');

} else {
 location.href='index.php';
 }
},1000);
  return;
}
 else{
 if(__INAPP){
 location.href='login.php?inApp=1&error=4&ch=1';
} else location.href='login.php?error=4&ch=1';

return;
}
});
  }}
}

}).fail(function(e){
 alert(JSON.stringify(e));
});

}


var SIBLING__1={};
var SIBLING__2={};
var SIBLING__3={};
  
function __JOBBERsib( classSelected,username1,username2,password,token,LSK,sibPos){
var sbtn=$('.sibling_btn_' + sibPos);
 classSelected=classSelected.toLowerCase();

try{

var pattern=new RegExp( password + '@@[a-z0-9]{2,13}','i');

var sibling_data='.sibling_div_' + sibPos;

 if(!username1||!username2||!token){
 return toast('Sibling details not complete.');
}

var sp=$('.sibling-spin_' + sibPos);
sp.removeClass('d-none');

$.ajax({
 url:'AJAX-PHP/login_data.php',
type:'POST',
data:{ 
  "stage":1,
  "username1": username1.toLowerCase(),
  "username2": username2.toLowerCase(),
  "token":token
 }
}).done(function(data){

  sp.addClass('d-none');
  sbtn.removeAttr('disabled');
var T___=LZString.decompressFromBase64(data); 

 try{
 var T__=JSON.parse(T___.replace(/</g,'&lt;').replace(/>/g,'&gt;'));
}catch(e){
 toast('Sorry, we couldn\'t fetch this result. Invalid details.',{hide:5000});
  sbtn.fadeIn();
return;
}
 
 T___=null; 
  var lp='/' + classSelected + '/login_pins.my';
 lp=T__[lp];
 
 if(!lp){ 
  toast('Unable to fetch one or more sibling results. login not found',{hide:5000});
}else{
 lp=lp.match(pattern);
  if(!lp){
  toast('Details entered for sibling not correct. Contact teacher.',{hide:5000})

}else {
  var lpdata=lp[0].split('@@');
  var sid=lpdata[1].replace(/[^a-z0-9@-]/i,'');
var sa__='/' + classSelected + '/' + sid + '/lock.my';

 if(T__[sa__]){
 toast('Access denied for one sibling! Please contact teacher',{hide:5000});
}else{
 var REB__=REBUILDDB__(T__,classSelected,sid,true);

var storageKey='sibling_pos_' + sibPos;
 localStorage.setItem(storageKey,REB__);
 
 var key_='SIBLING__' + sibPos;
   REB__=JSON.parse(REB__);
 
  $.extend(window[key_],REB__);

 T__=null;

 var md_='/' + classSelected + '/members.my';

 md_=__(window[key_][md_]);

var re='"' + sid + '",".*';
  var reg=new RegExp(re,'i');

 if(!md_){

toast('Unable to fetch sibling data at the moment!');
sbtn.fadeIn()
   return;
}
var sd_=md_.match(reg);

 if(!sd_){
sbtn.fadeIn()
   return;
}
 
 $('body').append('<div class="' + sibling_data.replace('.','') + ' d-none"></div>');

 $(sibling_data).text(sd_[0]);
 loadStudents(sibling_data,true,sibPos,classSelected)
    REB__=null;
  }}
}


}).fail(function(e){
 toast('Error occurred! We are working on it.');
 sbtn.fadeIn();
 sp.addClass('d-none');
sbtn.removeAttr('disabled');
});

}catch(e){
   toast(e);
 }
}
