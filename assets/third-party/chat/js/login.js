
/*
if(!hasPermission()){
 setTimeout(function(){
   requestPermission();
 },2000);
}

*/

localStorage.removeItem('reload_friend_thumbnails');
localStorage.removeItem('rft_check');

function switchForm( btn, callback){
  $('.' + btn + ', #verify-code-form').hide();
  $('.submit-btn').toggleClass('login-btn register-btn');

 if( btn=='btn-show-register-form'){
    $('.btn-show-login-form').show();
    $('.forgot-password-link').hide();
    $('.register-form').slideDown('fast');
  }
  else{
    $('.btn-show-register-form,.forgot-password-link').show();
    $('.register-form').slideUp('fast');
    $('#login-register-panel').slideDown('fast')
   }
  
  if( typeof callback=='function'){
    callback();
  }
}

function inGroups(username_, gpin){
  var groups=$.trim(localStorage.getItem( SITE_UNIQUE__ + "_" + username_ + '_groups'))||"";

 if( !groups  ) return false;
  groups=strtolower(groups).split(' '); 
  gpin=strtolower( $.trim(gpin) );
 if( $.inArray( gpin, groups )>-1)
  return true;
  else return false;
}


function showEmailVerificationForm( email){
 $('.form-page').css('display','none');
 $('#verification-email').val(email);
  $('#vemail-form-container').fadeIn();
  
}


function save_login_profile( user, fullname, email, phone, country,bio,birth,joined){
 
var pfile=new android.File( MAIN_FOLDER, user + '/USERS-PROFILES/' + user + '.txt');
  try{
   var p=new Object();
   p.fullname=fullname;
   p.email=email;
   p.phone=phone;
   p.country=country;
   p.bio=bio;
   p.birth=birth;
   p.joined=joined;
  var save= JSON.stringify( p);
   pfile.write( save);
 }catch(e){}
  
}


