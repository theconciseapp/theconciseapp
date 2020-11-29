var lastTop;

function showApplyDemoBtn(){
var d=$('.demo-btn-container');
var type=d.data('type');
//alert(_SITE_URL_);
d.hide().html('<button class="btn btn-sm btn-info apply-demo-demo" style="margin-left: 20px; margin-bottom: 20px;" data-type="' + type + '">Apply demo</button>').fadeIn();
}


$(function(){
showApplyDemoBtn();

$('body').on('click','.apply-demo-demo', function(){
 var d=$(this);
var type=$.trim(d.data('type') );
  
 if(type=='admin'){
  $('.password').val('12345')
   $('.username').val('rightpathschool');
}
else if(type=="students"){
$('.schoolalias').val('rightpath');
$('.username').val('olusola');

 check_class(true);

 $('#pass1').val('2745');
 $('#pass2').val('2925');
 $('#pass3').val('8323');

return;
}
else if(type=="teachers"){
$('.schoolalias').val('rightpath');
$('.username').val('olusola');
$('.password').val('12345');
}

$('.login').click();
  });
});

function student_photo_url(id,gender){
gender=gender||'male';
var def=_SITE_URL_ + '/images/' + (gender=='male'?'m_no_tamperX.png':'f_no_tamperX.png');

if(!_STUDENTS_PHOTO_PATH_) return def;
return _STUDENTS_PHOTO_PATH_ + '/' + id + '.jpg?u=' + randomString(10);

}

function __ERR(type,e,a){
var er='';
if(e) er=typeof e=='object'?JSON.stringify(e):e;
var ix=function(data,a){
 if(a) alert(data); else toast(data);
}

if(type==0) {
 ix('Check your internet connection! ' + er,a);
 }
else if(type==1) { 
ix('Unexpected error occurred! ' +er,a);
 }
 else if(type==2) { 
ix('Unknown error occurred! ' +er,a);
 }
}

function checkERTLocalStorage(){
var len=0;
for (var i = 0; i < localStorage.length; i++) {
 key = localStorage.key(i); 
 if(key.startsWith('ERT_') )  {
 var llen=localStorage.getItem(key).length;
len= len+llen;
  }
}
var total=len/1000;
 if(total>200) freeLocalStorage();
}

function freelocalStorage(){
for (var i = 0; i < localStorage.length; i++) {
 key = localStorage.key(i); 
 if(key.startsWith('ERT_') )  {
    localStorage.removeItem(key); 
  }
 }
}

 checkERTLocalStorage();

