var ajx;

var CSRF__=$('#csrf-token').attr('content');

function close_school_avatar(){
var d=$('.c_enl_btn');
  d.unwrap().remove();    
$('.school_name1').remove();
$('.this_avatar').addClass('school_avatar').removeClass('this_avatar');
$('.top_glass').hide();
closeDisplayData('.dummy');
}


function teacherQualification(){
var tq=$('.teacher_qualifications');
 var tql=$('.teacher_qualifications_loaded');
if(tql.length>0) return;

 setTimeout(function(){
ajx=$.ajax({
 url:'AJAX-PHP/teacher_qualifications.php',
type:'POST',
data: {
  'csrf':  CSRF__
}
}).done(function(data){
 if( data.match(/__LOGIN_REQUIRED__/) ){
 toast('Login required.');
location.reload();
return;
}
tq.html('<span class="teacher_qualifications_loaded">[ ' +data +' ]</span>');

}).fail(function(e){
// toast('Failed to fetch teacher qualification.');
tq.html('<span class="teacher_qualifications_loaded d-none"></span>');
  });
},AJAXDELAY__);
}


function close_student_avatar(){
var d=$('.close_enlarge_student_avatar');
 
  d.unwrap();
  $('.p_enl_btn').remove();
 $('.this_avatar').addClass('students_avatar').removeClass('this_avatar');

}

function close_menu_btn(){

animateCSS('.first_column','slideOutRight faster',function(){
$('.first_column').addClass('hidden-xs');

});

}

$(function(){
 
$('body').on('click','.member_info',function(){
  var v=$(this).data('value');
 if(!v) return;
toast(v.replace(/_/g,'/'),{type:'info',pos:'50'});

});


$('body').on('click','.menu_btn',function(){
 $('.first_column').removeClass('hidden-xs');

animateCSS('.first_column','slideInRight faster');

displayData('<div class="menudummy"></div>',{data_class:'.menudummy',oszindex:'50',osclose:true,on_close:'close_menu_btn'});

  });

$('body').on('click','.school_avatar',function(){
 var d=$(this);

d.wrap('<div class="enlarge_school_avatar"></div>');
 
d.removeClass('school_avatar').addClass('this_avatar');
$('.enlarge_school_avatar').prepend('<i class="fa fa-close c_enl_btn fa-lg" onclick="close_school_avatar();" style="position: absolute; right: 10px; color:#d9534f;"></i><div class="school_name1 text-center">' + ftoUpperCase(schoolName().toUpperCase() ) + '</div>');
$('.top_glass').show().attr('onclick','close_school_avatar()');
displayData('<div class="dummy"></div>',{data_class:'.dummy',osclose:true,osopacity:'0.5',oszindex:30,on_close:'close_school_avatar'});

});

$('body').on('click','.about_school',function(){

var d=$(this);
var aspin=$('.about_click_spin');
  aspin.show();
d.attr('disabled','disabled');

ajx=$.ajax({
url:'AJAX-PHP/about_school.php',
type:'POST',
data:{
 'csrf': CSRF__,
'get_about_school':1
}
}).done(function(data){
aspin.hide();
 d.removeAttr('disabled');
if(data.match(/__LOGIN_REQUIRED__/) ){

toast('Login required.');
 location.reload();
return;
}

 var div='<div class="center_div about_school_div bg-white">';

div+='<div class="center_header text-left" style="padding-left: 10px;"><i class="fa fa-info fa-lg"></i> About school</div>';

div+='<div class="center_text_div" style=" overflow-y: hidde;">';
div+='<textarea class="about_school_textarea" readonly>' + data + '</textarea><div class="text-right"></div>';
div+='</div></div>';

displayData(div, {data_class: '.about_school_div',osclose:true});

}).fail(function(e){
//alert(JSON.stringify(e) )
d.removeAttr('disabled');
aspin.hide();
toast('Check your internet connection.');
  });

});


});


