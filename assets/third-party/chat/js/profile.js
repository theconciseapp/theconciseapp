
function myProfile(){
  myProfilePicture();
  var profile=new android.File(MAIN_FOLDER,username + '/profile.txt');
 if(!profile.isFile() ) return "";
  var data=$.trim(profile.read())
  data= JSON.parse( data);
  var u=data.username;
  var f=data.fullname;
  
  var v=checkVerified(u, f);
  var ver=v.icon;
  var name= v.name + " " + ver;
  
  $('#profile-username').html( u + ver);
  $('#profile-email').html(data.email);
  $('#profile-fullname').html( name);
  $('#profile-phone').html(data.phone);
}


function lazyLoadFriendsThumb(el){ 
  
}


function fetchPicture(path, onerror, callback, width,height, q){
 q=q||1;
  var img = document.createElement('img');
     img.onload = function(){     
       var canvas = document.createElement('canvas');
       var ctx = canvas.getContext('2d');

       width =width ||img.width;
       height=height||img.height;
       
       canvas.width=width;
       canvas.height=height;
 
     ctx.drawImage(this,0,0,width, height);
     callback( canvas.toDataURL('image/jpeg', q) );
  };
      img.src = path;
   if(onerror){
     img.addEventListener('error',function(e){
     //  this.src='file:///android_asset/chat-icons/no_profile_picture.png';
     callback("","error", e);
     });
   }
}