$(function(){
   $('#login-form-container').css('display','block');
 
 $('body').on('click','.form-page-switch',function(){
 var page=$(this).attr('data-page');
   if(!page) return toast('Page not found.');
  $('.form-page').css('display','none');
  $('#' + page).fadeIn();
 });
  
  
  $('body').on('input','.username,.email',function(){
 var this_=$(this);
  if($('.register-btn').length){
   var data=this_.val();
    if(data.length<4||this_.length>30) return;
   }
   });
  

$('body').on('click','.login-btn',function(){   

    $('.input-error').empty();
    
    var username_= $.trim($('#login-pin').val());
    var password=$.trim($('#login-password').val());
    var captcha=$.trim( $('#login-captcha').val());
 var err='';
    if( username_.length<4 ||isGroupPage(username_) ) {
      android.toast.show('Enter a valid username.');
    return;
    }
 else if(password.length<6 || password.length>50) {
     android.toast.show('Enter a valid password.');
 
   return;
 }
  else if( !validPassword(password) ){
    android.toast.show('Enter a valid password.');
 }
 
  username_=strtolower(username_);
       
   var loader=$('.loader');
    loader.css('display','inline-block');
   var form= $('input, button');
    form.prop('disabled',true);
   var fresh_login=""; 
    
 var groups=localStorage.getItem( username_ + '_groups')||"";
      
if( !inGroups( username_, 'gv_pofficials') ){ 
     fresh_login=1;
  localStorage.removeItem( SITE_UNIQUE__ + "_gv_pofficials_" + username_ + "_last_msg_id");
 }

var last_private_mid =localStorage.getItem( SITE_UNIQUE__ + "_" + username_ + "_last_private_message_id")||"";
var last_official_mid=localStorage.getItem( SITE_UNIQUE__ + "_gv_pofficials_" + username_ + "_last_msg_id")||"";

 //var last_login=+localStorage.getItem('last_login_' + username_); //Unix timestamp
 
 setTimeout(function(){
    $.ajax({
      'url': config_.domain + '/oc-register/login.php',
   'dataType':'json',
      'data':{
       "username": username_,
       "password": password,
       "captcha": captcha,
       "fresh_login": fresh_login,
       "last_private_mid": last_private_mid,
       "last_official_mid": last_official_mid, 
       "version": config_.APP_VERSION,
      },
      type:'POST'
    }).done(function(result){
      //alert( JSON.stringify(result))
      loader.css('display','none');
    form.prop('disabled',false);
 localStorage.setItem('CONF_DOMAIN_', DOM____ );
   
 
try{     
 if( result.captcha){
  var captcha=result.captcha;
   $('#login-captcha-text').text( captcha);
     $('#login-captcha-container').slideDown()
    }
     else if(result.captcha_retry){
     toast('Invalid security code.');
   $('#login-captcha-text').text( result.captcha_retry);
     } 
   else if( result.require_mverification){
   toast( result.require_mverification,{ type: 'warning',hide: 5000}); 
  }   
   
  else if( result.require_verification){
    showEmailVerificationForm( result.email);
  toast( result.require_verification,{ type: 'warning',hide: 8000}); 
  }   
   else if(result.error ){
    toast(result.error);
  }
   else if( result.status){
     var token=$.trim( result.token);
    localStorage.setItem('__TOKEN__', token);
     
     var username= result.username;
     var fullname=result.fullname;
     var email=result.email;
     var phone=result.phone;
     var country=result.country;
     var bio=result.bio;
     var birth=result.birth;
     var joined=result.joined;
     var sync_contacts=$.trim( result.sync_contacts);
     var saved_groups=$.trim( result.groups);
     var lastmid= result.last_private_message_id;
     var lastofficialmid=result.last_official_mid;
     
     localStorage.setItem("server_settings", JSON.stringify(result.server_settings) );
     
    if( lastmid ){
      localStorage.setItem( SITE_UNIQUE__ + "_" + username_ + "_last_private_message_id", lastmid );
    }
     
   if( lastofficialmid){
     localStorage.setItem( SITE_UNIQUE__ + "_gv_pofficials_" + username_ + "_last_msg_id", lastofficialmid );
   }
     
    
  if( !inGroups( username_, "gv_pofficials") ){
     localStorage.setItem( SITE_UNIQUE__ + "_" + username_ + "_groups", groups + "gv_pofficials ");
   var lastmtime=+result.official_lmtime;
    localStorage.setItem( SITE_UNIQUE__ + "_gv_pofficials_" + username_ + "_group_admins","av_official,");
 }
     
 if( !result.login_time_micro){
   return toast("Could not fetch server time");
 }
     
  localStorage.setItem(username_ + "_login_time_micro", ("" + result.login_time_micro).split(".")[0] ); 
  localStorage.setItem("last_login_" + username_, moment().unix() ); //Unix timestamp
                        
   var dir=new android.File(MAIN_FOLDER, username_);
    
  if(!dir.isDirectory() && !dir.mkdirs()){
   return toast("Unable to create Main Directory");
  }
             
  var chat_dir=new android.File(dir, "CHATS");
  var profilesDir=new android.File( MAIN_FOLDER, username_ + "/USERS-PROFILES/");
   
 if( !chat_dir.isDirectory() && !chat_dir.mkdirs()){
    return toast("Unable to create chat Directory");
  }
     
 if(!profilesDir.isDirectory() && !profilesDir.mkdirs()){
    return toast("Unable to create users profiles Directory");
  }  
     
    //CREATE SENT/RECEIVED DIRECTORIES
     
  var dirs=['sent/images',
            'sent/audios',
            'sent/videos',
            'sent/documents',
            'received/images',
            'received/audios',
            'received/videos',
            'received/documents'
            ]
     
   $.each( dirs,function(i,v){
     var fdir=new android.File( FILES_FOLDER.replace(FILES_FOLDER_, "Files/" + username_), v);
   if(!fdir.isDirectory() && !fdir.mkdirs() ){
   return toast("Unable to create directory: " + v);
  }
   });
          
   var dirs=['CHATS/__RECEIVED-MESSAGES__',
            'CHATS/__READ-MESSAGES__',
            'CHATS/__AWAITING_SEND__',
            'AWAITING-DOCUMENTS'
            ]
     
   $.each( dirs, function(i,v){
     var dir_=new android.File( MAIN_FOLDER, username_ + "/"  + v);
  if(!dir_.isDirectory() && !dir_.mkdirs() ){
   return toast("Can't create dir: " + v);
  }
});
     
 
  var ud=new Object();
   ud.username=username_;
   ud.fullname=fullname;
   ud.email=email;
   ud.phone=phone;   
               
 var COMPLETED_=new android.File(dir,'profile.txt');
         
 if( COMPLETED_.write( JSON.stringify( ud) ) ){
  
if( fresh_login && sync_contacts.length>20 ){
   var file=new android.File( dir, "contacts-file.txt");
   if(!file.write( sync_contacts ) ){
    android.toast.show("Unable to save your synchronised contacts");
   }
  }
  
 if( lastmid && saved_groups.length>4){
   localStorage.setItem( SITE_UNIQUE__ + "_" +  username_ + '_server_saved_groups', saved_groups)
 }
   localStorage.setItem("logged_in",1);
   localStorage.setItem('user_data', JSON.stringify( ud) );
   localStorage.setItem('username', username_ );
   localStorage.setItem('fullname', fullname );
   localStorage.setItem('email', email);
   localStorage.setItem('phone', phone );
  
   localStorage.removeItem('login_required');
  // localStorage.setItem('login_changed', randomString(6));
   android.activity.loadUrl("control","javascript:reload();");
 
   save_login_profile( username_, fullname, email, phone, country,bio,birth,joined);

   loader.css('display','inline-block');
   form.prop('disabled', true);
 android.activity.loadUrl("main","file:///android_asset/main.html");
 android.activity.loadUrl("go_social","file:///android_asset/go-social.html")
 
 setTimeout( function(){
    if( MS__==="m"){
      toggleView('main');
    }else {
      toggleView('go_social');
    }
  toggleView('login','hide');
     loader.css('display','none');
     form.prop('disabled',false);
  }, 5000);

   
   return;
 }
   }
   else{
   android.toast.show('Unable to login at the moment.');
   }
      
  }catch(e){
    toast('Error "login error:"' + e);
    }
    }).fail( function(e,txt,xhr){
      //alert( JSON.stringify(e))
      loader.hide();
    form.prop('disabled',false);
  android.toast.show('Check your internet connection and try again. ' + xhr);
 //console.log('Error "login.js" Failed to login', JSON.stringify(e));
        
   });
    },2000);
    
});
  
   
 $('body').on('click','#register-btn',function(){
    $('.input-error').empty();
    
   var username= $.trim($('#reg-pin').val());
    var email= $.trim($('#reg-email').val());
    var fullname= $.trim($('#reg-name').val());
    var phone=$.trim($('#reg-phone').val());
    var location=$.trim($('#reg-location').val());
    var birth=$.trim($('#reg-birth').val());
    var password=$.trim($('#reg-password').val());
    var captcha=$.trim($('#reg-captcha').val())||"";
    
    if(!username || username.length<4) {
     android.toast.show('Username too short');      
   return;
   }
   if( username.length>30) {
     android.toast.show('Username too long');      
   return;
   }
  else
    if( !validUsername( username) ) {
     android.toast.show('Username not acceptable. A-Z0-9 only and at least 4 characters.');      
   
      return;
   }
 
   else if( !email || email.length<5 ) {
    android.toast.show('Enter a valid email address');
   return;
   }
   else if(!fullname || fullname.length<2) {
     android.toast.show('Display name too short');
   return;
   }
   else if(fullname.length>50) {
     android.toast.show('Display name too long. Maximum: 50 chars');
   return;
   }
    else if(!validName(fullname ) ) {
   android.toast.show('Enter good display name.');
    return;
    }
      
  else if(!phone || !phone.match(/^[0-9+() _-]{4,50}$/)) {
    android.toast.show('Enter a valid phone number');
    return;
  }
   
  else if( location.length<4 ||location.length>100){
     return android.toast.show('Location too short');
   }
   else if( location.length>100){
     return android.toast.show('Location too long');
   }
  else if( !birth|| !birth.match(/^[0-9_\/ -]{5,15}$/) ){
     return android.toast.show('Invalid date of birth')
   }
  else if(!password ||password.length<6) {
   android.toast.show('Password too short. Minimum 6 char');
   return;
  }
   else if(password.length>50) {
    android.toast.show('Password too long. Maximum 50 char');
  return;
    }    
    else if(!validPassword( password ) ){
     android.toast.show('Passwords can only contain the following characters: a-z 0-9 ~@#%_+*?-');
      return;
    }
   var form= $('input,button' );
   form.prop('disabled', true);
 
    var loader=$('#reg-loader');
        loader.css('display','inline-block');
    
    $.ajax({
      'url': config_.domain + '/oc-register/index.php',
      'data':
      {
       "username":username,
       "email": email,
       "fullname": fullname,
       "phone": phone,
       "password": password,
       "location": location,
       "birth": birth,
       "captcha": captcha,
       "version": config_.APP_VERSION,
      },
      type:'POST'
    }).done(function(result){
      // alert(result)
     if( result.captcha){
  
    var captcha=result.captcha;
       
   $('#reg-captcha-text').text( captcha);
   $('#reg-captcha').prop('disabled', false);
     $('#reg-captcha-container').slideDown();
      loader.fadeOut();
   if( result.captcha_note ){
     toast( result.captcha_note);
   }
    }
     else if( result.captcha_retry){
      toast('Invalid code');
   $('#reg-captcha-text').text( result.captcha_retry);
  }
   else if(result.error){
    toast(  result.error );
  } 
  else if( result.require_mverification){
 
   $('#reg-captcha-container,.form-page').css('display','none');
   $('#login-form-container').fadeIn();
   toast( result.require_mverification,{type: 'warning',hide: 5000}); 
  }   
    else if( result.require_verification){
   showEmailVerificationForm( result.email);
   toast( result.require_verification,{type: 'warning',hide: 5000}); 
 }
   else if( result.status){
   $('#reg-captcha-container,.form-page').css('display','none');
   $('#login-form-container').fadeIn();
    toast('You may log in now.',{type:'success',hide:6000});
  }
    else{
  toast('Unknown error occured. Try again.');
 }
   loader.fadeOut();
  report__('Result "register-btn"', JSON.stringify(result ) );
    
  form.prop('disabled', false);
          
 }).fail(function(e,txt,xhr){
    form.prop('disabled',false);
   loader.fadeOut();
    //alert( JSON.stringify(e))
     android.toast.show('Check your internet connection and try again. ' + xhr);
  report__('Error "login.js" Failed to register', JSON.stringify(e) );
        
    });
  
  });
  
 $('#verify-code-btn').click(function(){
  
   var code=$.trim($('#verification-code').val());
   var email=$.trim($('#verification-email').val());
   
   if(!code||code.length<5){
     return toast('Enter a valid verification code.');
   }
 
   var this_=$(this);
   buttonSpinner(this_);
   var form= $('input,button');
   form.prop('disabled',true);
  
   setTimeout(function(){
     
    $.ajax({
      'url': config_.domain + '/oc-register/verify-activation-code.php',
      'dataType':'json',
      'data':{
       "code": code,
       "email":email,
       "version": config_.APP_VERSION,
      },
      type:'POST'
    }).done(function(result){
      buttonSpinner(this_,true);
    form.prop('disabled',false);
   
   if( result.error){
      toast(result.error);
   }else if(result.status){
     
  $('.form-page,#login-captcha-container,#reg-captcha-container').css('display','none')
   $('#login-form-container').fadeIn();

   toast( result.result, {type: 'success'});
 
 }
    else{
      toast('Unknown error occured.');
  }
    }).fail( function(e,txt,xhr){
   buttonSpinner(this_,true);
   form.prop('disabled',false);
      toast('Check your internet connection. ' + xhr);
    });
   },3000);
 });
  

$('#resend-code-btn').click(function(){
  var email=$.trim( $('#verification-email').val());

  if(!email) {
    return toast('Email address absent.',{ type:'light',color:'#333'});
 }
  
  var this_=$(this);
    buttonSpinner( this_);
  
   var form= $('input,button');
  form.prop('disabled',true);
  
  setTimeout(function(){
    $.ajax({
      'url': config_.domain + '/oc-register/resend-activation-code.php',
      'dataType':'json',
      'data':{
       "email":email,
       "version": config_.APP_VERSION,
      },
      type:'POST'
    }).done(function( result){
      buttonSpinner( this_,true);
  form.prop('disabled',false);
    if( result.error){
      toast( result.error);
 }else if(result.status  ){
   toast( result.result, { type: 'success'});
 }
   else{
    toast('Unknown error occured.');
  }
}).fail( function(e,txt,xhr){
      buttonSpinner( this_,true);
  form.prop('disabled',false);
      toast('Check your internet connection. ' + xhr);
    });
    
  },3000);
 });
  
$('#send-fpwrd-code-btn').click(function(){
   //send forgot password code
  var this_=$(this);
  var email=$.trim( $('#fpwrd-email').val() );
 if( email.length<5){
     return toast('Enter a valid email address.');
  }
   var form=$('input,button');
  form.prop('disabled',true);
  buttonSpinner(this_);
  
  setTimeout(function(){   
    $.ajax({
      'url': config_.domain + '/oc-register/forgot-password-code.php',
      'dataType':'json',
      'data':{
       "email":email,
       "version": config_.APP_VERSION,
      },
      type:'POST'
    }).done(function( result){
   // alert( JSON.stringify(result) );
   buttonSpinner(this_, true);
  form.prop('disabled',false);
  
   if( result.error){
    toast( result.error);
 }else if(result.status  ){
   toast( result.result, { type: 'success'});
 }
   else{
    toast('Unknown error occured.');
  }
}).fail( function(e,txt,xhr){
     buttonSpinner(this_, true);
    form.prop('disabled',false);
      toast('Check your internet connection. ' + xhr);
    });
  },2000);
  
 });
  
  $('#reset-password-btn').click(function(){
   //send forgot password code
  var this_=$(this);
  var email=$.trim( $('#fpwrd-email').val() );
  var password=$.trim($('#fpwrd-password').val());
  var code=$.trim($('#fpwrd-code').val());
   
  if(email.length<5){
    return toast('Invalid email address.');
  }
    else if( code.length<5){
    return toast('Invalid code.');
  }
   else if( password.length<5){
    return toast('Password too short. Expecting at least six characters.');
  }
  else if(!validPassword(password)  ){
   return toast('Password can only contain alphanumerics, ~@#%_+*?-');
 }
    var form=$('input, button');
    form.prop('disabled',true);
    buttonSpinner(this_);
    
 setTimeout(function(){
   
    $.ajax({
      'url': config_.domain + '/oc-register/reset-password.php',
      'dataType':'json',
      'data':{
       "email":email,
       "password": password,
       "code": code,
       "version": config_.APP_VERSION,
      },
      type:'POST'
    }).done(function( result){
   // alert( JSON.stringify(result) );
   buttonSpinner(this_, true);
  form.prop('disabled',false);
  
   if( result.error){
    toast( result.error);
 }else if(result.status  ){
   toast( result.result, { type: 'success'});
  $('.form-page').css('display','none')
   $('#login-form-container').fadeIn();
 
 }
   else{
    toast('Unknown error occured.');
  }
}).fail( function(e,txt,xhr){
     buttonSpinner(this_, true);
   form.prop('disabled',false);
      toast('Check your internet connection. ' + xhr);
    });
   
 },3000);
   
 });
  
    
 $('#fpword-form-btn').click(function(){
  $('#forgot-password-panel').slideDown();
  $('#login-register-panel').slideUp('fast');
   });
});