function loadStudents(element,sibling,siblingKey,siblingClass){

var member_data=$.trim($('.members_data').text());
 
 if(!member_data){
   $('.main_table').html('No data');
$('.loading').fadeOut();
return false;
}


   // MAIN TABLE DATA 

      var main_data='';

    var surname=studentData('surname',false,element);
   var firstname=studentData('firstname',false,element);
    var id=studentData('id',false,element);
   
var gender=studentData('gender',false,element);
    var member_id=studentData('member_id',false,element)||'No ID';
    var phone=studentData('phone',false,element)||'No phone';
    var email=studentData('email',false,element)||'No email';
    var photo=studentData('photo',false,element);

var regDate=studentData('registered_date',false,element) ? studentData('registered_date',false,element) : '';

var ts=studentData('total_students',false,element);

var student_class=studentData('class',false,element); //necessaryto get siblings class

var avatar=_MALE_AVATAR_URL_;
 if(gender=='female') {
 avatar=_FEMALE_AVATAR_URL_;
 }
 var show_id='NO';

if (show_id=='YES' && member_id){
   var member_name=member_id + ' ' + (surname.substr(0,6) + '..');

  } else{
    var member_name=ftoUpperCase( ( surname + ' ' + firstname ),true) ;
      member_name=member_name.length>20?member_name.substr(0,20) + '...':member_name;
  }

   main_data+='<div class="' + (sibling?'is_sibling_' + siblingKey + ' ':'') + 'search_name long_select person_cont person_container" id="tr_' + id + '" data-id="' + id + '" style="' + (sibling?'display:none;':'') + ' margin: 8px 0; box-shadow:-1px 1px 1px 2px rgba(0,0,0,.1); border:0; border-radius:5px;">';


   main_data+='<div style="position: absolute; top:0; bottom:0; right:0; left: 0; z-index:10; background: none; display:none;" class="lsc_' +id +' long_select_cover"></div>';

     main_data+='<div style="background:#f7f7f7;"><!--<input type="checkbox" name="marked[]" class="chkbox chkb_' + id + ' mark_members" value="'+id+'" id="' + id + '"><label style="display:inline;" for="' + id + '"><span></span></label>-->';

 main_data+='<span class="profile_edit_ico id_badge" style="display: inline-block; margin-left: 7px; font-weight: bold; font-size: 13px;" id="stdent_id_'+id+'">Student ID: ';
    
 main_data+=member_id + '</span>';
     
main_data+='<span class="member_info" data-value="' + regDate + '" style="display: inline-block; float: right; margin-right: 10%; color: steelblue;"><i class="fa fa-info-circle fa-lg" aria-hidden="true"></i> </span></div>';

  main_data+='<div class="container" style="padding:0; width:100%;">';

     main_data+='<table class="table" style="margin:0; width:100%;"><tr><td style="width: 30%; padding:0;">'; 
   
 main_data+='<img class="enlarge person_phot students_avatar" src="' + student_photo_url(id,gender) + '">';

  main_data+='</td><td style="padding:0; vertical-align:middle;">';

main_data+='<table class="table table_student_details" style="margin:0; vertical-align:middle;">';
 
  main_data+='<tr><td class="td_pad_5">Name</td><td class="td_pad_5"><span class="student_name name_badge" id="tname_' + id + '">' + member_name + '</span></td></tr>';

main_data+='<tr><td class="td_pad_5">Gender</td><td class="td_pad_5">' + ftoUpperCase(gender) + '</td></tr>';


main_data+='<tr><td class="td_pad_5">Parent email</td><td class="td_pad_5">' + email + '</td></tr>';

main_data+='<tr><td class="td_pad_5">Parent phone</td><td class="td_pad_5">' + phone + '</td></tr>';

main_data+='</table>';
 main_data+='</td>';

main_data+='</tr>';
 main_data+='</table>';

function buttons(cls,id,txt,ts,sK,sC){
return '<button data-total-students="' + ts + '" data-value="' + id + '" class="' + cls + ' student_btn btn-sm btn btn-primary"' + (sK?' data-sibling-key="' + sK + '"':'') + (sC?' data-sibling-class="' + sC+ '"':'') + '><i class="fa fa-book" aria-hidden="true"></i>&nbsp;' + txt + '</button>';

}

main_data+='<div style="width:100%; overflow-x:auto;" class="results_btn_container">';

main_data+=buttons('view_result',id,'Result',ts,siblingKey,siblingClass);

main_data+=buttons('auto_click view_attendance',id,'Attendance',ts,siblingKey,siblingClass);

main_data+=buttons('affective_domain',id,'Affective domain',ts,siblingKey,siblingClass);

main_data+=buttons('psychomotor',id,'Psychomotor',ts,siblingKey,siblingClass);

main_data+=buttons('check personal_inbox personal_inbox_' + id,id,'Inbox',ts,siblingKey,siblingClass)

main_data+=buttons('hidden check2 class_inbox personal_inbox_' + student_class,id,'',ts,siblingKey,siblingClass);


main_data+='</div>';

main_data+='</div>';
main_data+='</div>'; 
main_data+='</div>'; 

var cs=$.trim($('.class_selected').text().replace(/_/g, ' ').toUpperCase() );

$('.class_name').text(cs).fadeIn();

 if(sibling){
  $('.siblings_title').after('<div style="font-weight:bold;">' + ( student_class?student_class.toUpperCase().replace(/_/g,' '):'') + '</div>' + main_data);

$('.is_sibling_' + siblingKey).slideDown();
} else {
$('.main_table').html(main_data + '<div class="siblings_btn_div"></div>');
}

setTimeout(function(){
 $('.loading').fadeOut();
$('.personal_inbox_' + id).click();
$('.personal_inbox_' + student_class).click();
  },500);

}