$(function(){

  $('body').on('click','.view-profile',function(){
   var this_=$(this);
    if(this_.hasClass('loaded') ) return;
   this_.prop('disabled',true);
    
   $.ajax({
      url:'file:///android_asset/profile.html'
    }).done(function(result ){
      $('#profile-page-container').html( result);
    setTimeout(function(){
      myProfile();
    },100);
      this_.addClass('loaded');
      this_.prop('disabled', false);
    }).fail(function(e){
     this_.prop('disabled', false);
     toast( JSON.stringify(e));
   });
    
  });
  
$('body').on('click','.view-friend-profile',function(){ 
  var this_=$(this);
  var fuser=this_.data('id');
   viewFriendProfile( fuser, this_);
});

function viewFriendProfile(fuser,this_){
 
  if( fuser=="gv_pofficials" && !is_group_admin( fuser, username) ){
    return toast("Locked", {type:"info"});
  }
  
  $('#create-group-form-container,#groups-container,#join-group-form-container')
    .removeClass('viewing-groups').css('display','none');
  
  try{    
    if( isGroup(fuser) || isPage(fuser) ){
     var ph=$('.page-hide');
     var gh=$('.group-hide');
      
  if( $('#group-profile-loaded-once').length ){
   
    if( isPage(fuser) ){
      ph.css('display','none');
      gh.css('display','block');
      }
      else{ 
        ph.css('display','block');
        gh.css('display','none');
      }
      
       group_profile(this_ );
 
   this_.prop('disabled',false);
  
      return;
    }
  this_.prop('disabled',true);
      
    $.ajax({
      url:'file:///android_asset/group-profile.html'
    }).done(function(result ){
      $('#group-profile-page').html(result );
 
     group_profile(this_);
      this_.addClass('loaded');
      this_.prop('disabled', false);
   var ph=$('.page-hide');
   var gh=$('.group-hide');
      
    if( isPage(fuser) ){
        ph.css('display','none');
      gh.css('display','block');
      }
      else{ 
        ph.css('display','block');
        gh.css('display','none');
      }
   groupMembersScroll();
      
  }).fail(function(e){
     this_.prop('disabled', false);
     toast( JSON.stringify(e) );
   });
   
      
  return;
    }
    
  if( $('#friend-profile-loaded-once').length ){
      fprofile( fuser, true );
    
   this_.prop('disabled',false);
      return;
    }
   
    this_.prop('disabled',true);
    
   $.ajax({
      url:'file:///android_asset/profile-friend.html'
    }).done(function(result ){
      $('#profile-friend-page').html(result );
     
     fprofile( fuser, true);
     
      this_.addClass('loaded');
      this_.prop('disabled', false);
     }).fail(function(e){
     this_.prop('disabled', false);
     toast( JSON.stringify(e) );
   });
             
  }catch(e){
    toast('Error occured. ' + e);
  }
    
}
  
 
$('body').on('click','.friend-picture, #group-profile-picture,#profile-friend-picture,.contact-photo',function(){
 if($('#chats-list-toolbar1').is(':visible')){
   return;
 }  
   var this_=$(this);
   var fuser=this_.data('id');
   var nosave=this_.hasClass('nosave');
   var verified=this_.data('verified');
  
  // $('#profile-friend-picture-full-container .ppfc').remove();
   
   var ppfc=$('#profile-friend-picture-full-container');
    ppfc.addClass('viewing-friend-profile-full-picture')
    // .append('<span class="ppfc friend-photo-normal-cont" id="' + fuser + '-ppfc"></span>');
     
 var pictureFile=new android.File(MAIN_FOLDER, username + '/CHATS/' + fuser + '/profile_picture.jpg');
 var thumbnailFile=new android.File(MAIN_FOLDER, username + '/CHATS/' + fuser + '/profile_picture_small.jpg');
    
   if( pictureFile.isFile() ){
    var path=pictureFile.toString() + '?i=' + randomString(3);
  }
  else{
    var path='file:///android_asset/chat-icons/no_profile_picture.png';
  }
   
   if(nosave && verified){
      path='file:///android_asset/chat-icons/verified_icon.png';
    }
      
  var ppfc_=$("#friend-photo-medium-container"); //$('#' + fuser + '-ppfc');
  ppfc_.html('<img onclick="enlargePhoto(this);" src="' + path + '">');
  ppfc.css('display','block');

  ppfc.prepend('<img id="profile-picture-loader" src="file:///android_asset/loading-indicator/loading2.png">');
   
  setTimeout( function(){
  
  var img_path=config_.users_path + '/' + strtolower( fuser[0] + '/' +fuser[1] +'/' + fuser[2] + '/' + fuser )+ '/profile_picture_full.jpg?due=' + randomString(3);
           
   fetchPicture( img_path, true, function(result, error){     
    $('#profile-picture-loader').css("display","none");
 /* 
  if(error){
    this.src='file:///android_asset/chat-icons/no_profile_picture.png';  
  return
  } else 
  */
  if(!result ){
      return toast("No photo",{type:"info"});
  }
else if( nosave){
   ppfc_.html('<img src="' + result + '" onclick="enlargePhoto(this);">');
   $("#chat-photo-full").attr("src", result);
  // $("#full-picture-loading").remove();
  return;
 }
 
 if( pictureFile.writeBase64( result.split(',')[1] ) ){
 ppfc_.html('<img src="' + pictureFile.toString() + '?i=' + randomString(3) + '" onclick="enlargePhoto(this);">');
 $("#chat-photo-full").attr("src", result);
  //$("#full-picture-loading").remove();
 }
      });
     
   },2000);
    
  });
  
  
 $('body').on('click','#change-profile-picture-btn', function(){
 var profileDir=new android.File(MAIN_FOLDER,username);
  if(!profileDir.isDirectory() && !profileDir.mkdirs() ){
    return toast('Could not create a directory.');
  }
 var file=new android.File(profileDir,'profile_picture.jpg');
    
  var data='<div class="center_text_div" style="width:100%; padding: 10px 15px;">';
if( file.isFile() )  data+='<span id="remove-photo-btn" onclick="removeProfilePicture();">&nbsp;</span>';
    data+='<span id="profile-gallery-btn" onclick="uploadProfilePicture(\'gallery\');">&nbsp;</span>';   
    data+='<span id="profile-camera-btn" onclick="uploadProfilePicture(\'camera\');">&nbsp;</span>';
    
  data+='</div>';
  
  displayData(data,{ width: '100%',max_width:'100%', oszindex:200, pos:'100', data_class: '.upload-profile-picture-div', osclose:true})
 }); 
  
  
 $('body').on('click','#add-to-contact-btn', function(){
   var this_=$(this);
   var fuser=this_.attr('data-username');
   if( sessionStorage.getItem('adding_contact_' + fuser) ){
     return;
   }
  addContact(fuser, false , function(fuser, fullname){
   appendStadium(fuser);
   $('#contacts-container').removeClass('contacts-loaded');
   $('#chatting-friend-name-' + fuser + ',#profile-friend-fullname').text(fullname);
   toast('Contact saved.',{ type: 'success'});
  this_.hide();
});
 });  
  
  $('body').on('click','#profile-message-btn', function(){
  $('#profile-friend-page').fadeOut('fast');
});
  
 $('body').on('click','#group-profile-message-btn', function(){
  $('#group-profile-page').fadeOut('fast');
});
  
  
});
   
function populateFriendProfile(name,email,phone){
  $("#profile-friend-fullname").html( name );
  $("#profile-friend-email").text( email );
  $("#profile-friend-phone").text( phone);  
 }


