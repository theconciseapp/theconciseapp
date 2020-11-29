var ajx;
var CSRF__=$('#csrf-token').attr('content');

function close_menu_btn(){
animateCSS('.first_column','slideOutRight faster',function(){
$('.first_column').addClass('hidden-xs');
  });

}

function close_school_avatar(){
var d=$('.c_enl_btn');
  d.unwrap().remove();
$('.school_name1').remove();
$('.this_avatar').addClass('school_avatar').removeClass('this_avatar');
$('.top_glass').hide();
closeDisplayData('.dummy');
}

function close_student_avatar(){

var d=$('.close_enlarge_student_avatar');
  applyScroll();
  d.unwrap();
  $('.p_enl_btn').remove();
 $('.this_avatar').addClass('students_avatar').removeClass('this_avatar');
}


$(function(){

$('.short_school_name').text( ftoUpperCase(schoolName().substr(0, 12) + '...') );
$('body').on('click','.menu_btn',function(){
$('.first_column').removeClass('hidden-xs');
animateCSS('.first_column','slideInRight faster');
displayData('<div class="menudummy"></div>',{data_class:'.menudummy',oszindex:'50',osclose:true,on_close:'close_menu_btn'});
  });

$('body').on('click','#drop-settings',function(){
  $('.drop-settings').animate({
  height:'toggle'
});
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

div+='<div class="center_header text-left" style="padding-left: 10px;"><i class="fa fa-info fa-lg"></i> About school <span class="about_school_count about_school_counter">2000</span></div>';

div+='<div class="center_text_div">';
div+='<textarea class="about_school_textarea">' + data + '</textarea><button style="position: absolute; bottom: 0; right: 0; border-radius:0;" class="btn btn-sm btn-primary about_school_btn">Save <i class="fa fa-spin fa-spinner save_about_click_spin" style="display:none;"></i></button>';
div+='</div></div>';

displayData(div, {data_class: '.about_school_div',osclose:true});

var len=3000-data.length;
var adiv=$('.about_school_counter');
adiv.text(len);
if(len<0){
 adiv.removeClass('about_school_count').addClass('about_school_count2');
}

}).fail(function(e){
d.removeAttr('disabled');
aspin.hide();
toast('Check your internet connection.');
});

});

$('body').on('input','.about_school_textarea',function(){
var d=$(this);
var max=3000;
var len=max-d.val().length;
var adiv=$('.about_school_counter');
adiv.text(len);

if(len<0){
adiv.removeClass('about_school_count').addClass('about_school_count2');
}else{
adiv.removeClass('about_school_count2').addClass('about_school_count')
}

});


$('body').on('click','.about_school_btn',function(){

if(ISDEMO__) return toast('This is a demo.');

var d=$(this);
var aspin=$('.save_about_click_spin');
  aspin.show();
d.attr('disabled','disabled');
var p=$.trim($('.about_school_textarea').val());
 p=p.replace(/[\r\n]+/g, '\n\n');

ajx=$.ajax({
url:'AJAX-PHP/about_school.php',
type:'POST',
 data:{
'csrf': CSRF__,
 'save_about_school':1,
 'about_school': p
  }
}).done(function(data){
aspin.hide();
 d.removeAttr('disabled');

if(data.match(/__LOGIN_REQUIRED__/) ){
 toast('Login required.');
 location.reload();
return;
}
else if(data.match(/__IS_DEMO__/)){
return toast('This is a demo account.');
}
else if(data.match(/__SUCCESS__/)){
 closeDisplayData('.about_school_div');
 return toast('Saved successfully.',{type:'success'});
  }
 return toast('Could not save.');
}).fail(function(e){
  toast('Check your internet connection.');
});

});


