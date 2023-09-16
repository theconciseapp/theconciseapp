function settingsSwitch(){
  var show_lastseen=localStorage.getItem(username +'_show_lastseen');
if(!show_lastseen){
  localStorage.setItem( username +'_show_lastseen','YES');
 show_lastseen='YES';
}

var stop_incoming_messages=localStorage.getItem(username + '_stop_incoming_messages');

$('#show_lastseen').btnSwitch({
    OnValue: 'YES',
    Theme: 'Light',
    ToggleState: show_lastseen,
    OnCallback: function(val) {
  localStorage.setItem(username + '_show_lastseen',val);
    },
    OffValue: 'NO',
    OffCallback: function (val) {
      localStorage.setItem(username + '_show_lastseen',val);
    }
});

$('#stop_incoming_messages').btnSwitch({
    OnValue: 'YES',
    Theme: 'Light',
    ToggleState: stop_incoming_messages,
    OnCallback: function(val) {
  localStorage.setItem(username + '_stop_incoming_messages',val);   
;
    },
    OffValue: 'NO',
    OffCallback: function (val) {
      localStorage.setItem(username + '_stop_incoming_messages',val);
    }
});
 
}



function showLastSeen(){
  if( localStorage.getItem( username +'_show_lastseen')=='YES')
    return username;
  else
    return false;
  }
  
  
function stopIncomingMessages(){
  if( localStorage.getItem(username +'_stop_incoming_messages')=='YES')
    return true;
  else
    return false;
  }

