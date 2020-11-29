var emtime;
var untime;
var euAjax;
var CSRF__=$('#csrf-token').attr('content');

$(function(){

$('body').on('click','.delete_teacher',function(){
 if(ISDEMO__) return toast('This is a demo.');

  if(!confirm('Confirm delete!')) return;
var d=$(this);
var im=$('.imenu');
  var spin=$('.delete_teacher_click_spin');
 var u=d.attr('data-username');
 d.addClass('disabled');
 spin.removeClass('d-none');

 setTimeout(function(){
   euAjax=$.ajax({
      url: 'AJAX-PHP/delete_teacher.php',
      type: 'POST',
      data: {
     'csrf': CSRF__,
      	'delete_teacher' : 1,
      	'username' : u
   }
      }).done(function(data){
  spin.addClass('d-none');
  d.removeClass('disabled');
im.remove();
 if(data.match(/__LOGIN_REQUIRED__/)){
 toast('login required.');
 location.reload();
}else if(data.match(/__IS_DEMO__/)){
 return toast('This is a demo account.');
}
else if(data.match(/__SUCCESS__/) ){
toast('<i class="fa fa-trash"></i> Deleted successfully.',{type:'success'});

$('#tr_' + u).slideUp(function(){
  $('#tr_' + u).remove();
  });

}else if(data.match(/__FAILED__/) ){
 toast('Failed to delete.');
}else{
  toast('Unknown error occurred. Failed to delete.');
}
 
}).fail(function(){
  spin.addClass('d-none');
  d.removeClass('disabled');
toast('Check your internet connection.');
});
},1000);

  });

//LOCK/UNLOCK TEACHER

$('body').on('click','.lock_teacher',function(){

if(ISDEMO__) return toast('This is a demo.');

var d=$(this);
var im=$('.imenu');
  var spin=$('.lock_teacher_click_spin');
 var u=d.attr('data-username');
 d.addClass('disabled');
 var ls=d.attr('data-lock-status'); //lock status
 spin.removeClass('d-none');
 setTimeout(function(){
   euAjax=$.ajax({
      url: 'AJAX-PHP/lock_unlock_teacher.php',
      type: 'post',
      data: {
   'csrf': CSRF__,
      	'lock_teacher' : 1,
       'lock_status':ls,
      	'username' : u
   }
      }).done(function(data){
  spin.addClass('d-none');
  d.removeClass('disabled');
im.remove();
 if(data.match(/__LOGIN_REQUIRED__/)){
 toast('Login required.');
 location.reload();
}else
  if(data.match(/__LOCKED__/) ){
 $('.username_' +u).attr('data-lock-status',1);
toast('<i class="fa fa-lock"></i> Locked',{type:'success'});

$('.fullname_ls_' + u).removeClass('text-success fa-unlock').addClass('text-danger fa-lock');

  }
  else if(data.match(/__UNLOCKED__/) ){
$('.username_' +u).attr('data-lock-status',0);
toast('<i class="fa fa-unlock"></i> Unlocked',{type:'success'});
$('.fullname_ls_' + u).removeClass('text-danger fa-lock').addClass('text-success fa-unlock');

}else if(data.match(/__FAILED__/)){
 toast('Failed to change.');
}
 
}).fail(function(){
  spin.addClass('d-none');
  d.removeClass('disabled');
toast('Check your internet connection.');
});
},1500);
  });


//LOCK/UNLOCK ALL TEACHERS

$('body').on('click','.lock_all_teachers',function(){
if(ISDEMO__) return toast('This is a demo.');

var d=$(this);

 var ids=[];
  $('.person_container').each(function(){
     ids.push($(this).data('id'));
});
var im=$('.imenu');
 im.fadeOut(function(){
  $(this).remove();
  });

  var spin=d.children('.lock_all_teachers_click_spin');
 var lubtn=$('.lock_all_teachers');
 lubtn.attr('disabled','disabled');

 var ls=d.attr('data-lock-status'); //lock status

 spin.removeClass('d-none');
setTimeout(function(){
 if( ls==1 && $('.lock_indicator.fa-unlock').length<1 ){
 //If no unlocked teachers, there is no need querying the database
 spin.addClass('d-none');
lubtn.removeAttr('disabled');
  $('.individual_menu').attr('data-lock-status','0');
 return toast('<i class="fa fa-lock"></i> locked.',{type:'success'});
}
 else if( ls==0 && $('.lock_indicator.fa-lock').length<1)
{
spin.addClass('d-none');
lubtn.removeAttr('disabled');
  $('.individual_menu').attr('data-lock-status','1');

 return toast('<i class="fa fa-unlock"></i> Unocked.',{type:'success'});

}

   euAjax=$.ajax({
      url: 'AJAX-PHP/lock_unlock_teacher.php',
      type: 'post',
      data: {
   'csrf': CSRF__,
      	'lock_all_teachers' : 1,
       'lock_status':ls,
       'ids':ids
   }
      }).done(function(data){
 
  spin.addClass('d-none');
  lubtn.removeAttr('disabled');
 if(data.match(/__LOGIN_REQUIRED__/) ){
 toast('Login required.');
 location.href=_SITE_URL_+'/admin/login.php';
}else
  if(data.match(/__LOCKED__/) ){

toast('<i class="fa fa-lock"></i> Locked',{type:'success'});
$('.individual_menu').attr('data-lock-status','1');

$('.lock_indicator').removeClass('text-success fa-unlock').addClass('text-danger fa-lock');

}
  else if(data.match(/__UNLOCKED__/) ){
toast('<i class="fa fa-unlock"></i> Unlocked',{type:'success'});
$('.individual_menu').attr('data-lock-status','0');
$('.lock_indicator').removeClass('text-danger fa-lock').addClass('text-success fa-unlock');

}else if(data.match(/__FAILED__/)){
 toast('Failed to change.');
}else if(data.match(/(No id|too much)/))
{
 toast('Ids too much or less');
}
 
}).fail(function(){
  spin.addClass('d-none');
  lubtn.removeAttr('disabled');
toast('Check your internet connection.');
});
},700);

  });

$('body').on('click','.approve_result',function(){

if(ISDEMO__) return toast('This is a demo.');

var d=$(this);
var im=$('.imenu');
  var spin=$('.approve_result_click_spin');
 var u=d.attr('data-username');
 d.addClass('disabled');
 var ras=d.attr('data-result-approval-status'); //lock status
 spin.removeClass('d-none');
 setTimeout(function(){
   euAjax=$.ajax({
      url: 'AJAX-PHP/approve_unapprove_results.php',
      type: 'post',
      data: {
   'csrf': CSRF__,
      	'approve_result' : 1,
       'approve_status':ras,
      	'username' : u
   }
      }).done(function(data){
  spin.addClass('d-none');
  d.removeClass('disabled');
im.remove();
 if(data.match(/__LOGIN_REQUIRED__/)){
 toast('Login required.');
 location.href=_SITE_URL_+'/admin/login.php';
}else
  if(data.match(/__UNAPPROVED__/) ){
 $('.username_' +u).attr('data-result-approval-status',0);
toast('<i class="fa fa-times"></i> Unapproved.',{type:'success'});

$('.fullname_ras_' + u).removeClass('fa-check text-success').addClass('text-danger fa-times');
  }
  else if(data.match(/__APPROVED__/) ){
$('.username_' +u ).attr('data-result-approval-status',1);
toast('<i class="fa fa-check"></i> Approved.',{type:'success'});

$('.fullname_ras_' + u).removeClass('fa-times text-danger').addClass('text-success fa-check');

}else if(data.match(/__FAILED__/)){
 toast('Failed to change.');
}
 
}).fail(function(){
  spin.addClass('d-none');
  d.removeClass('disabled');
toast('Check your internet connection.');
});
},1500);


  });

//APPROVE ALL RESULTS
$('body').on('click','.approve_all_results',function(){

if(ISDEMO__) return toast('This is a demo.');

var d=$(this);

 var ids=[];
  $('.person_container').each(function(){
     ids.push($(this).data('id'));
});
var im=$('.imenu');
 im.fadeOut(function(){
  $(this).remove();
  });

  var spin=d.children('.approve_all_results_click_spin');
 var lubtn=$('.approve_all_results');
 lubtn.attr('disabled','disabled');

 var ras=d.attr('data-approve-status');

 spin.removeClass('d-none');

setTimeout(function(){
 if( ras==0 && $('.approve_results_indicator.fa-check').length<1 ){

//If no locked teachers, there is no need querying the database
 spin.addClass('d-none');
lubtn.removeAttr('disabled');
//  $('.individual_menu').attr('data-lock-status','0');
 return toast('<i class="fa fa-times"></i> All results unapproved.',{type:'success'});
}
 else if( ras==1 && $('.approve_results_indicator.fa-times').length<1)
{
spin.addClass('d-none');
lubtn.removeAttr('disabled');
 // $('.individual_menu').attr('data-lock-status','1');

 return toast('<i class="fa fa-check"></i>All results approved.',{type:'success'});
}

   euAjax=$.ajax({
      url: 'AJAX-PHP/approve_unapprove_results.php',
      type: 'post',
      data: {
   'csrf': CSRF__,
      	'approve_all_results' : 1,
       'approve_status':ras,
       'ids':ids
   }
      }).done(function(data){
 //alert(data)
  spin.addClass('d-none');
  lubtn.removeAttr('disabled');
 if(data.match(/__LOGIN_REQUIRED__/) ){
 toast('Login required.');
 location.href=_SITE_URL_+'/admin/login.php';
}else
  if(data.match(/__UNAPPROVED__/) ){

toast('<i class="fa fa-times"></i> All results unapproved.',{type:'success'});
//$('.individual_menu').attr('data-lock-status','1');

$('.approve_results_indicator').removeClass('text-success fa-check').addClass('text-danger fa-times');

}
  else if(data.match(/__APPROVED__/) ){
toast('<i class="fa fa-check"></i> All results approved.',{type:'success'});
//$('.individual_menu').attr('data-lock-status','0');
$('.approve_results_indicator').removeClass('text-danger fa-times').addClass('text-success fa-check');

}else if(data.match(/__FAILED__/)){
 toast('Failed to change.');
}else if(data.match(/(No id|too much)/))
{
 toast('Ids too much or less');
}
 
}).fail(function(){
  spin.addClass('d-none');
  lubtn.removeAttr('disabled');
toast('Check your internet connection.');
});

},700);

  });







$('body').on('input','#teacher_email,#edit_teacher_email',function(){
  if(ISDEMO__) return;
$('.email_response').empty();

  if(emtime){  clearTimeout(emtime); }
var email = $.trim($(this).val());
 if(!email ||email.length<5) return;

 var prev=$.trim($('#prev_teacher_email').val() );

if(prev && prev.toLowerCase()==email.toLowerCase() ) return;


emtime=setTimeout(function(){

 	euAjax=$.ajax({
      url: 'AJAX-PHP/username_email_check.php',
      type: 'post',
      data: {
  'csrf': CSRF__,
      	'teacher_email_check' : 1,
      	'teacher_email' : email
   }
      }).done(function(response){

if(response.match(/__LOGIN_REQUIRED__/)){
 toast('Login required.');
 location.reload();
return;
}else
 	if (response.match(/__TAKEN__/) ) {
   $('.email_response').html('<div class="alert-danger" style="font-size:13px;">Sorry. Email already taken.</div>');
  }else if (response.match(/__NOT_TAKEN__/) ) {
  $('.email_response').html('<i style="color:green; position: absolute; top:35px; margin-left:5px;" class="fa fa-check"> <i>');
  	}
else if (response.match(/__NOT_CORRECT__/) ) {
  $('.email_response').html('<div class="alert-danger" style="font-size:13px;">Incorrect email format</div>');
      	}

 	}).fail(function(e){
  toast('Check your network connection.');
});


},2000);

});


$('#teacher_username,#edit_teacher_username').on('input', function(){

if(ISDEMO__) return;
 if(untime){
  clearTimeout(untime);
 }

  $('.username_response').empty();

var username = $.trim($(this).val());
 
 if(!username||username.length<5 ) return;

var prev=$.trim($('#prev_teacher_username').val() );

if(prev && prev.toLowerCase()==username.toLowerCase() ){  
if(untime) clearTimeout(untime);
 $('.username_response').empty();
   return;
 }

untime=setTimeout(function(){

 	euAjax=$.ajax({
      url: 'AJAX-PHP/username_email_check.php',
      type: 'post',
      data: {
     'csrf':CSRF__,
      	'teacher_username_check' : 1,
      	'teacher_username' : username
   }
      }).done(function(response){

if(response.match(/__LOGIN_REQUIRED__/)){
 toast('Login required.');
 location.reload();
}else  if(response.match(/__NOT_CORRECT__/) ){  $('.username_response').html('<div class="alert-danger" style="font-size:13px;">invalid username. Alphanumerics allowed. Min: 5 chars, Max: 20 chars.</div>');
}else if (response.match(/__TAKEN__/) ) {
   $('.username_response').html('<div class="alert-danger" style="font-size: 13px;">Sorry. Username already taken</div>');
  }else if (response.match(/__NOT_TAKEN__/) ) {
 $('.username_response').html('<i style="color:green; position: absolute; top:35px; margin-left:5px;" class="fa fa-check"> </i>');
      	}
  	}).fail(function(e){
  toast('Check your network connection.');
  }); 
 },2000);
});


 $('body').on('click','.add_teacher_btn',function(e){
e.preventDefault();
if(ISDEMO__) return toast('This is a demo.');

var d=$(this);
var schoolname="";

if($('#school_name').length>0){
schoolname=$.trim($('#school_name').val());
 if(schoolname.length<1){

return toast('School name should not be empty');
  }
}


var schooladdress="";

if($('#school_address').length>0){
schooladdress=$.trim($('#school_address').val());
 if(schooladdress.length<1){

return toast('School address should not be empty');
  }
}

 var title=$.trim($('#teacher_title').val() );


 if(!title || !title.match(/(mr|mrs|miss)/)) {
 toast('Select teacher title');
return false;
}

var gender='male';
if(title=='mrs'||title=='miss') {
    gender='female';
}

 var name=$.trim($('#teacher_name').val() );

if(!name ||name.length>60){
toast('Enter teacher fullname. Min length: 4 chars, Max length: 60 chars');
 return false;

}else if(!name || !name.match(/^([a-z]{2,})+[ ]+([a-z ]{2,})+$/i) ){
 toast('Enter teacher fullname. Alphabets and spaces supported only. Min: 4 chars, Max: 60 chars');
 return false;
}

  var username=$.trim( $('#teacher_username').val() );

if(!username || !username.match(/^[a-z0-9]{5,20}$/i)) {
 toast('Choose a good username. Alphanumerics only. Min: 5 chars, Max: 20 chars.');
return false;
}


var email=$.trim($('#teacher_email').val() );


if(!email || email.length>100 || !validEmail(email)){

toast('Invalid email address.');
return false;
}

var phone=$.trim($('#teacher_phone').val() );

if(phone && !phone.match(/^[0-9+]{7,20}$/i)) {
 toast('Phone number not valid. Numbers and + only supported. Min: 7 chars, Max: 20 chars.');
return false;
}

 var password=$.trim($('#teacher_password').val());

if(!password || !password.match(/^[a-z0-9]{5,30}$/i)) {
 toast('Password not accepted. Alphanumerics only. Min: 5 chars, Max: 30 chars.');
return false;
}


  var ats=$('.add_teacher_spin');
 ats.show();
d.attr('disabled','disabled');

$.ajax({ url:'AJAX-PHP/add_teacher.php',

data: {
 "csrf": CSRF__,
  "add_teacher":"1",
  "school_name":"" + schoolname,
  "school_address":"" + schooladdress,
  "teacher_title":"" + title,
  "teacher_gender":"" + gender,
  "teacher_name": "" + name,
  "teacher_username": "" + username,
  "teacher_password": "" + password,
  "teacher_phone": "" + phone,
  "teacher_email":"" + email,
  "teacher_registered": moment().format('DD-MM-YYYY hh:mm:ss')
},
 dataType:'text',
  type:'POST'}).done( function(data){
//alert(data)
d.removeAttr('disabled');
  ats.hide();
if(data.match(/__LOGIN_REQUIRED__/)){
toast('Login required.');
  location.reload();
}else if(data.match(/__IS_DEMO__/)){
return toast('This is a demo');
}
else if(data.match(/__MAX_REACHED__/)){
 toast('You have reached the maximum number of teachers allowed. Contact us to upgrade.',{hide:4000});
} else

 if(data.match(/__SUCCESS__/i)){
  toast('Added succsssfully!',{type:'success'});
  sessionStorage.setItem('new_registered','yes');
$('.at_form').trigger('reset');
$('.email_response,.username_response').empty();
    return;
}
 else
{
  alert(data); toast('Fill all details correctly.',{hide: 4000});
   }
}).fail(function(e){
  d.removeAttr('disabled');
  toast('Could not add any teacher at the moment. Check your internet connection.',{hide:4000});
ats.hide();

});

 
});


$('body').on('click','.edit_teacher',function(e){
var d=$(this);
   d.addClass('disabled')
  var espin=$('.edit_user_click_spin');
  espin.removeClass('d-none');

var username=d.attr('data-username').toLowerCase();

  euAjax=$.ajax({
  url:'AJAX-PHP/edit_teacher.php',
  type:'POST',
 data:{
 'csrf': CSRF__,
  'teacher_username':username,
  'get_teacher_data':'1'
}
}).done(function(data){
 
d.removeClass('disabled');
espin.addClass('d-none');
  // alert(data)

if(data.match(/__LOGIN_REQUIRED__/)){

toast('Login required.');
  location.reload();
  return;
}
displayData(data,{data_class:'.edit_teacher_form',osclose:true});

}).fail(function(e){
d.removeClass('disabled');
espin.addClass('d-none')
 __ERR(1,e);
  });

  });

$('body').on('click','.edit_teacher_btn',function(e){
e.preventDefault();

if(ISDEMO__) return toast('This is a demo.');

var schoolname="";
var d=$(this);
var sup=false;

if($('#edit_teacher_school_name').length>0){
schoolname=$.trim($('#edit_teacher_school_name').val());
 if(schoolname.length<1){
return toast('School name should not be empty');
  }else if(schoolname.length>150){
 return toast('School name too long.');
  }
sup=true;
}

var schooladdress="";

if($('#edit_teacher_school_address').length>0){
schooladdress=$.trim($('#edit_teacher_school_address').val());
 if(schooladdress.length<1){
return toast('School address should not be empty');
return;
  }else if(schooladdress.length>200){
 return toast('School address too long');
}
sup=true;
}


var title=$.trim($('#edit_teacher_title').val() );
 if(!title || !title.match(/(mr|mrs|miss)/)) {
 toast('Select teacher title.');
return false;
}

var gender='male';
if(title=='mrs'||title=='miss') {
    gender='female';
}

 var name=$.trim($('#edit_teacher_name').val() );

if(!name ||name.length>60){
toast('Enter teacher fullname. Min length: 4 chars, Max length: 60 chars');
 return false;
}
name=name.replace(/\s+/,' ');

if(!name || !name.match(/^([a-z]{2,})+[ ]+([a-z ]{2,})+$/i) ){
 toast('Enter teacher fullname. Alphabets and spaces supported only. Min: 4 chars, Max: 60 chars');
 return false;
}

  var username=$.trim( $('#edit_teacher_username').val() );

if(!username || !username.match(/^[a-z0-9]{5,20}$/i)) {
 toast('Choose a good username. Alphanumerics only. Min: 5 chars, Max: 20 chars.');
return false;
}

username=strtolower(username);

var pusername=$.trim(strtolower($('#prev_teacher_username').val() ));

var email=$.trim($('#edit_teacher_email').val() );

if(!email || email.length>100 || !validEmail(email)){

  toast('Invalid email address.');
return false;
}
  
var teacher_school_id=$.trim($('#edit_teacher_id').val() );

 if(teacher_school_id && teacher_school_id.length>80) {
 toast('Teacher school id too long. Max: 80 chars.');
return false;
}

var teacher_school_q=$.trim($('#edit_teacher_qualifications').val() );
  //alert(teacher_school_q)
 if(teacher_school_q && teacher_school_q.length>100) {
 toast('Teacher qualifications too long. Max: 100 chars.');
return false;
}

var phone=$.trim($('#edit_teacher_phone').val() );

if(phone && !phone.match(/^[0-9+]{7,20}$/i)) {
 toast('Phone number not valid. Numbers and + only supported. Min: 7 chars, Max: 20 chars.');
return false;
}

 var password=$.trim($('#edit_teacher_password').val());

if( $('#edit_teacher_password').length>0 && (!password || !password.match(/^[a-z0-9]{5,30}$/i) ) ) {
 toast('Password not accepted. Alphanumerics only. Min: 5 chars, Max: 30 chars.');
return false;
}

  $('.edit_teacher_spin').show();
d.attr('disabled','disabled');
$.ajax({ url:'AJAX-PHP/edit_teacher.php',
data:$('.et_form').serialize() + '&csrf=' + CSRF__ + '&edit_teacher_gender=' + gender + '&edit=1',
 dataType:'text',
  type:'POST'}).done( function(data){
   //alert(data)
d.removeAttr('disabled');
$('.edit_teacher_spin').hide()
$('.email_response,.username_response').empty();

if(data.match(/__LOGIN_REQUIRED__/)){

toast('Login required.');
  location.reload();
return;
}else 
if(data.match(/__SUCCESS__/i)){
 $('.et_form').trigger('reset');
closeEditTeacherForm();

 toast('Updated successfully!',{type:'success'});

$('.teacher_schoolname').text(schoolname);
$('.fullname_' + pusername).text( ftoUpperCase(name)  + ' (' + ftoUpperCase(title) + ')').addClass('fullname_' + username);

$('.teacher_school_id_' + pusername).text(ftoUpperCase(teacher_school_id) );

$('.email_' + pusername).text(ftoUpperCase(email) );
$('.phone_' + pusername).text(phone||'No number');
$('.gender_' + pusername).text(ftoUpperCase(gender) );

$('.username_' + pusername).attr('data-username',"" + username);

if(pusername!=username) $('.username_' + pusername).addClass('username_' + username).removeClass('username_' + pusername);

var im=$('.imenu');
  im.remove();
  if(untime) clearTimeout(untime);
}
 else
{  
  toast(data,{hide: 4000});
 }
}).fail(function(e){
$('.edit_teacher_spin').hide()
d.removeAttr('disabled');
  toast('Could not update at the moment.',{hide:4000});
});

});

});

function closeEditTeacherForm(){
 closeDisplayData('.edit_teacher_form');

}