$('body').on('click','.login_teacher',function(){
 var d=$(this);
 var un=$.trim(d.data('username'));
 var teacher_name=$.trim(d.data('fullname'));
if(!un) return toast('Username not found.');
 var lspin=$('.login_click_spin');
  lspin.removeClass('d-none');
d.addClass('disabled');

ajx=$.ajax({
url:'AJAX-PHP/login_teacher.php',
type:'POST',
data:{
 'csrf': CSRF__,
 'username':un,
 'teacher_name':teacher_name
  }
}).done(function(data){
lspin.addClass('d-none');
 d.removeClass('disabled');

  if(data.match(/__EMPTY_USERNAME__/) ||data.match(/__EMPTY_NAME__/) ){
 return toast('Some parameters missing.');
}
 else if(data.match(/__LOGIN_REQUIRED__/)){
 toast('Login required.');
 location.reload();
 return;
}
 else if(data.match(/__NO_DATA__/)){
  return toast('No data has been submitted by the teacher yet.');
 }
 else if(data.match(/__SUCCESS__/ )){
$('.login_teacher_data').html(data);
}
else{
  toast('Unknown error occurred.');
 }
}).fail(function(e){
lspin.addClass('d-none');
d.removeClass('disabled');
 toast('Unable able to grant request at the moment. Check your internet connection.');
});

 });



$('body').on('click','.close_avatar_by_shadow,.enlarge_student_avatar',function(){
applyScroll();
 $('.enlarge_student_avatar').removeClass('enlarge_student_avatar').addClass('students_avatar');
$('.overshadow').removeClass('close_avatar_by_shadow')

});



$('body').on('click','.individual_menu',function(){
var d=$(this);
 var username=d.attr('data-username');
 var fullname=$('.fullname_' + username).text();
 var ls=+d.attr('data-lock-status'); //lock status
  var ras=+d.attr('data-result-approval-status'); 

  var im=$('.imenu');
 im.fadeOut(function(){
  $(this).remove();
  });

if($('.imenu_' + username).length>0){
  im.remove();
return;
}

var menu='<nav class="navbar bg-light" style="margin-bottom: 0;">';
  menu+='<div class="container-fluid">';
  menu+='<ul class="nav navbar-nav text-left">';
  menu+='<li class="nav-item"><a class="nav-link lock_teacher" data-username="' + username + '" data-lock-status="' + ls + '" href="javascript:void(0);"><i class="fa ' + (ls==0?'text-success fa-unlock':'text-danger fa-lock') + '"></i> ' + (ls==0?'Unlocked':'Locked') + ' <i class="d-none lock_teacher_click_spin fa fa-spinner fa-spin" aria-hidden="true">&nbsp;</i></a></li>'

  menu+='<li class="nav-item"><a class="nav-link approve_result" data-username="' + username + '" data-result-approval-status="' + ras + '" href="javascript:void(0);"><i class="fa ' + (ras==0?'text-danger fa-times':' text-success fa-check') + '"></i> ' + (ras==0?'Unapproved':'Approved') + ' <i class="d-none approve_result_click_spin fa fa-spinner fa-spin" aria-hidden="true">&nbsp;</i></a></li>';
  
menu+='<li><a class="nav-link edit_teacher" data-username="' + username + '" href="javascript:void(0);"><i class="fa fa-user"></i> Edit <i class="d-none edit_user_click_spin fa fa-spinner fa-spin" aria-hidden="true">&nbsp;</i></a></li>';

menu+='<li><a class="nav-link login_teacher" data-username="' + username + '" data-fullname="' + fullname  + '" href="javascript:void(0);"><i class="fa fa-sign-in"></i> Access <i class="d-none login_click_spin fa fa-spinner fa-spin" aria-hidden="true">&nbsp;</i></a></li>';

menu+='<li style="margin-top: 8px; border-top:1px solid #999;"><a class="nav-link delete_teacher" data-username="' + username + '" href="javascript:void(0);"><i class="fa fa-trash"></i> Delete <i class="d-none delete_teacher_click_spin fa fa-spinner fa-spin" aria-hidden="true">&nbsp;</i></a></li>';

 menu+='</ul></div></nav>';

 d.after('<div data-username="' + username + '" class="imenu imenu_' + username + ' bg-light" style="z-index: 10; display: block; width: 150px; position:absolute; right:3px; box-shadow: 1px 1px 1px 2px rgba(0,0,0,0.13); border-radius: 2px; padding: 0;">' + menu + '</div>');  
  });

});



function showTeacherForm(){
 $('.add_teacher_form').fadeIn()
displayData('<div class="dummydd"></div>',{data_class:'.dummydd',osclose:true,on_close:'closeAddTeacherForm'});

}

function closeAddTeacherForm(){

 $('.add_teacher_form').hide();
 closeDisplayData('.dummydd');
if(sessionStorage.getItem('new_registered')) __LOAD();
}