function REBUILDDB__(json_,class_selected,studentid__,noparse){

 var csl__=class_selected;

  var rebuild='{';
  var tO=0;
  $.each(json_,function(i,v){

if(i.match(new RegExp("/" + csl__+ "/","i") ) ){
tO++;

 var val=esc__(v);
 
if(i.match(/\/members.my/i)){
  var total_students=$.trim(val.replace(/\\n/g,'\n') ).split('\n').length-1;

  var re='.*' + studentid__ + '.*';
  var reg=new RegExp(re,'i');
   var m_=v.match(reg);
  if(m_) val=m_[0].replace(/"/g,'\\"');

rebuild+='"' + i + '":"' + val + ',\\"' + total_students + '\\",\\"' + csl__ + '\\""';

 rebuild+='\n,\n';

}
 else if(i.match(new RegExp('/' + csl__ + '/workday','i') ) ){
  rebuild+='"' + i + '":"' + val + '"';
 rebuild+='\n,\n';
}
else if(i.match(new RegExp('/' + studentid__ + '/','i') ) ){
  rebuild+='"' + i + '":"' + val + '"';
  rebuild+='\n,\n';
 }
}
 if(i.match(/\/exam_settings.my/i ) ){ 
  rebuild+='"' + i + '":"' + esc__(v) + '"';
  rebuild+='\n,\n';
}

if(i.match(/\/inbox.txt/i ) ){ 
  rebuild+='"' + i + '":"' + esc__(v ) + '"';
  rebuild+='\n,\n';
}


});

 rebuild=rebuild.replace(/,\s$/,"");
 rebuild+='}';

if (noparse){
  return rebuild;
}

try{  
  return JSON.parse(rebuild);
  }catch(e){ 
  toast(e);
 }

}

var JSONparse_=function(data,type){
if(!data) return {}
if(type=='base64') data=LZString.decompressFromBase64(data);

return JSON.parse( data );
 }

if(typeof randomString=='function') {
sessionStorage.setItem('gscid', randomString(4));
}

function imgError(image,avatar) { image.onerror = ""; image.src =avatar; return true; }


//SEARCH MEMBERS

 $('body').on('input','.search_box', function(){
     $('input[type="checkbox"]').prop('checked', false); 
      var value=$(this).val().toLowerCase();
      $('.search_name,.search_tr').filter(function(){ 
   $(this).toggle($(this).text().toLowerCase().indexOf(value)> -1)
   });
 var num=$('.search_name:visible').length;
    if(num<1) {
  
  toast('Not found.');
/* 
if(!$('.overshadow').is(':visible')) getScroll(true,true);
     addOsAttr('closeSearchForm();');
       $('.search_error').fadeIn();
*/ 
 }

});
   

function animateCSS(element, animationName, callback) {
  var node=$(element);
      node.addClass('animated ' + animationName);

    function handleAnimationEnd() {
        
      node.removeClass('animated ' + animationName);
      node.unbind('webkitAnimationEnd oanimationend msAnimationEnd animationend');       
     if (typeof callback==='function') callback();
   
}

   node.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',handleAnimationEnd);
 
 }



/*

And use it like this:

animateCSS('.my-element', 'bounce')

// or
animateCSS('.my-element', 'bounce', function() {
  // Do something after animation
})


*/


function studentData(v,student_data,element){
 element=element||'.members_data';

student_data=$.trim(student_data||$(element).text());

    if(!student_data) return "";
 student_data=student_data.split('","');

var data="";
 
switch(v){
  case 'id': data=student_data[0];
break;
  case 'surname':data= student_data[1];
 break;
case 'firstname': data= student_data[2];
break;
 case 'gender':data= student_data[3];
break;
 case 'member_id':data= student_data[4];
 break;
case 'password':data= student_data[5];
 break;
case 'phone':data= student_data[6];
 break;
 case 'email':data= student_data[7];
 break;
case 'address':data= student_data[8];
 break;
case 'parent_phone': data= student_data[9];
break;
case 'country':data= student_data[10];
break;
case 'state': data= student_data[11];
break;
 case 'note': data= student_data[12];
break;
case 'photo':data= student_data[13];
break;
case 'registered_date': data= student_data[14];
break;
case 'total_students':data= student_data[15];
break;
case 'class':data=student_data[16];

}

if(!data) return "";

return data.replace(/"/g,'');

}


function sortSpecial(priorities,liveData){

  /*var priorities=['jim','steve','david'];
    var liveData=['bob','david','steve','darrel','jim'];
  */

var output=[],temp=[];  
for ( i=0; i<liveData.length; i++){
    if( $.inArray( liveData[i], priorities) ==-1){
        output.push( liveData[i]);
    }else{
        temp.push( liveData[i]);
    }
}
var temp2=$.grep( priorities, function(name,i){
        return $.inArray( name, temp) >-1;                             
});
   return $.merge( temp2, output);
}


function format_semester(data){
 data=data.replace(/_([^_]*)$/, '/$1').replace(/_/g,' ');
   return data.replace('semester','term');
}

function format_semester2(data){
   data=data.replace(/_/g,' ');
  return data.replace('semester','term');
  
}

function format_session(data){
    return data.replace(/_/g,'/');
 }


function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}


function conciseDate(type,current){

  var sthis_day=localStorage.getItem('this_day');
  var sthis_month=localStorage.getItem('this_month');
  var sthis_year=localStorage.getItem('this_year');

  var this_day=sthis_day||moment().format('DD');
  var this_month=sthis_month||moment().format('MM');
  var this_year=sthis_year||moment().format('YYYY');

  var semester=localStorage.getItem('semester')||default_semester;
  var session=localStorage.getItem('session')||default_session;
  var this_semester=semester + '_' + session;
  var this_session=session?session : (+this_year)-1 + '_' + this_year;
 
 if (type=='today') return this_day + '_' + this_month + '_' + this_year;
  else if( type=='day') return this_day;
  else if( type=='month') return this_month;
  else if (type=='year') return this_year;
  else if ( type=='month_year' ) return this_month + '_' + this_year;
  else if (type=='semester') return semester;
  else if (type=='this_semester') return this_semester;
  else if (type=='session') return session;
  else if (type=='this_session') return this_session;

  else if (type=='currentToday') return moment().format('DD_MM_YYYY');

}



$.fn.flash = function(duration, iterations) {
    duration = duration || 1000; // Default to 1 second
    iterations = iterations || 1; // Default to 1 iteration
    var iterationDuration = Math.floor(duration / iterations);
    for (var i = 0; i < iterations; i++) {
        this.fadeOut(iterationDuration).fadeIn(iterationDuration);
    }
    return this;
}

function getTimePeriod(selector,sel) {
     if (!selector) return false;
     var opt='<option value="AM"' + (sel=='AM'? ' selected' : '') + '>AM</option><option value="PM"' + ( sel=='PM'? ' selected': '') + '>PM</option>';
    $('.'+selector).html(opt);
}


function getRange(selector,fromm,too,sel,monthName,lzero) {
  if (!selector) return false;
    var f=fromm.toString().split('|');
    var emptyOption=false;

     if (f.length>1) {       
    var emptyOption=true;
      var fro=f[1];
  }
   else
     {
        var fro=f[0];
    }

      var to=too?too:12;
       var from=fro?fro:"0";
       var lzero=!lzero?true:false;

  var opt=emptyOption ? '<option></option>' : '';

     for (var i=from; i<=to; i++){ data=lzero && i<10? '0'+i : i;
  opt+='<option value="'+data+'"' + ( data==sel? ' selected':'')+'>'+ (monthName? getMonthName(data): data) +'</option>';
    }
 if(!selector.match(/(\.|#)/)) $('.' + selector).html(opt);
  else $(selector).html(opt);
}


function getMonthName(num,cap){
   var m=new Array();
  if(!num) return false;

    if (num<10) var num=num.replace('0','');

   m[1]='January';
   m[2]='February';
   m[3]='March';
   m[4]='April';
   m[5]='May';
   m[6]='June';
   m[7]='July';
   m[8]='August';
   m[9]='September';
   m[10]='October';
   m[11]='November';
   m[12]='December';

   var r=m[num];
 
   if (cap) return r.toUpperCase(); else return r; 
}


function getExamSemester(c,x){
 
  var sem='';
if(x) sem=localStorage.getItem(x);
  var semester=localStorage.getItem('semester')||default_semester;
 if(sem){ 
  semester=sem; 
 
}
   
 $(c).html('<option value="1st_semester"'  + ( semester=='1st_semester' ? 'selected="selected"' :'') +
'>1ST TERM</option><option value="2nd_semester"' + (semester=='2nd_semester' ? 'selected="selected"' : '') +
 '>2ND TERM</option><option value="3rd_semester"' + ( semester=='3rd_semester' ? 'selected="selected"' : '') + '>3RD TERM</option>');



}

function getExamSession(c,x){
   var session_options='';
  var ses='';
 if(x) ses=localStorage.getItem(x);
  var session=localStorage.getItem('session')||default_session;
  if(ses){ session=ses; }
  var cy=+(moment().format('YYYY'))+1;

 for ( var i=2019; i<=cy; i++){
   var sopt=(i-1) + '_' + i;
   session_options+='<option value="' + sopt + '"' + ( session==sopt? 'selected="selected"' : '' ) + '>' +( i-1) + '/' + i + '</option>';
  }
  $(c).html(session_options);
}



function ftoUpperCase(str,eWord,deli) {

 // If we need to Make the first letter of each WORD in a SENTENCE
     if(!str) return "";
     if ( eWord) {
    var w=str.trim().split(' ');
 var tot=w.length;
     var stri='';
  for( var i=0;i<tot; i++){
   stri+=w[i].substr(0,1).toUpperCase()+w[i].substr(1); 
   if (i<tot) stri+=' ';
  //  stri+=words[i].charAt(0).toUpperCase() + words[i].slice(1) + delimeter;
  }
  return stri;
    }

/* if it is just the first WORD in a WORD or SENTENCE then do this
*/
  return str.charAt(0).toUpperCase() + str.slice(1);
}


function remOsAttr(){
 $('.overshadow').removeAttr('onclick');
 }

function addOsAttr(func){
  if(func) $('.overshadow').attr('onclick',func);
 }

function overshadow(){
 $('.overshadow').show();
}


function close_overshadow(){
 $('.overshadow').hide();
}

 $.fn.visibleHeight = function() {
    var elBottom, elTop, scrollBot, scrollTop, visibleBottom, visibleTop;
    scrollTop = $(window).scrollTop();
    scrollBot = scrollTop + $(window).height();
    elTop = this.offset().top;
    elBottom = elTop + this.outerHeight();
    visibleTop = elTop < scrollTop ? scrollTop : elTop;
    visibleBottom = elBottom > scrollBot ? scrollBot : elBottom;
    return visibleBottom - visibleTop;
};


function stopScroll(elem,elem2){
  var v=0;
   if (elem2){
  if( elem2.search('.')!=-1 ) v=$(elem2).visibleHeight()-10;
    else v=+elem2;
 }

  elem=elem||'.main-container';
   lastTop =$(window).scrollTop();
  sessionStorage.setItem('lastTop',lastTop);
   $(elem).addClass('noscroll').css({top:-(lastTop-v)}); //lastTop-118
  }

function continueScroll(elem) {  
  elem=elem||'.main-container';                  
    $(elem).removeClass( 'noscroll' );

  var lastTo=+sessionStorage.getItem('lastTop')||lastTop;
      
      $(window).scrollTop( lastTo );       
 }          


function getScroll(noScroll,oS,elem,elem2){
   var c=sessionStorage.getItem('gsccc');
  setTimeout(function(){
   sessionStorage.removeItem('gsccc'); },400);

 if(!c){

  var gscid=sessionStorage.getItem('gscid');  

 var gsc=+sessionStorage.getItem('gsc' + gscid);
     //gsc=gsc<0?0:gsc;
  sessionStorage.setItem('gsc' + gscid, gsc+1); 
    sessionStorage.setItem('gsccc','1');
    }

 if (noScroll) { stopScroll(elem,elem2); if (oS) { overshadow(); }  return false; }
   if (oS) overshadow(); 
   lastTop = $(window).scrollTop();
 }


 $(window).scroll(function(){
   lastTop = $(window).scrollTop();
   // sessionStorage.setItem('lastTop',lastTop);
 });



function applyScroll(oS,elem){
  var co=true;
  var cs=true;

   var gscid=sessionStorage.getItem('gscid');
   var gsc=+sessionStorage.getItem('gsc' + gscid);

    remOsAttr();

 if(gsc<2 ){
  if (!oS && co ) close_overshadow();
   if (cs) continueScroll(elem);
   sessionStorage.removeItem('gsc' + gscid);
  }
   sessionStorage.setItem('gsc' + gscid,gsc-1);
 
  }



var toastTimer;
function toast(data,c,callback){
  if(toastTimer) clearTimeout(toastTimer);
  var config=$.extend({
  pos:80,
  custom_class:'',
  hide: 3000,
  type: 'danger',
  align: 'center',
  font_size: '90%',
  width: '80%',
  text_color:'#ffffff',
  background:'',
  manual_close: false,
  z_index: 2000
},c);
   
   var bg={
           danger: '#d9534f',
           success: 'seagreen',
           info: '#0065A3',
           warning:'orange'
          };
   if(config.background)  bg={
           danger: config.background,
           success: config.background,
           info: config.background,
           warning: config.background
          };
   /* info: background:#4b6cb7*/

 if(toastTimer) clearTimeout(toastTimer);
   $('.android_toast').hide();
    var mc="";
  if(config.manual_close){
   mc='<img onclick="' + (callback?'callback();':'') + 'clearTimeout(toastTimer);$(\'.android_toast\').fadeOut();" src="' + _SITE_URL_ + '/images/bg/close.png" style="width: 17px; position: absolute; top:-5px; left:-5px;">'; 
  }
    
  var div='<div class="dont_print DONT_PRINT android_toast ' + config.custom_class + '" style="background: ' + bg[config.type] +
       '; position: fixed; z-index: ' + config.z_index + ';left: 50%; opacity:.95; color:#fff; width: 50%;border:0;font-size:90%; border-radius: 7px;padding: 8px 20px; max-width: 550px; top: ' + config.pos + 
       '%; width: ' + config.width + '; -webkit-transform: translate(-50%,-' + config.pos + '%); transform:translate(-50%,-' + config.pos + '%); text-align: ' + config.align + 
        '; font-size: ' + config.font_size + '; color: ' + config.text_color + '">' + mc + data + '</div>';
  
  $('body').append(div);
 toastTimer=setTimeout(function(){
    $('.android_toast').fadeOut();
   clearTimeout(toastTimer);
   if(callback) callback();
  },config.hide);
}


function displayData(data,arr){
  var osclass='dd_' + randomString(10);
  var a=$.extend({
    'ddclass':'body',
    'gs':true,
    'os':true,
    'osc': osclass,
    'oszindex': 150,
    'data_class':'.nothing',
    'osclose': false,
    'on_close': '',
    'type':0,
    'osopacity':'0.5',
    'title':''
  },arr);
  if($(a.data_class).length) return;
  
  //osclose if set to true, then user can also close div on overshadow click
  var osclose='';
   if(a.osclose) osclose=' onclick="closeDisplayData(\'' + a.data_class + '\',\'' + a.on_close + '\');"';
     
var mt_=$('.main_table');
var im_=$('.isMobile');
var is_mobile_=true;
 if( mt_.length && im_.is(':visible') ){
is_mobile_=false;
   //mt_.css({'overflow-y':'hidden'});
}

  var div='';
var myDiv = document.createElement("div");
 
//Set its unique ID.
var uid = 'div_id_' + randomString(6);
myDiv.id=uid;
  if(a.type)
  {
     div='<div class="center_div bssubjects ' + a.data_class.replace('.','') + '" style="background:#fff;">';
     div+='<div class="center_header">' + (a.title?a.title:'') + '</div>';
     div+='<div class="center_text_div" style="width:100%; padding: 10px 15px;">';
     div+=data;
    div+='</div></div>';
 $(a.ddclass).append(div);
 }
  else {
$(a.ddclass).prepend(data);
}
  

  $(a.data_class).css('z-index',(a.oszindex+30) ).attr('data-overshadow','.' + a.osc).after('<div class="DONT_PRINT dont_print ' + a.osc + '" style="background: #000; position: fixed; z-index: ' + a.oszindex + '; top:0; left:0; right:0;  bottom:0; opacity: ' + a.osopacity + '; display:none;"' + osclose + '></div>');


  if(is_mobile_ && a.gs){
$('body').addClass('stop-scrolling');
$('.' + a.osc).bind('touchmove', function(e){
e.preventDefault();
 })

}

   if(a.os) $('.' + a.osc).show();

}

 function closeDisplayData(elem,callback){
var mt=$('.main_table');
var im=$('.isMobile');
var is_mobile_=true;

 if( mt.length && im.is(':visible') ){
is_mobile_=false;
   mt.css({'overflow-y':'auto'});
}
  var os=$(elem).data('overshadow');
   $(elem).remove();
  $(os).remove();

if(is_mobile_) $('body').removeClass('stop-scrolling');

   if(callback){
  if(typeof callback==='string' ||callback instanceof String){ window[callback](); } 
      else callback();
   }
 }


// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}


escape = function (str) {
    // TODO: escape %x75 4HEXDIG ?? chars
    return str
      .replace(/[\"]/g, '\\"')
      .replace(/[\\]/g, '\\\\')
      .replace(/[\/]/g, '\\/')
      .replace(/[\b]/g, '\\b')
      .replace(/[\f]/g, '\\f')
      .replace(/[\n]/g, '\\n')
      .replace(/[\r]/g, '\\r')
      .replace(/[\t]/g, '\\t');
 }

esc__ = function (str) {
    // TODO: escape %x75 4HEXDIG ?? chars
    return str
     .replace(/[\"]/g, '\\"')
     // .replace(/[\\]/g, '\\\\')
     // .replace(/[\/]/g, '\\/')
     // .replace(/[\b]/g, '\\b')
     // .replace(/[\f]/g, '\\f')
      .replace(/[\n]/g, '\\n')
      .replace(/[\r]/g, '\\r')
      .replace(/[\t]/g, '\\t');
 }


function copy1(text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
  }


var width = $(window).width();
$(window).on('resize', function() {
  if ($(this).width() !== width) {
   // width = $(this).width();
 if( $('.menudummy').length ){
  closeDisplayData('.menudummy');
 //animateCSS('.first_column','slideOutRight faster',function(){

$('.first_column').addClass('hidden-xs');
}
  }
});