function loadPrivacyTerms(){
  var cont=$('#privacy-terms-container');
  
    cont.fadeIn();
  
  setTimeout(function(){
  $.ajax({
    'url': config_.domain + '/oc-privacy.txt',
    'type':'GET',
  }).done(function( result){
 //   alert( JSON.stringify(result) );
   cont.html( result)
   
}).fail( function(e,txt,xhr){
    cont.fadeOut();
      android.toast.show('Check your internet connection. ' + xhr);
    });
   
 },1000);

}

$(function(){    
    const rmCheck = document.getElementById("customerRemember"),
    pin = document.getElementById("login-pin"),
  //  pass = document.getElementById("login-password"),
    submitButton = document.getElementById("login-btn")
    
    
if (localStorage.checkbox && localStorage.checkbox !== "") {
  rmCheck.setAttribute("checked", "checked");
  pin.value = localStorage.pin;
 //pass.value = localStorage.password;
  
} else {
 // rmCheck.removeAttribute("checked");
  pin.value = "";
 // pass.value = "";
  
}

submitButton.onclick =function() {
  if (rmCheck.checked && pin.value !== "") {
    localStorage.pin = pin.value;
  //  localStorage.password = pass.value;
    localStorage.checkbox = rmCheck.value;
  } else {
    localStorage.pin = "";
    localStorage.password = "";
    ;
    localStorage.checkbox = "";
  }
}

});



function onBackPressed(){
  if( $('#privacy-terms-container').is(':visible') ){
    $('#privacy-terms-container').hide();
    return;
  }
 else if( $('#register-form-container').is(':visible')
    ||$('#fpwrd-form-container').is(':visible') ){
   $('.form-page').css('display','none');
    $('#login-form-container').fadeIn();
  return;
 }
else if(!localStorage.getItem('__TOKEN__')){
   android.activity.finish();
 }
}

 //document.addEventListener("onBackPressed", onBackPressed);
document.addEventListener("backButtonPressed", function(){
  onBackPressed();
});