function loadTeachers(){

 var member_data=$.trim($('.members_data').text() );
 if(member_data.split('<br>').length<1){
   $('.main_table').html('No data');
$('.loading').fadeOut();
return false;
}
  
var member_file_object=$.csv.toObjects(member_data );
 
 var total_members=member_file_object.length;
 
 $('.total_members').text(total_members);

   // MAIN TABLE DATA 

 var main_data='<input class="search_box btn btn-light btn-sm d-block" style="position: relative; margin-bottom: 10px;" placeholder="Search teachers" />';

  // main_data+='<h5 style="margin-left: 10px;"><b>TEACHERS</b></h5>';

    var session_teachers_members_data='';
   var run=0;

  var ids=[];
  var totalPresent=0;
  var session_members_data='';

 for(var key in member_file_object) {
   
  run++;

    var data=member_file_object[key];
   var classes=data["classes"];
    var fullname=data['fullname'];
    var id=data['username'];
    ids.push(id);
   var password=data["password"];
   var title=data['title'];
   var gender=data['gender'];
   var super_status=data['super_status'];

  var ls=+data['lock_status']; //lock status
  var ras=+data['result_approval_status'];
    var member_id=data['member_id'];
    var phone=data['phone']||'No number';
    var email=data['email']||'No email';
    var photo=data['photo'];
 
var regDate=data['registered_on'] ? data['registered_on'] : '';

session_members_data+=id + '==' + fullname + '==' + gender + '==' + $.trim( member_id ) + '==' + phone + '==' + regDate;

 if ( run<total_members ){  
   session_members_data+='\n';
 }   

 var show_id='NO';
 var  member_name=fullname
 
   main_data+='<div class="container-fluid search_name long_select person_cont person_container" id="tr_' + id + '" data-id="'+id+'" style="background:#fff; border:0; border-radius: 4px; padding: 8px; box-shadow: 1px 1px 1px 2px rgba(0,0,0,.13); margin-bottom: 6px;">';

   main_data+='<div style="position: absolute; top:0; bottom:0; right:0; left: 0; z-index:10; background: none; display:none;" class="lsc_' +id +' long_select_cover"></div>';

var checked=' checked="checked"';

   main_data+='<div style="position: relative; background:#f7f7f7;">';

main_data+='<div class="row student_name_table"><div class="col-xs-2 text-center"><span class="upload_teacher_photo" style="padding:4px;" data-id="' + id + '"><i class="fa fa-camera fa-lg" style="background:#fff; border:0; border-radius:3px; color:steelblue;"></i></span></div><div class="col-xs-8 text-left"><div class="student_name"><span style="border:0; border-radius:3px;" class="fullname_' + id + '">' +  ftoUpperCase(member_name) + ' (' +  ftoUpperCase(title ) + ')</span> <span class="lock_indicator fullname_ls_' + id + ' fa ' + (ls==0?'fa-unlock text-success':'fa-lock text-danger' ) + '"></span> <span class="approve_results_indicator fullname_ras_' + id + ' fa ' + (ras==0?'fa-times text-danger':'fa-check text-success') + '"></span></div></div><div class="col-xs-2 text-center">';
  
main_data+='<div data-result-approval-status="' + ras + '" data-lock-status="' + ls + '" data-username="' + id + '" class="individual_menu username_' + id + '"><i class="fa fa-bars" aria-hidden="true"></i></div></div></div>';

main_data+='</div>';

  main_data+='<div class="container" style="padding:0; width:100%;">';

     main_data+='<table class="table" style="margin:0; width:100%;"><tr><td style="width: 30%; padding:0; position: relative;">'; 
   
 main_data+=' <div class="student_avatar_container"><img class="teacher_photo_' + id + ' students_avatar" src="' + photo + '" onerror="imgError(this,\'' + _MALE_AVATAR_URL_ + '\');" data-id="' + id + '"></div>';

  main_data+='</td><td style="padding:0; vertical-align:middle;">';

main_data+='<table class="table table_student_details" style="margin:0; vertical-align:middle;">';

  main_data+='<tr><td class="td_pad_5">Staff ID</td><td class="td_pad_5 teacher_school_id_' + id + '" style="">' + ftoUpperCase(member_id) + '</td></tr>';

main_data+='<tr><td class="td_pad_5">Gender</td><td class="td_pad_5 gender_' + id + '">' + ftoUpperCase(gender) + '</td></tr>';


main_data+='<tr><td class="td_pad_5">Email</td><td class="td_pad_5 email_' + id + '">' + ftoUpperCase(email) + '</td></tr>';

main_data+='<tr><td class="td_pad_5">Phone</td><td class="td_pad_5 phone_' + id + '">' + phone + '</td></tr>';

main_data+='</table>';
 main_data+='</td>';

main_data+='</tr>';
 main_data+='</table>';

main_data+='<div style="width:100%; overflow-x:auto; white-space:nowrap;">';

/*
if(classes){
  var classes_=classes.split('||');
     classes_.pop();
   classes_=classes_.sort();
   for( var i_=0; i_<(classes_.length);i_++){
  var class_=classes_[i_].toLowerCase();
if( class_ && class_!='first-class')
main_data+='<button data-value="' + id + '" class="view_result student_btn btn btn-sm btn-secondary"><i class="fa fa-book" aria-hidden="true"></i>&nbsp;' + classes_[i_].toUpperCase().replace(/_/g,' ') + '</button>';
 }
}
*/
  main_data+='</div></div></div>'; 

}

 //localStorage.setItem('school_teaches_data',session_teachers_members_data);


 $('.main_table').html(main_data);
divSorter('.main_table')

setTimeout(function(){
 $('.loading').fadeOut();
  },500);

}