function __LOAD(){

var CLASS_SELECTED=$.trim($('.class_selected').text() );

 var md_='/' + CLASS_SELECTED + '/members.my';

 md_=__(TDATABASE__[md_]);

var re='"' + STUDENT_ID + '",".*';
  var reg=new RegExp(re,'i');

 if(!md_){

$('.main_table').html('<div class="alert alert-warning"><i class="fa fa-frown-o"></i> Unable to fetch your data at the moment!</div>');
 $('.loading').fadeOut();
   return;
}
var sd_=md_.match(reg);

 if(!sd_){

$('.main_table').html('Unable to fetch your data at the moment!');
 $('.loading').fadeOut();
   return;
}
 
 $('.members_data').text(sd_[0]);
   loadStudents();

 if(__AUTOSHOWATT){

setTimeout(function(){
$('.view_attendance').click()
$('.attendance_result').fadeIn(1000);
 },400);

}
 
}

$(function(){ 
    __LOAD();
CLASS_SELECTED=$.trim($('.class_selected').text())

var siblings='/' + CLASS_SELECTED + '/' +  STUDENT_ID + '/siblings.my';

 siblings=__(TDATABASE__[siblings]);
 if(siblings) {

siblings=JSON.parse(siblings);
if(siblings.length<1) return;

var btn='<h3 class="siblings_title">SIBLINGS</h3>';

btn+='<div class="siblings_btn_container">';
 
 $.each(siblings,function(i,v){
  var n=v['name'];
  var sa=v['school_alias'];
  var u=v['username'];
 var p=v['pin'];
 var c=v['class'].replace(/ /g,'_');

 btn+='<button class="sibling_btn_' + (i+1) + ' btn btn-sm btn-info show_sibling" data-class="' + c + '" data-name="' + n + '" data-schoolalias="' + sa + '" data-username="' + u  + '" data-pos="' + (i+1) + '" data-pin="' + p + '" style="margin-top:8px;">' + ftoUpperCase(n) + ' <i class="sibling-spin_' + (i+1) + ' fa fa-spinner fa-spin d-none"></i></button> ';
});

btn+='</div>';
$('.siblings_btn_div').html(btn);

  }

$('body').on('click','.show_sibling',function(){
var d=$(this);
 var pos=d.data('pos');
 var c=d.data('class');
 var sa=d.data('schoolalias');
 var u=d.data('username');
 var pin=$(this).data('pin');

if(!pos||!c||!sa||!u){
 return toast('Sibling datas not complete.');
}

 if($('.sibling_div_' + pos).length>0){
 return;
}
   d.attr('disabled','disabled');
  $('.sibling-spin_' + pos).removeClass('d-none');
setTimeout(function(){
__JOBBERsib(c,sa,u,pin,LSK,LSK,pos);
 },2000);

 });


$('body').on('click','.affective_domain',function(){
var cs_s=CLASS_SELECTED;

var siblingKey=$.trim($(this).data('sibling-key'));

if(siblingKey){
 cs_s=$(this).data('sibling-class');
 var BASE__=window['SIBLING__' + siblingKey];

} else{
 var BASE__=TDATABASE__;
}

var id=$.trim($(this).data('value') );

var id=$.trim($(this).data('value'));
if(!id) return toast('Id not found.');


var student_extra_profile_url='/' + cs_s + '/' + id + '/profile.txt';

 var sep_=__( BASE__[student_extra_profile_url]);

var data='<div class="center_div bg-white afdomain_div"> <div class="center_header">Affective domain</div>';
data+='<div class="center_text_div afdomain"> <table class="table table-bordered student_rating_table affective_domain_table"> </table> <div>';
data+='</div>';
displayData(data,{data_class:'.afdomain_div',osclose:true});

afdomains_('.affective_domain_table',sep_);
});

$('body').on('click','.psychomotor',function(){

var cs_s=CLASS_SELECTED;

var siblingKey=$.trim($(this).data('sibling-key'));

if(siblingKey){
 cs_s=$(this).data('sibling-class');
 var BASE__=window['SIBLING__' + siblingKey];

} else{
 var BASE__=TDATABASE__;
}

var id=$.trim($(this).data('value'));

if(!id) return toast('Id not found.');

var student_extra_profile_url='/' + cs_s + '/' + id + '/profile.txt';

 var sep_=__( BASE__[student_extra_profile_url]);

var data='<div class="center_div bg-white psychomotor_div"><div class="center_header">Psychomotor</div> ';
data+='<div class="center_text_div afdomain"> <table class="table table-bordered student_rating_table psychomotor_table"> </table> <div>';
data+='</div>';
displayData(data,{data_class:'.psychomotor_div',osclose:true});

psymotors_('.psychomotor_table',sep_);
});


$('body').on('click','.personal_inbox',function(){
var d=$(this);
var pi_gen=$('.pi_gen');
pi_gen.removeClass('btn-primary').addClass('btn-light');
d.addClass('btn-primary').removeClass('btn-light');

var cs_s=CLASS_SELECTED;

var siblingKey=$.trim(d.data('sibling-key'));

if(siblingKey){
 cs_s=$.trim(d.data('sibling-class'));
 var BASE__=window['SIBLING__' + siblingKey];

} else{
 var BASE__=TDATABASE__;
}

var id=$.trim($(this).data('value'));

if(!id) return toast('Id not found.');

var personal_inbox_url='/' + cs_s + '/' + id + '/inbox.txt';

 var mfile=__( BASE__[personal_inbox_url]);

if(d.hasClass('check')){
  getInbox(mfile,id,true,cs_s);
return;
}

var div='<div class="center_div inbox-student-div" style="min-height: 55vh; max-height: 55vh; background: #fff; border-radius:0;">';
   div+='<div class="center_header bg-light text-left">';
    div+='<div class="inbox-student-name" style="position: relative; margin-left: 10px; padding-top: 8px;"><img src="' + _SITE_URL_ + '/images/chat_grey.png" style="height: 20px;"> Inbox <span style="position: absolute; top:0; right: 0;"> <button class="btn btn-sm btn-primary personal_inbox pi_gen" data-sibling-key="' + siblingKey + '" data-sibling-class="' + cs_s + '" data-value="' + id + '" style="border-radius:0;">Personal</button><button class="btn btn-sm btn-light class_inbox pi_gen" data-sibling-key="' + siblingKey + '" data-sibling-class="' + cs_s + '" data-value="' + id + '" data-type="2" style="border-radius:0;">Class inbox</button></span></div>';
   div+='</div>';
   div+='<div class="center_text_div bg-white inbox" style="margin-top: 55px; max-height: calc(55vh - 60px); border-radius: 0;"></div>';
   div+='<div class="center_footer_div text-right d-none"></div>';
   div+='<div class="total-inbox d-none">0</div>';
   div+='</div>';
   
   displayData(div,{pos:'30',data_class:'.inbox-student-div',osclose:true});
   $('.inbox').html( getInbox(mfile,id) );

var uniq=sessionStorage.getItem('unique_message_id_' + id);

if(uniq){
 var diff=uniq.split(',');

$.each(diff,function(i,v){
 var ind=$('.indicator_' + v);
ind.css({'font-weight':'bold','font-size':'16px'});
  });
sessionStorage.removeItem('unique_message_id_' + id);
}


});


$('body').on('click','.class_inbox',function(){
var d=$(this);
var cs_s=CLASS_SELECTED;
var pi_gen=$('.pi_gen');
pi_gen.removeClass('btn-primary').addClass('btn-light');
d.addClass('btn-primary').removeClass('btn-light');

var siblingKey=$.trim(d.data('sibling-key'));

if(siblingKey){
 cs_s=$.trim(d.data('sibling-class'));
 var BASE__=window['SIBLING__' + siblingKey];

} else{
 var BASE__=TDATABASE__;
}

var id=cs_s;

if(!id) return toast('Id not found.');

var personal_inbox_url='/' + cs_s + '/inbox.txt';

var mfile=__( BASE__[personal_inbox_url]);


if(d.hasClass('check')||d.hasClass('check2') ){
  getInbox(mfile,id,true,cs_s);
return;
}

$('.inbox').html( getInbox(mfile,id,false,cs_s) );

var uniq=sessionStorage.getItem('unique_message_id_' + id);

if(uniq){
 var diff=uniq.split(',');

$.each(diff,function(i,v){
 var ind=$('.indicator_' + v);
ind.css({'font-weight':'bold','font-size':'16px'});
  });
sessionStorage.removeItem('unique_message_id_' + id);
}

});

//teacherQualification();
});