function fprofile(fusername, fetch_){ 
  var can_add_contact="NO";
   try{
  var settings= JSON.parse( localStorage.getItem("server_settings") );
  can_add_contact= settings.enable_add_contact;

 }catch(e){
 // return toast("Loading settings...", { type:"info"});
 }
    
    var rand_=randomString(3);
    var cofile=new android.File(MAIN_FOLDER, username + "/contacts.txt");
    var gfile=new android.File(MAIN_FOLDER, username + "/groups.txt");
 
   $("#profile-friend-fullname,#profile-friend-username,#profile-friend-email,#profile-friend-phone").empty(); 
   $('#profile-friend-fullname').addClass("profile-friend-fullname-" + fusername);
    
  var lastseen=$.trim($(".last-seen-" + fusername).text());
  $("#profile-friend-lastseen").text(lastseen);
  
var userdata=CONTACTS__[fusername];  
    var name=fusername;
    var email="";
    var phone="";
 
 if( userdata){
     name=userdata.fullname;
     email=userdata.email;
     phone=userdata.phone;
  }
  
  var v=checkVerified( fusername, name);
  var verified=v.icon;
      name= v.name;   
     
 // $("#profile-friend-fullname").html( name + " " +  verified );
  $("#profile-friend-username").html( fusername );
  
   populateFriendProfile(name + " " + verified, email,phone);
  
  $("#profile-message-btn").attr("username", fusername);
    
  var pdiv=$("#profile-friend-page");
   pdiv.fadeIn();
  var div=$("#profile-friend-picture-div");

 var pictureFile=new android.File(MAIN_FOLDER, username + '/CHATS/' + fusername + '/profile_picture.jpg');
 var thumbnailFile=new android.File(MAIN_FOLDER, username + '/CHATS/' + fusername + '/profile_picture_small.jpg');
   
  div.html( friendProfilePicture( fusername, "friend-picture sm-friend-picture") )

  if(!fetch_) return;
 
 var popened=pdiv.is(":visible");
 
 if( popened && localStorage.getItem("is_fetching_messages") ){
   delay_lpTimeout=setTimeout( function(){
   fprofile(fusername, fetch_);
  },1500);
   
 return;
 }
  
  lpTimeout= setTimeout(function(){
   lpAjax= $.ajax({
    url: config_.domain + '/oc-ajax/friend-profile.php',
    type:'POST',
   timeout: 10000,
     dataType: "json",
    data: {
      "username": username,
      "fusername": fusername,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
   //  alert( JSON.stringify(result))
 
    if( result.status){
    
    var fullname=result.fullname;
    var fuser=result.username;
    
  populateFriendProfile( fullname + " " + verified, result.email, result.phone);
  //save_user_profile( fuser, fullname, result.email, result.phone, result.country, result.bio,result.birth,result.joined);
    
    var inContact=CONTACTS__[fuser];
    
    if( inContact){
      saveContact( result /*obj*/ ,"", function(r){ });
   toast("Contact updated",{type:"info"});
    }else if( can_add_contact=="YES"){
      saveFriendContact()
      $("#add-to-contact").attr("data-contact", JSON.stringify( result) );
    }
 
   updateContact( result );  
  }     
  }).fail( function(e,txt,xhr){
     
   });
   
 },1000);
 }


function saveFriendContact(){
  var data='<div class="center_header text-left" style="white-space: nowrap; overflow-x: hidden; text-overflow: ellipsis; padding: 13px 16px 0 16px; width: 90%; font-size: 15px; font-weight: normal;">Add contact?</div>';
     data+='<div class="center_text_div text-right" style="font-weight: bold; width:100%; font-size: 13px; padding: 10px 15px; ">';
     data+='<div class="row">';
     data+='<div class="col text-center"><span onclick="closeDisplayData(\'.add-new-contact-div\');" style="color: #d9534f;">NO</span></div>';
     data+='<div class="col text-center"><div id="add-to-contact" onclick="addToContact(this);" style="color: #0079c6; width: 60%; margin: 0 auto;">YES</div></div>';
 
  data+='</div>';
  data+='</div>';

  displayData(data,{ width: '80%', max_width:'300px', oszindex:200, pos:'100', data_class: '.add-new-contact-div', osclose:true})
}

function addToContact(t){
  var this_=$(t);
  var contact= JSON.parse( this_.attr("data-contact"));
  saveContact( contact /*obj*/ ,"", function(r){
 
});
  
closeDisplayData(".add-new-contact-div")  
 }



/*
(function($) {
  $.fn.myFirstPlugin = function(options) {
    // Default params
    var params = $.extend({
      text     : 'Default Title',
      fontsize : 10,
    }, options);
    return $(this).text(params.text);
  }
}(jQuery));
*/