function __LOAD(){  
  sessionStorage.removeItem('new_registered');
$.ajax({ url:'AJAX-PHP/index_data.php',
  type:'POST',
  dataType:'text',
  data:{
 'token': TOKEN__ 
  }
}).done(function(data){
  //alert(data)
if(data.match(/__LOGIN_REQUIRED__/i)){
  //$('.main_table').html('<div class="alert alert-warning">Login required.</div>');
location.href=_SITE_URL_ + '/admin/login.php';
  //$('.loading').fadeOut();
 return;
}else if(data.match(/__NO_TEACHER__/i) ){
  $('.main_table').html('<div class="alert alert-warning">You haven\'t added any teacher.</div>');
  $('.loading').fadeOut();
 return;
}

$('.members_data').html($(data).find('#members_data').text());

 loadTeachers();


}).fail(function(){
 $('.loading').fadeOut();
 toast('Couldn\'t load! Please check your internet connection');

});


}

$(function(){
 
$('body').on('click','.update_school_data_form',function(){
var d=$(this);
   d.attr('disabled','disabled');
  var espin=$('.update_school_click_spin');
  espin.show();
 

  euAjax=$.ajax({
  url:'AJAX-PHP/update_school_data.php',
  type:'POST',
 data:{
  'csrf':CSRF__,
  'get_school_data':'1'
}
}).done(function(data){
  //alert(data)
d.removeAttr('disabled')
espin.hide();

if(data.match(/__LOGIN_REQUIRED__/)){
 toast('Login required.');
 location.href=_SITE_URL_ + '/admin/login.php';
return;
}

displayData(data,{data_class:'.update_school_data_div',osclose:true,on_close: 'closeUpdateSchoolForm' });

}).fail(function(e){
d.removeAttr('disabled');
espin.hide();
 __ERR(1,e);
  });

  });



//UPDATE SCHOOL DATA

$('body').on('click','.update_school_btn',function(e){
e.preventDefault();
if(ISDEMO__) return toast('This is a demo.');

 var name=$.trim($('#edit_school_name').val() );

if(!name ||name.length>80){
toast('Enter teacher fullname. Min length: 4 chars, Max length: 80 chars');
 return false;
}
name=name.replace(/\s+/,' ');

if(!name || !name.match(/^([a-z0-9]{2,})+[ ]+([a-z0-9&'_() :;-]{2,})+$/i) ){
 toast('School name contains unsupported characters.');
 return false;
}

  var username=$.trim( $('#edit_school_username').val() );

if(!username || !username.match(/^[a-z]+[a-z0-9]{4,20}$/i)) {
 toast('Choose a good username. Username should start with an alphabet letter. Alphanumerics supported only. Min: 5 chars, Max: 20 chars.');
return false;
}

username=strtolower(username);

var email=$.trim($('#edit_school_email').val() );

if(!email || email.length>100 || !validEmail(email)){

  toast('Invalid email address.');
return false;
}
  

var school_alias=$.trim($('#edit_school_alias').val() );

 if(!school_alias || !school_alias.match(/^[a-z]+[a-z0-9]{4,20}$/i)) {
 toast('Choose a good school alias. Alias should start with an alphabet letter. Alphanumerics supported only. Min: 5 chars, Max: 20 chars.');
return false;
}

var phone=$.trim($('#edit_school_phone').val() );

if(phone && !phone.match(/^[0-9+]{7,20}$/i)) {
 toast('Phone number not valid. Numbers and + only supported. Min: 7 chars, Max: 20 chars.');
return false;
}

 
 var password=$.trim($('#password').val());

if(!password || !password.match(/^[a-z0-9]{5,30}$/i)) {
 toast('Invalid password.');
return false;
}

  var uspin=$('.edit_school_spin');
uspin.show();

$.ajax({ url:'AJAX-PHP/update_school_data.php',
data:$('#update_school_form').serialize() + '&csrf=' + CSRF__ + '&update_school=1',
 dataType:'text',
  type:'POST'}).done( function(data){
   //alert(data)
   uspin.hide()
$('.semail_response,.susername_response').empty();

if(data.match(/__LOGIN_REQUIRED__/)){
 toast('Login required.');
 location.reload();
return;
} else if(data.match(/__INVALID_PASSWORD__/)){
return toast('Invalid password.');
}
else if(data.match(/__EMAIL_TAKEN__/)){
 return toast('Email address already in use.');
}

else if(data.match(/__USERNAME_TAKEN__/)){
 return toast('Username already in use.');
}

else if(data.match(/__SUCCESS_RELOAD__/)){
  toast('Updated successfully!',{type:'success'});
 location.reload();
    }else
if(data.match(/__SUCCESS__/i)){
 $('#update_school_form').trigger('reset');
closeUpdateSchoolForm();
 toast('Updated successfully!',{type:'success'});
}
 else
{  
  toast('Could not update at the moment.',{hide: 4000});
 }
}).fail(function(e){
   uspin.hide()
  toast('Could not update at the moment. Chdck your internet connection.',{hide:4000});
});

});


$('body').on('click','.more_settings',function(){
var spin=$('.more_settings_click_spin');
spin.show();
  ajx=$.ajax({
 url:'AJAX-PHP/school_settings.php',
 type: 'POST',
data:{
 'csrf':CSRF__,
 'get_more_settings':'1'
}
}).done(function(data){
spin.hide();

if(data.match(/__LOGIN_REQUIRED__/)){
 toast('Login required.');
 location.reload();
return;
}
  displayData(data,{data_class:'.school_settings_div',osclose:true,oszindex:500});
 }).fail(function(e){
spin.hide();
 toast('Check your internet connection and try again.');
 });
});

$('body').on('click','.save_more_settings',function(){
if(ISDEMO__) return toast('This is a demo.');
var ap=$.trim($('#allow_print').val());
var et=$.trim($('#etemplate').val());

var spin=$('.more_settings_save_spin');
  spin.show();

  ajx=$.ajax({
 url:'AJAX-PHP/school_settings.php',
type:'POST',
data:{
 'csrf' : CSRF__,
 'save_more_settings': 1,
 'allow_print':ap,
 'etemplate':et 
}
}).done(function(data){
spin.hide();
  if(data.match(/__LOGIN_REQUIRED__/)){
 toast('Login required.');
 location.reload();
return;
}
else if(data.match(/__SUCCESS__/) ){
  toast('Saved successfully',{type:'success'});
 closeDisplayData('.school_settings_div');
}
 }).fail(function(e){
spin.hide();
 toast('Unknown error occured, please try again.');
 });
});


});

function closeUpdateSchoolForm(){
$('.semail_response,.susername_response').empty();
 $('.update_school_form').hide();
 closeDisplayData('.update_school_data_div');

}

function logout(){
  if(!confirm('Confirm logout!')) return;
  $('.logout_indicator').fadeIn();
setTimeout(function(){
   var key;
  for (var i = 0; i < localStorage.length; i++) {
 key = localStorage.key(i);
//alert(key)
//LSK is actually 50 chars long
 if(key.length>45 && key.length<59){
   localStorage.removeItem(key); 
  }
}

location.href='logout.php';
 },1000);
}