function checkNewInbox(id,mid,cls){
  var btn=$('.personal_inbox_' + id);
if(!btn.hasClass('check') && !btn.hasClass('check2') ) return;
 btn.removeClass('check');

 var imi=$.trim(localStorage.getItem('inbox_message_ids_' + id) );
if(imi) imi=imi.split(',');
 else imi=[];

 var diff=array_diff(mid,imi);
 var new_msg_count=diff.length;
 if(new_msg_count){ sessionStorage.setItem('unique_message_id_' + id,diff.toString())
 if(btn.hasClass('class_inbox') ){
 toast('<img src="' + _SITE_URL_ + '/images/chat_white.png" style="height: 13px;"> You have ' + new_msg_count + '  class inbox messages [ ' + cls.replace(/_/g,' ').toUpperCase() + ' ]',{pos: 40, type:'success'});
 }
}

 if(ISDEMO__) new_msg_count=5;

if(new_msg_count) btn.append('<span style="position: absolute; z-index: 10; right: -10px; display:inline-block; height: 20px; width: 20px; border:0; border-radius: 100%; background: #d9534f; color: #fff; font-weight:bold; text-align: center; box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.13);">' + new_msg_count + '</span>');

}

function getInbox(mfile,id,check,cls){
   mfile=$.trim(mfile).replace(/\n/g,'<br>');

try{
  if(!mfile){
 return '<div class="text-center" style="margin-top: 50px;">You have no message from your class teacher</div>';
  }

 var inbox=$.parseJSON(mfile);
  var data='';
  var total=inbox.length;
  $('.total-inbox').text(total);

var btn=$('.personal_inbox_' + id);

if(total<1 || (btn.hasClass('check') && total<1 ) ){
 btn.removeClass('check');
  return '<div class="text-center" style="margin-top: 50px;">You have no message from your class teacher</div>';
  }

var bgc=-1;
var mid=[];

  $.each(inbox.reverse(), function(i,val){
    bgc++;
  for(var key in val){
 if(val.hasOwnProperty(key)) {
    var msgid=key;
 mid.push(msgid);
  var v=val[msgid];
  v=v.split('@@[');
  var msg=$.trim(v[0]);
  var msgtime=$.trim(v[1]).replace(/]/g,'');
   data+='<div class="container-fluid"><div class="row ' + (bgc==1?' bg-white':' bg-light') + '">';

  data+='<div style="padding: 5px 10px 0 10px;" class="col-xs-12 col-sm-12"><div class="indicator_' + msgid + '">' + msg + '</div>';
  data+='<div class="text-center text-success" style="font-size: 10px; padding: 5px 0;"><b>' + msgtime + '</b></div>';
  data+='</div>';
  
  data+='</div></div>';
 }
  }
  if(bgc==1) bgc=-1;
 });

  checkNewInbox(id,mid,cls);

if(!check ){
 if(!ISDEMO__) {
 localStorage.setItem('inbox_message_ids_' + id, mid.toString() );
}
var btn=$('.personal_inbox_' + id + ' span');
btn.remove();

}
 return data;

}catch(e){
  toast('Couldn\'t fetch messages at this moment. ' + e,{pos:30});
}
  }


function loadIndicator(){
return '<div class="loading_indicator"><div><img src="' + _SITE_URL_ + '/images/loading.gif"></div></div>';
}

 //return '<div class="loading"><div class="loading_div"> <img src="' + _SITE_URL_ + '/images/loading.gif"></div></div>';


//LOGOUT


function logout(){
if(!confirm('Are you sure?')) return;
  $('.logout_indicator').fadeIn();
 var key;
setTimeout(function(){
  for (var i = 0; i < localStorage.length; i++) {
 key = localStorage.key(i); 
  //alert(key.length)
 if(key.length>58){
//alert(localStorage.getItem(key));
   localStorage.removeItem(key); 
  } 
}
 if(__INAPP){
  location.href=formatUrl(false,'logout.php','close1=' + randomString(10) );
}
 else{
 location.href='logout.php';
}
  },1000);
}