function fill_update_profile_form(){
  var pfile=new android.File(MAIN_FOLDER, username + '/profile.txt');
  var data=$.trim( pfile.read() );
      data= JSON.parse( data);
   $('#change-display-name-box').val( data.fullname);
   $('#change-email-box').val( data.email);
   $('#change-phone-box').val( data.phone);  
}

  
$(function(){
  
  settingsSwitch();
  
  
  $('body').on('click','.view-settings',function(){
   var this_=$(this);
    if(this_.hasClass('loaded') ) return;
   this_.prop('disabled',true);
    
   $.ajax({
      url:'file:///android_asset/settings.html'
    }).done(function(result ){
      $('#settings-content').html(result);
   
     if(MS__==='m'){
       $("#logout-btn").removeClass("d-none");
   }
    setTimeout(function(){
      settingsSwitch();
     fill_update_profile_form();
    },100);
      this_.addClass('loaded');
      this_.prop('disabled', false);
    }).fail(function(e){
     this_.prop('disabled', false);
     toast( JSON.stringify(e));
   });
    
  });
  
  $('body').on('click','.settings-edit-btn',function(){
     var form=$(this).data('form');
    $('.settings-form:not(#'+ form + ')').hide();
    if( form=='show-cppf'){
      if(!localStorage.getItem(username + '_privacy_pin')){
        $('#no-privacy-pin-yet').css('display','none');
      }
    }
    var box=$('#' + form);
    if(box.is(':visible')){
    box.slideUp();
    }else{
      box.slideDown();
    }
  });
  
  
  $('body').on('click','#change-password-btn',function(e){
e.preventDefault();

var resultDiv=$('#change-password-result');
 resultDiv.empty();

 var opbox=$('#old-password-box');
 var pbox=$('#change-password-box');
 var opw=$.trim(opbox.val());
 var pw=$.trim( pbox.val() );

if( !opw||opw.length<6||opw.length>50){
  toast('Old password should contain at least 6 characters. Max: 50.');
 return;
}
else
if( !pw||pw.length<6||pw.length>50){
 toast('New password should contain at least 6 characters. Max: 50.');
 return;
}
 else if( !validPassword(pw) ){
 toast('Passwords can only contain these characters: a-z 0-9 ~@#%_+*?-');
 return;
}

var this_=$(this);
  this_.prop('disabled',true);
  buttonSpinner( this_);

$.ajax({
  url: config_.domain + '/oc-ajax/change-password.php',
  type:'POST',
dataType:'json',
  data: {
  'version': config_.APP_VERSION,
  'username': username,
  'old_password': opw,
  'new_password': pw,
  'token': __TOKEN__,
 }
}).done(function( result ){
  buttonSpinner( this_,true);
 this_.prop('disabled',false);
  
  if( result.status){
  toast(result.result,{type:'success'});
   pbox.val('');
   opbox.val('');
  }else if(result.error){
  toast(result.error);
}else{
   toast('Password could not be changed.');
  }
}).fail(function(e,txt, xhr){
  buttonSpinner( this_,true);
this_.prop('disabled',false);
  toast('Check your internet connection. ' + xhr);
 //alert(JSON.stringify(e) );
  });
 });
  
  
  $('body').on('click','#update-profile-btn',function(e){
e.preventDefault();

 var pwbox=$('#upassword-box');
 var dnbox=$('#change-display-name-box');
 var ebox=$('#change-email-box');
 var pbox=$('#change-phone-box');
  
 var pw=$.trim(pwbox.val());
 var new_email=$.trim( ebox.val() );
 var new_name=$.trim( dnbox.val());
 var new_phone=$.trim( pbox.val());
    
if( !new_name||new_name.length<2||new_name.length>60){
 toast('Enter a good name. At least two characters.');
 return;
}
   else if(!validName(new_name) ){
  return toast('Enter a good name.');
 }
    else  if( !new_email||new_email.length<5||new_email.length>100){
 toast('Invalid email address.');
 return;
}

 else if( !new_phone||new_phone.length<5||new_phone.length>30){
 toast('Invalid phone number.');
 return;
}
 else if (!new_phone.match(/^[0-9() +-]+$/)){
   toast('Invalid phone number.');
 return;   
    }       
else if( !pw||pw.length<6||pw.length>50){
  toast('Invalid password.');
 return;
}
  else if( !validPassword(pw ) ){
 toast('Invalid password.');
 return;
}
    
  var pfile=new android.File(MAIN_FOLDER,username + '/profile.txt');
  var pdata=$.trim(pfile.read() );
   
    pdata= JSON.parse( pdata);
    
  var pe=$('#profile-email');
  var pf=$('#profile-fullname');
  var pp=$('#profile-phone');
  
    
var this_=$(this);
  this_.prop('disabled',true);
  buttonSpinner( this_);

$.ajax({
  url: config_.domain + '/oc-ajax/update-profile.php',
  type:'POST',
dataType:'json',
  data: {
  'version': config_.APP_VERSION,
  'username': username,
  'new_name': new_name,
  'new_email': new_email,
  'new_phone': new_phone,
  'password': pw,
  'token': __TOKEN__,
 }
}).done(function( result ){
  buttonSpinner( this_,true);
 this_.prop('disabled',false);
  pwbox.val('');
  if( result.result){
  
   try{
   
   var pfile=new android.File( MAIN_FOLDER, username + '/profile.txt');
   var data=result.result;
   
  if( pfile.write( JSON.stringify(data) )){
   
   pf.text(data.fullname);
   pe.val(data.email);
   pp.val(data.phone);
   
  localStorage.setItem('email', data.email);
  localStorage.setItem('fullname', data.fullname);
  localStorage.setItem('phone', data.phone);
 
  toast('Profile updated.',{type:'success'});
 }else{
    toast('Fail to save to device.',{type:'danger'});
 }
          
 }catch(e){   toast(e); }
  
}else if(result.no_changes){
  toast( result.no_changes, {type:'light','color':'#333'});
}
 else if(result.error){
  toast(result.error);
}else{
   toast('Could not be updated.');
  }
}).fail(function(e,txt, xhr){
  buttonSpinner( this_,true);
this_.prop('disabled',false);
  toast('Check your internet connection. ' + xhr);
 //alert(JSON.stringify(e) );
  });
 });
  
  
 $('body').on('click','#change-privacy-pin-btn',function(e){
e.preventDefault();

 var opbox=$('#old-privacy-pin-box');
 var pbox=$('#change-privacy-pin-box');
 var opw=$.trim(opbox.val());
 var pw=$.trim( pbox.val() );
   
 var old_pass=localStorage.getItem(username + '_privacy_pin');
 if(!old_pass ) {
   old_pass="1234";
   opw="1234";
 }
   
if( !opw||opw.length!=4||opw!=old_pass){
  toast('Invalid old privacy pin.');
 return;
}
else if( !pw||pw.length!=4|| !pw.match(/^[0-9]+$/i) ){
 toast('Enter 4 characters. Numbers only.');
 return;
}

    localStorage.setItem(username + '_privacy_pin', pw);
  $('#no-privacy-pin-yet').css('display','block');
  toast('Privacy pin set.',{type:'success'});
   pbox.val('');
   opbox.val('');

 });
   
  
  
  
});


  