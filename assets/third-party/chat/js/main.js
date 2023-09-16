 //android.webView.setBackButtonLogic("fireEvent");

 var VERSION='1.0';
 var gmTimeout=0, lpAjax, lpTimeout, delay_lpTimeout;

 var caretStart=0;
 var caretEnd=0;
 var marTimeout=0;
 var cdInterval=0;
 var typingTimeout=0;
 var autoSendMessageInterval=0;
 var galleryIntv;
 var photosIntv;
 var watchingVideoTimeout;
 var intervalRest;
 var intervalRestCount=0;
 var newMessageInterval=0,newGroupMessageInterval;
 var ajaxRequest;
 var $addContactRequest;
 var G_RAND=randomString(4);
 var DELETED__="";
 var GROUP_AJAX_ACTIVE=false;
 var lgprofileAjax, lgprofileTimeout;
 var imgcache_=imgcache();
 var SEND_FILE_AJAX=false;
 var NEWCHATS__={};
 var CONTACTS__={};
 var BLOCKED_CONTACTS__={}

 var NEWCHATSFILE= new android.File( CHAT_FOLDER,"CHATS/chat-list.txt");
 var CONTACTSFILE= new android.File( CHAT_FOLDER,"contacts-file.txt");
 var BLOCKEDCONTACTSFILE= new android.File( CHAT_FOLDER, "blocked-contacts.txt");

 try{
   
  if( NEWCHATSFILE.isFile() ) {
    NEWCHATS__= JSON.parse( NEWCHATSFILE.read() );
  var $totalchats=Object.keys( NEWCHATS__).length; 
  }
}catch(e){  alert("Chat lists-" + e); }
   
  try{
     if( CONTACTSFILE.isFile() ) {
   CONTACTS__= JSON.parse( CONTACTSFILE.read() );
   var TCONTACTS= Object.keys( CONTACTS__).length;
   
 if( TCONTACTS>100){
     
   }
       
     }   
 }catch(e){alert( "Contacts File -" + e); }
   
 try{
   
  if( BLOCKEDCONTACTSFILE.isFile() ) {
    BLOCKED_CONTACTS__= JSON.parse( BLOCKEDCONTACTSFILE.read() );
 }
}catch(e){  alert("Blocked contacts lists-" + e); }



var REFRESH_FRIENDS_PHOTOS_DUE= localStorage.getItem('reload_friend_thumbnails')||'0';

var mconfig_={
  "file_preview":true,
}
  
//Shuffle groups before fetching few groups messages
//With this function, all groups will not be fetched at once
//to prevent server hit.

var OGROPS__= localStorage.getItem( SITE_UNIQUE__ + '_' + username + '_groups')||"";
var GROPS__=OGROPS__;

function group__(num_){
  if(!$.trim( OGROPS__) ) return "";
  if(!GROPS__ ) GROPS__=OGROPS__;
  var groups=$.trim( GROPS__ ).split(' ');
  var total_groups=groups.length;
 groups=shuffle( groups);
  var g=""; var rep="";
 if(num_){
   var per_req=num_;
 }
  else{
    per_req=MAX_GROUPS_CALL;
  }
 
if( per_req>total_groups) {
  per_req=total_groups;
}
  
 for( var i=0;i<per_req;i++){
  var gpin=groups[i];
   var lastmid= +localStorage.getItem( SITE_UNIQUE__ + '_' + gpin + '_' + username + '_last_msg_id')
  
 if( lastmid){
      g+=' ' + gpin + '|' + ( lastmid );
      rep+=' ' + gpin;
}
   else{
     removeGroup_( gpin);
   }
 }
  var reg=new RegExp("^" + $.trim(rep) +"\\s?");
  GROPS__=GROPS__.replace(reg,'');
  return $.trim( g);
}


function updateNotification(){
 if( loginRequired() ) return;
  //Set notification url with groups pin as parameter
 var NGROUPS= group__(50);
 var lmc=localStorage.getItem( SITE_UNIQUE__ + '_' + username + '_last_private_message_id')||""; //Private message
var NOTIFICATION_URL=config_.domain + '/oc-notification.php?token=' + __TOKEN__ + '&username=' + (username||"") + '&lpm_check=' + lmc + '&groups=' + NGROUPS;
android.control.dispatchEvent('SET_NOTIFICATION_URL', [NOTIFICATION_URL]);
android.control.dispatchEvent('SET_DOMAIN_URL', [config_.domain]);

}


function relogin(){
  localStorage.removeItem('__TOKEN__');
 localStorage.setItem('login_required','yes');

  toggleView('login');
  
  setTimeout(function(){
  
  toggleView('main','hide');
 // toggleView('main','hide');
  
  },2000);
}

 if( !COMPLETED_.isFile() || !__TOKEN__ ||!username){
 relogin();
    }

function openGoSocial(){
 var already_loaded= localStorage.getItem('go_social_loaded');
 localStorage.setItem('go_social_opened','true'); //Removed on app launch. Check control menu.js
 
 toggleView('main','hide')
  toggleView('go_social');
  
  setTimeout(function(){
    localStorage.removeItem('message_opened');
    //toggleView('main','hide');
   }, 100);
   
  
}


function isScrolledToBottom_(elem){
  var sh=elem.scrollTop();
  var oh=elem[0].scrollHeight-elem.innerHeight();
  if( (oh-sh)<50 ){ return true; }
}

function isScrolledToBottom(elem, area, fuser) {
 
  if(elem.length && area=='saveMessage'){
 if( isScrolledToBottom_(elem ) ){
    $('#page-down-' + fuser).hide();
    return true;
  }
  else {
    $('#page-down-' + fuser).show();
  }
  
  }
}

function mobile_(){
 return $("#is-mobile").is(":visible");
}

function make_dir(path_obj ){
  if( !path_obj.isDirectory() && !path_obj.mkdirs() ){
    return false;
  }
  else { return true; }
}

function FRIENDDIR(fuser, dir_){
  var dir=new android.File( CHAT_FOLDER, "CHATS/" + fuser + ( dir_?"/" + dir_:"") );
  if( !dir.isDirectory() && !dir.mkdirs()){
    return "";
   }
    else return dir;
  }

function FRIENDFILE( fuser , filename){
 return new android.File( CHAT_FOLDER, "/CHATS/" + fuser + "/" + filename);
}
 

function videoLayout(file_id, fuser, chat_from,chatid,lfpath,sfpath, dimension, file_title,poster, fsize){
  var data=videoPlayerLayout( {
       "file_id": file_id,
       "fuser":fuser,
       "chat_from": chat_from,
       "lfpath":lfpath,
       "sfpath":sfpath,
       "dimension": dimension,
       "chat_id":chatid,
       "file_title": file_title,
       "poster": poster,
       "fsize": fsize,
    });
  
  return '<div class="chat-video-container" data-file-id="' + file_id + '" data-chat-id="' + chatid + '">' + data + '</div>';
}


function photoLayout(file_id, fuser, chat_from, chatid,lfpath,sfpath, dimension, file_title, fsize, ext_img){
    var receivedImg=FILES_FOLDER + '/received/images/' + file_id + '.jpg';
  ext_img=ext_img||"";
  var dim=dimension.split("_");
  var width=+dim[0]||250;
  var height=+dim[1]||0;
  
  var dW=$(window).width();
  var maxW=dW<250?dW:250;
  
  if( height){   
  var size=imageScale(width,height, maxW,320);
   var imgwidth= Math.ceil( size*width)  + "px";
   var imgheight= Math.ceil(size*height) + "px";
  }
  else{
    imgwidth =maxW + "px";
    imgheight="auto";
  }
  
  var  meta_=lfpath + "|" + sfpath + "|" + file_title + "|image|" + fsize + "|" + dimension;
   
  if( lfpath) {  
   var data='<img alt="" class="show-full-chat-photo chat-photo" onclick="enlargePhoto(this);" style="height:' + imgheight + '; width:' + imgwidth + ';" src="' +  FILES_FOLDER +'/' + lfpath + '" data-fuser="' + fuser + '" onerror="sentChatImageError(this,\'' + file_id + '\');">'; 
  }
  else{   
   var data='<img alt="" height="' + imgheight + '" class="show-full-chat-photo chat-photo" onclick="enlargePhoto(this);" style="height: ' + imgheight + '; width:' + imgwidth + 'px;" id="chat-photo-' + chatid + '" src="' + receivedImg + '" data-fuser="' + fuser + '" data-id="' + file_id + '" data-chat-id="' + chatid + '" data-sfpath="' + sfpath + '" data-ext-img="' + ext_img + '" onerror="receivedChatImageError(this);">';
   }
  data+='<input class="FILE__" id="file-share-' + chatid + '" type="hidden" value="' + file_id + '.jpg|images" data-meta="' + meta_ + '">';

  return '<div class="chat-image-container" data-file-id="' + file_id + '" data-chat-id="' + chatid + '">' + data + '</div>'; 
 }


function audioLayout( file_id, fuser, chat_from,chatid, lfpath,sfpath,file_title, fsize){ 
    var data= audioPlayerLayout({
      "file_id": file_id, 
      "fuser":fuser,
      "chat_from": chat_from,
      "chat_id":chatid,
      "lfpath":lfpath,
      "sfpath":sfpath,
      "file_title": file_title,
      "fsize" : fsize,
     });
  
  return '<div class="chat-audio-container" data-file-id="' + file_id + '" data-chat-id="' + chatid + '">' +data + '</div>';
 }


function layoutHtmlBuilder(file_id, chatid, fuser, fsize, obj){
  var path=obj.local_path;
  var ext=obj.ext||"unk";
  var sfpath=obj.download_url;
  var chat_id=obj.chat_id;
  var file_title=obj.file_highlight;
  
  var  meta_=path + "|" + sfpath + "|" + file_title + "|document|" + fsize + "|0"
  
var data='<div class="chat-document container-fluid ' + ( sfpath ? 'download-document':'') + '" id="chat-document-' + chat_id + '" data-fuser="' + fuser + '" data-ext="' + ext + '" data-download-url="'  + sfpath + '" data-chat-id="' + chat_id + '" data-path="' + path + '" data-id="' + file_id + '">'; 
    data+='<div class="row">';
    data+='<div class="col" style="padding:0; overflow-x: hidden; width: 40px; max-width: 40px;">';
    data+='<input class="FILE__" id="file-share-' + chat_id + '" type="hidden" value="' + file_id + '.' + ext + '|documents" data-meta="' + meta_ + '">';
    data+='<div class="chat-document-icon">' + ext.substr(0,3) + '</div></div>';
    data+='<div class="col" style="padding-left:0; overflow-x: hidden;"><div class="document-title">' + file_title + '</div></div>';
    data+='</div></div>';
   
 return '<div class="chat-document-container" data-file-id="' + file_id + '" data-chat-id="' + chatid + '">' + data + '</div>';
}


function fileLayout( ext, file_id, fuser, chat_from,chatid,lfpath,sfpath,file_highlight, fsize){
      
 var download_url="";
 var path= lfpath

   if(!lfpath ){
  var downloadUrl= sfpath;
   var path='received/' + ext + 's/' + file_id + '.' + ext;
  }
  
 return layoutHtmlBuilder(file_id, chatid,fuser, fsize,{
    "local_path": path,
    "ext": ext,
    "download_url": downloadUrl,
    "chat_id": chatid,
    "file_highlight": file_highlight  
  });
 
 }

  
function bbcodeToHTML(data,fuser,chat_from,chatid,lfpath,sfpath,dimension, file_highlight,hasFile, vposter, fsize) {
  var reg=/\[\s*file=::(.*?)::\]/g;
  
    data=bbCode( data ,false,fuser, chat_from, chatid);
  
  if(hasFile ) {
    data=data.replace(reg, function(m,file){
    var d=file.split(".");
    var file_id=d[0];
    var ext=d.pop(); //d[1];
   
    if(hasFile==="image"){
  return photoLayout(file_id, fuser,chat_from,chatid,lfpath,sfpath, dimension, file_highlight, fsize);
    }
    else if (hasFile==="video") {
  return videoLayout(file_id, fuser,chat_from,chatid,lfpath,sfpath, dimension, file_highlight,vposter, fsize);
    }
    else if (hasFile==="audio") {
  return audioLayout(file_id , fuser, chat_from,chatid, lfpath,sfpath, file_highlight, fsize);
    }
   else{
    return fileLayout(ext,file_id ,fuser,chat_from,chatid, lfpath,sfpath,file_highlight, fsize);
    }
  });
 }
   return data; 
  }


function sentChatImageError(this_,file_id){
  var receivedImg=new android.File(PUBLIC_FOLDER,'received/images/' + file_id + '.jpg');
 if( receivedImg.isFile() ) {
  var src_=receivedImg.toString();
  this_.src=src_;
  }else{
    var src_='file:///android_asset/chat-icons/chat_picture_not_found.png';
    this_.src=src_;
 $(this_).css('height', 220);
  }
 return true;
}


function receivedChatImageError(this_){
  this_=$(this_);
   var file_id=this_.attr("data-id");
   var folder=this_.attr("data-folder");
   var sfpath=this_.attr("data-sfpath");
  var ext_img=this_.attr("data-ext-img");
  if(!sfpath ) return;
 
  downloadUrl=sfpath;
  this_.attr('src','download.jpg')
       .addClass('download-photo')
       .removeClass('show-full-chat-photo')
       .attr('data-url', downloadUrl);
  
  var filename=sfpath.split('/').pop();  
  var thumbUrl=sfpath.replace(filename, 'thumbnails/' + filename);

  if( ext_img) {
    thumbUrl=sfpath;
  }
  
  fetchPicture( thumbUrl, '',function(result){
  this_.attr('src', result);
   }, 50,50);
}


function imgError(image, fuser) {
  var src="file:///android_asset/chat-icons/no_profile_picture.png";
  
  image.onerror=null;
  image.src = src;
 
}

function videoPosterError(image) {
  var this_=$(image);
 // var sfpath=this_.attr("data-sfpath")
  var server_vposter=this_.attr("data-server-vposter");
  
/*  var filename=sfpath.split('/').pop();  
  var thumbUrl=sfpath.replace( filename, "__POSTERS__/" + filename.replace(".mp4",".jpg") );
 */
  
fetchPicture( server_vposter, true, function(result,error, errorText){
 if(result)  this_.attr('src', result);
  else if (error){
  this_.attr("src","file:///android_asset/chat-icons/bg/video-poster-error.jpg");
   }
   });
}


function friendProfilePicture(fuser,class_,verified){
  class_=class_||'friend-picture';
  var isDue=localStorage.getItem('reload_friend_thumbnails');
  var real_path=config_.users_path + '/' + strtolower( fuser[0]+'/' + fuser[1] + '/' + fuser[2] + '/' + fuser ) + '/profile_picture_small.jpg?i=' + imgcache_;
 var local_path="file:///android_asset/chat-icons/no_profile_picture.png";
  return '<img class="lazy ' + class_ + '" alt="" onerror="imgError(this, \'' + fuser + '\');" src="' + local_path + '" data-src="' + real_path + '" data-verified="' + (verified?'1':'') + '" data-id="' + strtolower(fuser ) + '">';
}


function myProfilePicture(){
  $('#my-profile-picture-div').html('<img data-id="' + strtolower(username ) + '" id="my-profile-picture" onclick="enlargePhoto(this);" src="' + MAIN_FOLDER + '/' + username + '/profile_picture.jpg?' + randomString(3) + '" onerror="imgError(this);">');
 }

function msicon(status){
  //message status icon
 return '<img class="message-status-icon" src="file:///android_asset/chat-icons/' + status + '.png">';
}

function DBLINK_(fuser,filename){
   filename=( filename ? "/" + filename:"");
var dir=new android.File(MAIN_FOLDER,username + '/CHATS/' + fuser + '/DB');
    if(!dir.isDirectory() && !dir.mkdirs() ) {
      return "err";
    }
return new android.File( dir + filename );
}

function chatListDivs( fuser,name, message_, time_, add_contact){
  var v=checkVerified(fuser, name );
  var verified=v.icon;
     name= v.name;
  
  if( fuser=='gv_pofficials' ||fuser=='av_official'){
    name=OFFICIALALIAS__;
  }

  if( $('#chats-list-page #friend-preview-container-' + fuser).length){
    $('.friend-name-' + fuser).html( name + " " + verified );
   return "";
  }
 
 var timestamp=localStorage.getItem('last_message_timestamp_' + username +'_' + fuser)||"";

   var data='';
 
 var time=timestamp?toDate( timestamp, 'chat_list_date'):"";
  
   var status= localStorage.getItem('last_message_status_' + username + '_' + fuser)||"";
  if(status) status=msicon(status);
  var fmc=+localStorage.getItem('friend_message_count_' + username + '_' + fuser);
  
  var data='<div data-sort="' + timestamp + '" id="friend-preview-container-' + fuser  + '" class="highlight ' + add_contact + ' friend-preview-container-' + fuser + ' container-fluid friend-preview-container" data-username="' + fuser + '">';
  data+='<div class="row">';
  data+='<div class="col"><div class="friend-picture-bg">' + friendProfilePicture( fuser ,'', verified ) + '</div></div>';
  data+='<div class="col friend friend-' + fuser + '" data-backto="chat-list" data-friend="' + fuser + '">';
  data+='<span class="message-preview-name friend-name"><span class="friend-name-' + fuser + '">' + name + " " + verified + '</span></span>';
  data+='<span class="message-preview" id="message-preview-' + fuser +'">';
  data+='<span class="message-preview-status" id="message-preview-status-' + fuser + '">' + status +'</span><span class="message-preview-text">' + message_ + '</span><span class="message-preview-time">' + time + '</span>';
  data+='</span>';
  data+='<span class="friend-typing friend-typing-' + fuser + '" id="friend-typing-' + fuser + '"></span>';
  if(fmc ){
  data+='<span class="friend-message-count" id="friend-message-count-' + fuser + '">' + fmc + '</span>';
   // $('#friend-message-count-' + fuser).text(fmc).show();
  }
  data+='</div>';  
  data+='</div></div>';
  
   return data;
}

function noChatYet(){
 var data='<div id="no-chat-yet">';  
     data+='<img src="file:///android_asset/chat-icons/no-chat-yet.png">';
     data+='</div>';
   return data;
}


function noContactYet(type){
 var data='<div id="no-contact-yet">';  
     data+='<img src="file:///android_asset/chat-icons/no-contact-yet' + (type?'2':'') + '.png">';
     data+='</div>';
   return data;
}


function createDynamicStadium( fuser, name, thru ){
 //In go social, when message button
  //is clicked in user profile, this function creates
  //Chat stadium for the user, in the main webView
  var chatListElem=$('#chats-list-page-child');
  chatListElem.prepend( chatListDivs(fuser, name,"" ) );
  appendStadium( fuser);
  
 if(thru && goPage( fuser) ) sessionStorage.setItem('temp-text-' + fuser, '*Thru: ' + thru +'*\n');
  $(".friend-" + fuser).click();
  
  var contacts="";
  setTimeout( function(){
    try{
      
   if( CONTACTS__[fuser] ) return;
      
 var save=new Object();

  save.username=fuser;
  save.fullname=name;
 
//  saveContact( save );
      
    }catch(e){ 
    logcat("function createDynamicStadium: main.js", e);
   }
},2000);
}


function partitionChatList(chats_, total_chats){
  /*
  var maxChats=config_.max_chat_list;
  
  if( total_chats< maxChats ) return total_chats;
  
 try{
   var cfile=new android.File( MAIN_FOLDER, username + '/CHATS/chat_list.txt');

   chats_.splice( maxChats);
 if( cfile.write( chats_.join('\n').toString() ) ){
    return maxChats;
  }
 }catch(e){ 
 logcat("function partitionChatList: main.js", e);
  }
  */
}



function chunk (arr, len) {
  var chunks = [],
      i = 0,
      n = arr.length;
  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }
  return chunks;
}


var CHATS_CHUNKS=[];

function chats_chunks(){
 var cfile=new android.File( MAIN_FOLDER, username + '/CHATS/chat_list.txt');
  
 if( cfile.isFile() ){
  var chats=$.trim( cfile.read() )||"";
   if(chats){
    chats=chats.split('\n');
  var total_chats=chats.length;
  partitionChatList( chats, total_chats);
  
  $('#total-chats').val( total_chats);
  CHATS_CHUNKS= chunk( chats, 10);         
  }
 } 
  return CHATS_CHUNKS;
}


var loadedChatsCount__=0;

function friends_(load ){
 if( loginRequired() ){
   relogin();
   return;
  }

 var chatListElem=$('#chats-list-page-child');
 $('#chats-list-page #no-chat-yet').remove();   

  var totalchats=Object.keys( NEWCHATS__).length;
  
  if(!totalchats){
   chatListElem.html( noChatYet() ); 
   }
  else{
    
 $.each( NEWCHATS__,function(fuser, data){
    var ffullname=fuser;  
    var userdata= CONTACTS__[fuser]||null;
    var add_contact="add-contact-" + fuser;
    var message_= data.message;
    var time_=data.timestamp;
   
    if( userdata){
       ffullname=userdata.fullname;
       add_contact="";
     }
    
    chatListElem.append( chatListDivs( fuser, ffullname, message_, time_, add_contact) );
    
   appendStadium( fuser);
  // chatPreview( fuser, message_);
   
 var fmc=+localStorage.getItem("friend_message_count_" + username + "_" + fuser);
  if(fmc ) $('#friend-message-count-' + fuser).text(fmc).show(); 
  
});
    
chatListElem.html( getSorted(".friend-preview-container","data-sort") )
 
  }
  
 if( load ){
   sendMessage();
  
 setTimeout(function(){
 
 if( __TOKEN__) getMessage();
   
   },7000 );
 }

  reloadFriendThumbnails(); 
}


var loadingMoreChats=false;

$(function(){
 
  var chatListElem=$('#chats-list-page-child');
 
/*
$('#chats-list-page').on('scroll', function() {
  
  });
  
  */
  
});


function stadiumToolbar( fuser, num){
 var data="";
  
  if(num==1){
   var verified="";
 
if( userVerified( fuser) ){
    verified="verified";
    }
    
     data='<div data-id="' + fuser + '" class="toolbar1 stadium-toolbar-container" id="stadium-toolbar-container-' + fuser + '">';
     data+='<div class="d-none" id="total-current-db-' + fuser + '"></div>';
     data+='<div class="container-fluid">';
     data+='<div class="row">';
     data+='<div class="col" style="max-width: 60px; padding-top: 5px;"><span class="sm-friend-picture-bg">' + friendProfilePicture( fuser, 'friend-picture sm-friend-picture', verified ) + '</span></div>';
     data+='<div class="col view-friend-profile ' + verified + '" id="view-friend-profile-' + fuser + '" data-id="' + fuser + '">';
     data+='<div class="chatting-friend-name" id="chatting-friend-name-' + fuser + '"></div>';
     data+='<span class="last-seen" id="last-seen-' + fuser + '"></span>';
     data+='<span id="friend-typing2-' + fuser + '" class="friend-typing2 friend-typing-' + fuser + '"></span>';
     data+='</div>';
     data+='<div class="col text-right" style="max-width: 70px;"><span class="menu-icon" onclick="toggleStadiumMenu(\'' + fuser + '\');">&nbsp;</span></div>';
    data+='</div></div>'; 
     data+='</div>';
  }
  return data;
}


function appendStadium(fuser , load){
var stadium=$('#stadium-' + fuser);
  var new_chat="";
  if(!stadium.length ) {
    
 var data='<div class="stadium" id="stadium-' + fuser + '">';
    data+=stadiumToolbar(fuser, 1);
    data+='<div class="stadium-content" id="stadium-content-' + fuser + '">';
    data+='<div class="d-none" id="last-dbloaded-' + fuser + '"></div>';
    data+='<button id="page-down-' + fuser + '" class="move-page-down"></button>';
    data+='<div class="stadium-older-messages" id="stadium-older-messages-' + fuser + '"></div>';
    data+='<div class="stadium-newer-messages" id="stadium-newer-messages-' + fuser + '"></div>';   
    data+='</div>';
    data+='<input id="message-pcount-' + fuser + '" type="hidden" value="0" />';
   //Used in saveDb() for db partitioning;
    data+='</div>';
 
  $("#stadiums").append( data);
    new_chat="new_chat";
  } 
 
 if( !stadium.hasClass("latest-db-loaded") && load ) {
  loadLocalDB(fuser);
  }
  return new_chat;
}


function formatChatPreview(data){
 return data.substring(0,100);
}

function getSorted(selector, attrName) {
    return $($(selector).toArray().sort(function(a, b){
        var aVal = parseInt(a.getAttribute(attrName)),
            bVal = parseInt(b.getAttribute(attrName));
        return bVal - aVal;
    }));
}



function chatPreview(fuser,message){
  //Not in use again
  
  var timestamp=localStorage.getItem('last_message_timestamp_' + username +'_' + fuser)||"";

 $('#friend-preview-container-' + fuser,'#chats-list-page').attr('data-sort',timestamp);
   var data='';
  
  var msg=message||"";
  if(msg) msg=formatChatPreview(msg);
 
   var time=timestamp?toDate(timestamp,'chat_list_date'):"";
  
   var status= localStorage.getItem('last_message_status_' + username + '_' + fuser)||"";
  if(status) status=msicon(status);
   
  $('#chats-list-page #message-preview-' + fuser).html(' <span class="message-preview-status" id="message-preview-status-' + fuser + '">' + status +'</span><span class="message-preview-text">' + msg + '</span><span class="message-preview-time">' + time + '</span>');
}

function updateChatsList( fuser, message ){
  var timestamp=localStorage.getItem('last_message_timestamp_' + username +'_' + fuser)||"";
  var chatListElem=$('#chats-list-page-child');
  var fpcont=$('#friend-preview-container-' + fuser);
 
    fpcont.remove();
    var data='';
 
  var msg=message||"";
  if(msg) msg=formatChatPreview(msg);
 
 var time=timestamp?toDate(timestamp, "chat_list_date"):"";
 var fname=CONTACTS__[fuser]||"";
 var ffullname=fname?fname.fullname:fuser;
  chatListElem.prepend( chatListDivs( fuser, ffullname, message , time, "") );  

 if(chatOpened("s")==fuser){
  var cl=$('#chats-list-page');   
      cl.find('.friend-preview-container').removeClass('friend-message-selected-indicator');
      cl.find('.friend-preview-container-' + fuser).addClass('friend-message-selected-indicator');
 }

}


function DBTrim__(data){
  return $.trim( data.replace(/\n+/g,'\n') );
}

//var MESSAGES__={};
//var AWAITINGMESSAGES__={};

function loadLocalDB(fuser, last){
   try{
   
   var dir=DBLINK_( fuser);

 var totaldb=dir.list().length;
   $('#stadium-' + fuser+ ' #total-current-db-' + fuser).text(totaldb);
 
   var db="";
  //Older db 
 var ODBFILE= DBLINK_( fuser, totaldb);
    
 if( ODBFILE.isFile() ){
   var db_= $.trim( ODBFILE.read() );
   if(db_) db+= db_ + "\n";
 //  MESSAGES__=JSON.parse( db_);
 }    
   
 var awaitingPartition=new android.File(MAIN_FOLDER,username + '/CHATS/' + fuser + '/awaiting_partition.db');
    
 if ( awaitingPartition.isFile() ) {
   db+="__ap__\n" + $.trim( awaitingPartition.read() );
 /*
 AWAITINGMESSAGES__= JSON.parse( awaitingPartition.read() );
  $.extend( MESSAGES__ , AWAITINGMESSAGES__);   
 */
} 
  
   db=DBTrim__( db);
  var dbid=totaldb;
   if( db ){
  db=db.split("\n");
     var td=db.length;
     var i=0;
       
  var dfile=new android.File(MAIN_FOLDER,username + '/CHATS/' + fuser + '/__DELETED_MESSAGES__/deleted.txt');
     DELETED__="";
    
   if( dfile.isFile() ){
     DELETED__=$.trim( dfile.read() );
   }
    
  for( i=0; i<td; i++){
  
    data=db[i];
  if( data=='__ap__') {
     dbid='ap';
   }else{
     
   displayMessage({ 
     'message':data,
     'is_new': fuser,
     'old_message': true,
     'area':'loadLocalDb',
     'page_down' :true,
     'DB': dbid
   });
  }
}
    $('#stadium-newer-messages-' + fuser).empty();
}
     checkAwaiting( fuser);
     checkAwaitingDocuments( fuser);
  $('#stadium-' + fuser).addClass('latest-db-loaded');

    }catch(e){
 report__('Error "loadLocalDb()"', e);
 logcat("function loadLocalDb:main.js", e); 
    
 }
 
}

function checkAwaiting( fuser){  
  var aDir=new android.File( MAIN_FOLDER, username + '/CHATS/__AWAITING_SEND__');
 if(!aDir.isDirectory() ){ 
   return;
 }   
    var list= aDir.list();    
    if( list.length<1 ) return;
    
 $.each( list, function(i, result){
    chatid=result.replace('.txt','');
  var div=$('#stadium-content-' + fuser + ' #message-status-' + chatid );
     div.html( msicon('awaiting') );
     div.removeClass('message-status-1 message-status-2 message-status-3').addClass('message-status-0');
 });
  
}

function checkAwaitingDocuments( fuser){
  var aDir= new android.File( CHAT_FOLDER,'AWAITING-DOCUMENTS');
 
  if( !aDir.isDirectory() ){
   return;
 }
    var list=aDir.listFiles();
 
    if( list.length<1) {
    return; }
     
 $.each( list,function(i, result){
   var chatid= result.toString().replace( aDir.toString() + '/','').replace('.txt','');
   
  if( !$('#stadium-' + fuser).hasClass('latest-db-loaded') ){
    var aFile=new android.File( result);
    var data=$.trim( aFile.read() );
    
    displayMessage({ 
      'message': data,
      'resend': true,
      'area':'loadAwaitingSend',
      'DB': 'ad'
    });
    
  }
 var div= $('#stadium-' + fuser + ' #message-status-' + chatid );
    div.html( msicon('awaiting') );
   div.removeClass('message-status-1 message-status-2 message-status-3').addClass('message-status-0');
 });
   
}


var friendsTypingDisplayTimeout=undefined;

function friendsTyping(result, current_time){  
 if(!result ) return;
  result=result.split('\n');

  for(var i=0; i<result.length; i++){
    var result_=result[i].split('|');
    
    var fuser=result_[0];
    var mtime=+result_[1];
    var typing="Typing...";
    var mem='';
 if ( result_.length>2){
   //Group member typing
    mem=result_[2];
     typing= mem + ' is typing...';
  }
      mtime=mtime+10;
    if( mem!=username && mtime>current_time){
  var tspan=$('#chats-list-page #friend-typing-' + fuser + ',#stadiums #friend-typing2-' + fuser);
 var mpspan=$('#message-preview-' + fuser + ', #last-seen-' + fuser);
     mpspan.css('display','none');
     tspan.css('display','block').text( typing);
  hideIsTyping(fuser,tspan,mpspan);
    }
  }
}

function hideIsTyping(fuser,elem,elem2){
  setTimeout(function(){
   elem.css('display','none');
   elem2.css('display','block');
  }, 3500 );
 
}

function is_fetching_messages(){
 return sessionStorage.getItem('is_fetching_messages');
}



var CM_INTERVAL__= CHECK_MESSAGE_INTERVAL;
var loadGroupMsg=0;
var GMScount=0, fetchSettings=1; //get message success count


function readReports(gpage){
  var receipts=""
  var gdir_=new android.File( CHAT_FOLDER, "CHATS/__READ-MESSAGES__");
   
  if( !gpage && gdir_.isDirectory() ){
   var rlist=sortFilesAsc( gdir_);
  // var rlist=gdir_.list(); 
 var total_read= rlist.length;
   
   total_read=total_read>5?5:total_read;
      if( total_read>0 ){    
  for( var r=0; r<total_read; r++){
     var fpath= new android.File(rlist[r]);
     receipts += fpath.getName() + ' ';     
     }
   }
  }
 
 return receipts; 
}

function deliveryReports(gpage){
    var receipts=""
  var gdir_=new android.File( CHAT_FOLDER, "CHATS/__RECEIVED-MESSAGES__");
   
  if( !gpage && gdir_.isDirectory() ){
    var dlist=sortFilesAsc( gdir_);
  //   var rlist=gdir_.list();
   var total_deli= dlist.length;
    total_deli=total_deli>5?5:total_deli;
    
 if( total_deli>0 ){
  for( var r=0; r<total_deli; r++){
     var fpath= new android.File(dlist[r]);
     receipts += fpath.getName() + ' ';     
    }
   }
  }
  return receipts; 
}


function canSendChat( fuser){ 
  if( siteAdmin( username ) ){
   return 1;
 }
 try{
  var settings= JSON.parse( localStorage.getItem("server_settings") );
  
 if( settings.enable_chat=="NO"  ){
   return 0;
 } 
 else if( !siteAdmin( fuser) && settings.enable_send_chat=="NO" ){
   return 0;
  }
 }catch(e){ 
      return -1;
   }
  return 1;
}


function getMessage( options) {

   if( !username) return;
 else  if( localStorage.getItem('is_logging_out') ){
  clearTimeout(  gmTimeout);
   
   return;
 }
  else if( localStorage.getItem('go_is_sending_post') 
 || localStorage.getItem('is_sending_message')
 || localStorage.getItem('go-social-posts-loading') 
 || GROUP_AJAX_ACTIVE ){
 setTimeout(function(){
   getMessage( options);
  }, 5000);
    return;
 }
  

  
if(  GMScount >0 && CM_INTERVAL__ <30000  && localStorage.getItem('go_social_opened') ){
  intervalRest= 30000;
  //CM_INTERVAL CAN BE CHANGED FROM SERVER,
  //THEREFORE USE CM_INTERVAL IF VALUE SET IS GREATER THAN 60000
 
 }else{
   intervalRest=false;
}

  var cm_interval_= intervalRest|| CM_INTERVAL__;
    
  var app_minimized='';
 
  //returns the id of friend you are reading message from if chat is opened
   var reading_from= chatOpened('s'); 
   var check_lastseen=reading_from;
 
  //it is necessary to send app minimize status
  //to stop
  //user online status update
  
 if( appMinimized() ) {
    app_minimized=1;
    reading_from="";
    check_lastseen="";
  }  

 var update_my_lastseen='YES';
 var gpage=isGroupPage( reading_from);
  
  if( !showLastSeen()  ) {
    check_lastseen="";
    update_my_lastseen="";
  }
  
 if( gpage) check_lastseen=""
  
  var mark_as_delivered= deliveryReports(); //Tell friends the messages that got delivered to you   
   //mark as read
  var mark_as_read=readReports( gpage); //Tell friends their messages you've read
  var last_message_id= localStorage.getItem( SITE_UNIQUE__ + "_" + username + "_last_private_message_id")||"fresh";   
  var last_receipt_id= localStorage.getItem( SITE_UNIQUE__ + "_" + username + "_last_message_receipt_id")||"fresh";
 
  var selectedGroupId="";
  var getSettings="";
 
  if( GMScount==0 ){
   getSettings="GET";
 }
  
 // if( loadGroupMsg==0|| loadGroupMsg>1 ){
  selectedGroupId=group__();
  // loadGroupMsg=0;
  //}

  var typing_to=$.trim( sessionStorage.getItem("typing_to") );
  //this notifies the server i'm typing message to someone  
    
  localStorage.setItem("is_fetching_messages","TRUE");
  
  if ( fetchSettings >5 ){
    fetchSettings=1;
  }
     
 ajaxRequest=$.ajax({
   url: config_.domain + "/oc-get-message.php",
   type: "POST",
   dataType:"json",
   data:{ 
       'version': config_.APP_VERSION,
       'username': username,
       'app_minimized': app_minimized,
       'update_lastseen': update_my_lastseen,
       'reading_message_from': reading_from,
       'groups_pins': selectedGroupId,
       'mark_as_read': mark_as_read,
       'mark_as_delivered': mark_as_delivered,
       'last_message_id': last_message_id,
       'last_receipt_id': last_receipt_id,
       'check_lastseen': check_lastseen,
       'typing_to': typing_to,
       'fetch_settings': fetchSettings,
       'gms_count': GMScount, //get message count
       'token': __TOKEN__,
     }
   }).done(function(result){
   //alert( JSON.stringify(result) );  
  loadGroupMsg++;
  GMScount++;
  fetchSettings++;
   
if( result.invalid_token){
  localStorage.removeItem("is_fetching_messages");
  relogin();
  return toast("Login required");
  //throw new Error("Login required.");
}
   else if( result.status=="success" ) {
   var server_time= result.current_time;
   var server_mtime= result.current_mtime;
  
    check_delivery_read( result.delivery_read_report );
    friendLastSeen( result.friend_last_seen);
    friendsTyping( result.typing, server_time );
    deleteSentReports( result.sent_reports);
    removeInvalidGroups( result.invalid_groups ); //remove invalid groups
    miniSettings( result.settings );
    upgradeRequired( result.app_upgrade_data, true);
      
       
  if( result.glock_status){
   //Group lock status
  $.each( result.glock_status, function(gpin_, status){
      lock_unlock_group( gpin_,status);
   });
    
  }  
   localStorage.removeItem("is_fetching_messages");   
     
 if( GMScount==1 ){
    var ajgroups=result.auto_join_groups;
    localStorage.setItem("auto_join_groups", ajgroups);
    auto_join_group();
  }
    
  var group_messages=result.group_messages;
  var private_messages=result.private_messages;
    
     //Combine
  var messages= group_messages.concat( private_messages);  
  var total_results=messages.length;
    
   if( total_results>0 ){  
     
   var xxxx_=0;
   localStorage.setItem('saving_message','YES');
  
 newMessageInterval=setInterval(function(){
  
  saveMessage( messages[ xxxx_], xxxx_, total_results );
     xxxx_++;
  
   if ( xxxx_ >=total_results){
    
    localStorage.removeItem('saving_message');    
    clearInterval( newMessageInterval); 

  gmTimeout=setTimeout( function(){
      getMessage();
    }, cm_interval_);
 
  updateNotification();
 }
                             
}, 100); 

    }
 
   else{
     
   localStorage.removeItem('is_fetching_messages');     
     gmTimeout=setTimeout( function(){
     getMessage(); }, cm_interval_ );
     }
   }  //end result.status==success
  else{
   localStorage.removeItem('is_fetching_messages');
      gmTimeout=setTimeout( function(){
      getMessage(); }, cm_interval_);
  } 
  
  report__('Result "getMessage()"', JSON.stringify( result ) ,true);
 
 }).fail(function(e, txt, xhr){
  localStorage.removeItem('is_fetching_messages');
 if( e.status && e.status=='404'){
    return toast('Domain not found.',{ hide: 20000});
  }
   gmTimeout=setTimeout( function(){
      getMessage();
    }, cm_interval_);
   
    report__('Error "getMessage()"', JSON.stringify(e),true );
   });

  
 }
 

function saveMessage(data_, count_, total_results){
  if( !data_){
    return;
  }
   else if( data_.private_fresh_id){
    localStorage.setItem( SITE_UNIQUE__ + "_" + username + "_last_private_message_id", ( data_.last_private_message_id||1 ) );
    return;
   }

  var mid=data_.id;
  var chatId= data_.message_id;
  var chatFrom=data_.message_from;
  var chatTo=data_.message_to;
  var highlight=data_.message_preview;
   
  var fuser=chatFrom;
   
if( isGroupPage( chatTo) ){
  fuser=chatTo;
  localStorage.setItem( SITE_UNIQUE__ + "_" + chatTo + "_" + username + "_last_msg_id", mid );  
}
 else{  
  localStorage.setItem( SITE_UNIQUE__ + "_" + username + "_last_private_message_id", mid );
  if( BLOCKED_CONTACTS__[fuser] ) return;
 }
   
  var action_=false;
  
 if( chatFrom==="act" || chatFrom==="act_act" ){
  action_= USER_ACCOUNT_ACTION( data_.message);
   if( !action_ )  return;
}
   
  if(!action_){
    appendStadium( fuser, "load");

  try{  
 var id_dir=new android.File( CHAT_FOLDER, "CHATS/" + fuser);

 if( !id_dir.isDirectory() && !id_dir.mkdirs() ) {
   report__('Error "saveMessage)"','Could not create directory-> ' + id_dir.toString() ); 
 }
 else{
   
 var data=JSON.stringify( data_);
   saveToDB(fuser, data, 'saveMessage','display',chatId,mid);
   
 sortChats(fuser, highlight, fuser);
   
 localStorage.removeItem('last_message_id_' + username + '_' + fuser);
 localStorage.removeItem('last_message_status_' + username + '_' + fuser);
 $("#message-preview-status-" + fuser ).html(""); 
  
}
 
 }catch(e){
   report__('Error "saveMessage()"', e);
   logcat("function saveMessage:main.js", e); 
   
 }
  }
  
if( count_==( total_results-1) ){
  if( localStorage.getItem("go_social_opened") ) {
    android.activity.loadUrl("go_social","javascript:newMessageNotify('" + ( count_ + 1) + "');");
  }

  if( appMinimized() ) {
   //check control/control.html
   android.activity.loadUrl("control","javascript:showMessageNotification();");
  }
  
 }  
}


function saveToDB( fuser,data, area, display,chatId,mid){
 if(!data) return;
 
  if( $("#message-container-" + chatId).length){
    return false; 
  }
    var DBFILE=new android.File(MAIN_FOLDER, username + '/CHATS/' + fuser + '/awaiting_partition.db');
    var new_chat=false;
    var save="";

  if( DBFILE.isFile() ) {
     new_chat=true;
    save+="\n";
   }
      save+=data;
  
 if( DBFILE.append( save ) ){

 var rmDir=new android.File( CHAT_FOLDER, "CHATS/__RECEIVED-MESSAGES__");
  
 if( !isGroupPage( fuser) ){
  if( area==="saveMessage" ){
    var rmFile=new android.File( rmDir, mid + "-" + fuser + "-" + username + "-" + chatId + ".d");
       rmFile.write( chatId);
  }
 }
     
  /*
   In order to partition db, get the 
   total messages currently received or sent by you and friend,
   if it's up to partition_rcheck value, then attempt 
   to partition db if necessary
  */
   
   var el=$('#stadiums #message-pcount-' + fuser);
   var total_received=+el.val();
  
  if( total_received>config_.partition_rcheck){
    partitionDB( fuser );
     total_received=0;
   }
  el.val( total_received+1);
   
  if( display=="display"){
    
    localStorage.removeItem('last_chat_id_' + username + '_' + fuser);
    localStorage.setItem('last_message_timestamp_' + username + '_' + fuser, moment().unix() );
    
  if( chatOpened("s")!=fuser ){
   var fmc=+localStorage.getItem("friend_message_count_" + username + "_" + fuser)+1;
       localStorage.setItem("friend_message_count_" + username + "_" + fuser, fmc);
 $("#friend-message-count-" + fuser).text(fmc).css("display","block");

   }
 
  displayMessage({
       'message': data,
       'is_new':true,
       'area': area,
       'DB':'ap'
    });
   } 
  }else{
    report__('Error "saveToDb()"','Unable to append to ' + DBFILE.toString() ); 
 }
 
}


function miniSettings( settings_, local){
  if( !settings_.chat_request_speed ) return;

 if(!local ) localStorage.setItem("server_settings", JSON.stringify( settings_) );
    
  var int_=settings_.chat_request_speed;

  if( !local ){
 if( settings_.enable_chat=="NO"){
   CM_INTERVAL__ = 60*5*1000;
   
 }else 
  if( int_>2 ) {
    CM_INTERVAL__ =( +int_)*1000;
  }
}

  var mgc= settings_.max_groups_check
   localStorage.setItem('max_groups_check', mgc )
   MAX_GROUPS_CALL= +mgc;

$("#chat-disabled-cover,#create-group-form-btn,#add-contacts-btn,#show-groups-btn-cont,#show-groups-btn2,#show-contacts-btn").css("display","none");
 
var can_add_contact = settings_.enable_add_contact;
var can_create_group= settings_.enable_create_group;
var can_join_group  = settings_.enable_join_group;
var adm=siteAdmin( username);
 
if(!adm && settings_.enable_chat=="NO"){
  $("#chat-disabled-cover").css("display","block");
  return;
}
  
if( adm||can_create_group=="YES"){
  $("#create-group-form-btn").css("display","block");
}
  
if( adm|| can_add_contact=="YES"){
  $("#add-contacts-btn").css("display","block");
  $("#show-contacts-btn").css("display","block");
 }
  else{

if(adm|| can_join_group=="YES"){
  $("#show-groups-btn-cont").css("display","none");
  $("#show-groups-btn2").css("display","block");
  return; 
  }
}
  
if(adm|| can_join_group=="YES"){
    $("#show-groups-btn-cont").css("display","block");
}  
  
}


function deleteSentReports( data){
  if(!data) return;
  data=data.split(' ');
  $.each( data, function(i, v){ 
    
  if(v.match(/\.d$/) ){
  var file=new android.File( CHAT_FOLDER, "CHATS/__RECEIVED-MESSAGES__/" + v);
  }
  else{
   var file=new android.File( CHAT_FOLDER, 'CHATS/__READ-MESSAGES__/' + v);
  }
     try{ 
       file.delete(); 
     }catch(e){
   logcat('function deleteSentReports: main.js', e);
     }
 });  
}

function check_delivery_read(result_cd ){
  if( !result_cd.length ) return;
  
 $.each( result_cd, function(i,v){
 
  if( v.receipt_fresh_id ){
   var lrid= v.last_receipt_id;
   localStorage.setItem( SITE_UNIQUE__ + "_" + username + "_last_message_receipt_id", lrid); 
   return false;
 }
   var rid=v.id;
  
   if( rid) {
    var fuser=v.receipt_from;
    var receipt=v.receipt;
    var r=receipt.split(".");
    var chat_id= r[0];
    var type=r[1];
   
 if( type==="d"){
    messageDelivered( fuser, chat_id, rid);
  }else{
    messageRead( fuser, chat_id, rid);
  }  
 }

 });
 
}

function messageDelivered( fuser, chat_id, rid){
 try{
 
 var sent_=new android.File( CHAT_FOLDER, "CHATS/" + fuser + "/SENT/" + chat_id);
 var deli_=new android.File( CHAT_FOLDER, "CHATS/" + fuser + "/DELIVERED/" + chat_id);
    
   if( !sent_.isFile() ) {
      localStorage.setItem( SITE_UNIQUE__ + "_" + username + "_last_message_receipt_id", rid); 
      return;
    }
     else if ( sent_.renameTo( deli_) ){

  var lmid=localStorage.getItem("last_message_id_" + username + "_" + fuser);
  var el=$("#message-status-" + chat_id + ".message-status-1");
   
    el.removeClass("message-status-1");
    el.addClass("message-status-2");
    el.html( msicon("delivered") );
 
     localStorage.setItem( SITE_UNIQUE__ + "_" + username + "_last_message_receipt_id", rid);
 
 if( lmid==chat_id) {
   //#chats-list-page
   $("#message-preview-status-" + fuser ).html( msicon("delivered") ); 
   //Last_message_status used in chatPreview()
  localStorage.setItem('last_message_status_' + username + '_' + fuser, "delivered");
 }
   }
  else{
   alert("It reach here but failed to rename.\nSent: " + sent_.toString() + "\nRenameTo: " + deli_.toString() )
  }
   
  }catch(e){
   logcat("function messageRead:main.js", e);
 }
}


function messageRead(fuser, chat_id, rid){
  try{
    
    var read_=msicon("read");
  var el=$("#message-status-" + chat_id );
      el.removeClass("message-status-2 message-status-1");
      el.html( read_ );
    
 var deli_=new android.File( CHAT_FOLDER, "CHATS/" + fuser + "/DELIVERED/" + chat_id);

   if( deli_.isFile() ){
     deli_.delete();
    localStorage.setItem( SITE_UNIQUE__ + "_" + username + "_last_message_receipt_id", rid); 
   }
    else{
      localStorage.setItem( SITE_UNIQUE__ + "_" + username + "_last_message_receipt_id", rid);
    }
    
   var sent_=new android.File( CHAT_FOLDER, "CHATS/" + fuser + "/SENT/" + chat_id);
  
 if( sent_.isFile() ){
   sent_.delete();
}
  
   var lmid=localStorage.getItem("last_message_id_" + username + "_" + fuser);   
     if ( lmid==chat_id) {
       
 $("#message-preview-status-" + fuser).html( read_ );
   localStorage.setItem("last_message_status_" + username + "_" +  fuser, "read");
  }
   
  }catch(e){
  logcat("function messageRead:main.js", e); 
    
   }
}


function friendLastSeen( result_ls){
  
    if( !result_ls  ) return;
  result_ls=result_ls.split('#');
 
 if( result_ls[0] ){
  var data=result_ls[0].split('|');
    var fuser=data[0];
  var ls=$("#last-seen-" + fuser + ", #profile-friend-lastseen");  
   var lastSeen=+data[1];
   var ulastseen=localStorage.getItem("user-blocked-lastseen-" +fuser);
 if( ulastseen ) lastSeen=+ulastseen;

 if(lastSeen==="hide") return ls.text("-");
  var currentTime= +data[2];
  var online=false;
  
 if( (lastSeen + 10) >currentTime) online=true;
   if(online) ls.text("Online");
    else ls.text(toDate( (lastSeen + 10), "last_seen") );
   }
    
}

function removeInvalidGroups(groups){
if(!groups) return;
  $.each(groups, function(gpin_,val_){
 removeGroup_(gpin_);
  });
}

function chatOpened(status){
  //this will return the id of the friend
  //you are reading his/her message
  return $("#reading-message-from").val()
}


function chatClosed(){
  //if you are not reading any chat
 var rmf=$('#reading-message-from').val();
  if(!rmf) return true;
}

var smTimeout;

function resendMessage(t){
  var rt=sessionStorage.getItem('resend_timer')||t;
    clearTimeout( smTimeout);
  smTimeout=setTimeout(function(){
       sendMessage();
  },rt);
}
  

function sendMessage(){
  
  if( localStorage.getItem('is_logging_out') ){
   return;
 }
  
 if( localStorage.getItem('is_sending_message')
   || localStorage.getItem('is_fetching_messages')
   ){   
   resendMessage( 3000 );
  return;
 }
  
   //Send messages in __awaiting_send__ folder
  
 var aDir=new android.File( MAIN_FOLDER, username + '/CHATS/__AWAITING_SEND__');
 
 if( !aDir.isDirectory() ){
  localStorage.removeItem('is_sending_message');
    return;
  }
  
 var list= sortListFiles( aDir, true);
 var total_msg=  list.length;

 if(total_msg<1 ){
    localStorage.removeItem('is_sending_message');
    return;
  }
  
 //Send at most 5 pending messages at a time
  if( total_msg> 5 ){
    total_msg=5;
  }
 
  var messagesData='';
  
 for(var f=0; f<total_msg; f++){
  var msgFile=new android.File( list[f] );
    messagesData+= msgFile.read() + '\n';
 }
  
 messagesData=$.trim( messagesData);
   
 if( !messagesData ) {
   localStorage.removeItem('is_sending_message');
   return;
 }
  
  localStorage.setItem('is_sending_message','1');
   
  ajaxRequest=$.ajax({
     url: config_.domain+ '/oc-send-message.php',
     dataType: "json",
     data:{
       'version': config_.APP_VERSION,
       'username': username,
       'data': messagesData,
       'token': __TOKEN__
       },
    type:'POST'
  }).done( function(result){
    localStorage.removeItem('is_sending_message');
    
 var is_disabled=false;
  if( result.chat_disabled ){
    toast('Some messages not sent',{ hide: 10000});
    is_disabled=true;
  }else if( result.result ){
    
  var success=result.result.split(' ');

 $.each( success, function(i,v){
   var d=v.split("|");
   var chatId =  d[0];
   var chat_to = d[1];
   var chat_from=d[2];
   
  var fdir=FRIENDDIR( chat_to, 'SENT');
  
 if(  fdir ){
  var file=new android.File(fdir, chatId);
    
 var aDir=new android.File( CHAT_FOLDER, "CHATS/__AWAITING_SEND__/" + chatId + ".txt");
     aDir.delete();
  
 if( chat_from!=="act"){
   
  if( !isGroupPage( chat_to) ){
    file.createNewFile();
  }
   
   var span=$("#upload-status-" + chatId).remove(); //remove upload status in case it's a file   
   var ms=$("#message-status-" + chatId);
   
   ms.removeClass("message-status-0").addClass("message-status-1").attr("data-status",1);
   ms.html( msicon("sent") );
   localStorage.setItem("last_message_status_" + username + "_" + chat_to, "sent");
  $("#message-preview-status-" + chat_to).html( msicon("sent") );
 }
 }  
});
 
   }
  
  var rtime=3000;
  sessionStorage.removeItem('resend_timer');
  if( is_disabled ){
     var rtime=60000;
   sessionStorage.setItem('resend_timer',rtime);
   //useful only if sending message was disabled, so next request delay should increase
    //check resendMessage()
  }
    
  resendMessage( rtime );
   report__('Result: "sendMessage()"', JSON.stringify( result) ); 
 
  }).fail(function(e){  
   localStorage.removeItem('is_sending_message');
  resendMessage(5000);
  report__('Error "sendMessage()"', JSON.stringify(e) );  
  });

}


function format_message_status(status){
  if(status==0) return 'awaiting';
  else if(status==1) return 'sent';
  else if( status==2) return 'delivered';
  else if(status==3) return 'read';
else return ""; 
}


function displayMessage(data_){
  //var t=performance.now()
  if( typeof data_!="object") return;
   
  var message_data=data_.message;
  
  var new_message,prepend_, resend,older_message,old_message=false;
  var area=data_.area,meta;
  
  if("is_new" in data_) new_message=true;
  if("prepend" in data_) prepend_=true;
  if("resend" in data_) resend=data_.resend;
  if("old_message" in data_) old_message=true;
  if("older_message" in data_) older_message=true;
  var daDiv=data_.display_after||""; //Check sendToServer() in upload_files.js
      
  var DB=data_.DB||"";
  
 data=JSON.parse( message_data );
  
  var mid=data.id;
  var chatId=  data.message_id; 
  var chat_from= data.message_from;
  var chat_to= data.message_to;
  var message= data.message||""; // .replace(/\s/g,' ');
  var time= data.message_time;
  var highlight= ( data.message_preview||"").replace(/"/g,"&quot;");
  
  var metas=data.meta;
  if( typeof metas==='string' ||metas instanceof String ){
    metas=JSON.parse(metas);
  }
  var can_comment=metas.can_comment;
  var version= metas.ver;
  var fullname= metas.fullname||chat_from;
  var hasFile=metas.file||"";
  var bsize=metas.size||0;
  var size= hasFile?readableFileSize( + bsize, true, 0):'';
  var folder=metas.fol||"";
  var local_path=metas.lfpath||"";
  var server_path=metas.sfpath||"";
  var vposter=metas.vposter||"";
  var dimension=metas.dimension||"";
  
  var meta_="";
  var deleted="";
  
  if( DELETED__.search( chatId)>-1){
    deleted="deleted-message";
  }
  
  //if( deleted) return; //Without indicating
  
  if( hasFile) {
  //  meta_=local_path + "|" + server_path + "|" + highlight + "|" + hasFile + "|" + bsize + "|" + dimension;
  //Not used again
  }
  
  var me=( chat_from==username?username:"");
 
  var fuser=( me?chat_to:chat_from);
 
  var is_page=false;
  var is_group=false;
  
 if( isGroupPage( chat_to) ){
    is_group=true;
    fuser=chat_to;
   
   if( isPage(  chat_to) ){
     is_page=true;
   }
   
  }  
  
  var userStadium=$('#stadium-content-' + fuser);  
 
  if( !userStadium.length ) return;  
  
 var stadium=$('#stadium-older-messages-' + fuser );
  
  if( !old_message ) stadium=$('#stadium-newer-messages-' + fuser);
  
  var lastDiv=$('#stadium-' + fuser + ' .message-bubble').last();
  
  var arrow="";
  
  var mstatus='';
  var div_class='reply-div ' + ( new_message?'new-message':'');
   
 if( me ) {
    div_class='me-div';
 var sent_=        new android.File(CHAT_FOLDER, 'CHATS/'+ fuser + '/SENT/' + chatId );
 var deliveredFile=new android.File( CHAT_FOLDER,'CHATS/' + fuser + '/DELIVERED/' + chatId );
  
 if(area==="input_box"||area==="uploadFiles" || area==="loadAwaitingSend"){
   mstatus=0;
 }
 else if( is_group || sent_.isFile() ){ 
   mstatus=1;
 }
  else if( deliveredFile.isFile() ){ 
    mstatus=2; }
   else{
     mstatus=3;
   }
  }
  else{
  localStorage.setItem('last_chat_id_' + fuser, chatId);

 if( !is_group && area==="saveMessage"){
    if( chatOpened()==fuser && !appMinimized() ){
   var gread_=new android.File( CHAT_FOLDER + "/CHATS/__READ-MESSAGES__", mid + "-" + fuser + "-" + username + "-" + chatId + ".r" );
     gread_.createNewFile();
    }
  else{
    var rdir_=new android.File( CHAT_FOLDER, "CHATS/" + fuser + "/__READ-MESSAGES__");
  if(  make_dir( rdir_) ){
    var read_= new android.File( rdir_, mid + "-" + fuser + "-" + username + "-" + chatId + ".r");
     read_.createNewFile();
   }
  }
 }
}
   
  var inv='<div class="img-div">cf:' + chat_from + ',ct:' + chat_to + '</div>';

  var chat_date=strtolower( toDate(time,'chat_date' ) );
  
  var div='<div id="message-container-' + chatId + '" class="message-container message-container-' + fuser + ( me?' my-message-container':' friend-message-container friend-message-container-' + fuser) + ' ' + deleted + '" data-friend-username="' + fuser + '" data-chat-id="' + chatId + '">'; 
 
  if( !deleted && me && hasFile) {
    div+='<div class="share-message" id="share-file-' + chatId + '" data-file-type="' + hasFile + '" data-chat-id="' + chatId + '"><img src="file:///android_asset/chat-icons/share_message.png"></div>';  
  }
  
  var sender='';
  var verified='';
  
  if(!me){
   if(is_group) {
     var cv=checkVerified(chat_from, fullname)
    verified= cv.icon;
    sender  = cv.name + " " + verified;    
   }
 }


 div+='<div class="' + (!deleted?'d-none ':'') + 'message-bubble text-dark' + ( me?' my-message-bubble':' friend-message-bubble') + ' deleted-message" id="message-bubble-del-' + chatId + '"><small><i><img class="w-10 h-10" src="file:///android_asset/chat-icons/hidden.png"> Hidden message</i></small></div>';  
 div+='<div class="' + (deleted?'d-none ':'') + 'message-bubble ' + ( hasFile?'message-bubble-' + hasFile:'') + ( me?' my-message-bubble':' friend-message-bubble') + '" id="message-bubble-' + chatId + '">';
  
  div+='<span class="chat-date chat-date-' + ( me?'me':'') + '" id="chat-date-' + chatId + '">' + chat_date + '</span>';
  if( can_comment) {
   div+='<span class="lazyc post-comment-btn" data-loader="customLoaderName" data-chatid="' + chatId + '" data-highlight="' + highlight + '">Comments <span class="total-comments" id="total-comments-' + chatId + '"></span></span>';
 }
  //if( DB=='ad'){//Awaiting Doc
    div+='<button class="del-awaiting-doc ' + ( DB=='ad'?'d-inline-block':'') + '" id="del-adoc-' + chatId + '" onclick="deleteAwaitingDoc(\'' + chatId + '\');"><img class="w-16 h-16" src="file:///assets/chat-icons/delete3.png"></button>';
 //}
  
  div+= ( size?'<span class="document-size">' + size + '</span>':'');
 
  div+='<div class="message-sender-name group-chat-from highlight" data-fuser="' + chat_from + '">' + sender.replace('~','') + '</div>';
  //div+=inv;
  div+='<span class="message-text ' + ( hasFile?' message-file ' + hasFile +'-message':' text-message') + '" id="message-text-' +chatId + '" data-chatid="' + chatId + '">' + format__( message, hasFile, fuser, chat_from,chatId, local_path, server_path, dimension, highlight, vposter, bsize) + '</span>'; 
     
  div+='<div class="time-and-status">';
  
  
  div+='<button class="resend-btn ' + (resend?'d-inline-block':'d-none') + '" id="resend-btn-' + chatId + '" data-chat-id="' + chatId + '">Resend</button>';
  div+='<span class="download-status-container" id="dsc-' + chatId + '"><span class="download-status" id="download-status-' + chatId + '"></span></span>';
  div+='<span class="upload-status-container" id="usc-' + chatId + '"><span class="upload-status" id="upload-status-' + chatId + '"></span></span>';  
  div+='<span class="chat-timestamp ' + ( me?'my-chat-timestamp':'friend-chat-timestamp') + ' timestamp timestamp-' + chatId +'" data-timestamp="' + time + '">' + toDate(time, true) + '</span>';
 if(me ){
  div+='<span class="message-status message-status-' + mstatus + ' message-status-' + fuser + '" id="message-status-' + chatId + '" data-timestamp="' + time + '" data-chat-id="' + chatId + '" data-message-to="' + fuser + '" data-status="' + mstatus + '">' + msicon( format_message_status(mstatus) ) + '</span>';        
 } 
  div+='</div>'; 
  div+='</div>';
  
 if( !deleted && !me  && hasFile ){
  div+='<div class="share-message" id="share-file-' + chatId + '" data-file-type="' + hasFile + '" data-chat-id="' + chatId + '"><img src="file:///android_asset/chat-icons/share_message.png"></div>';
 }

  div+='</div>'; 

  var isScrolledToBtm=isScrolledToBottom( userStadium,area,fuser );
  
  if( !prepend_) {
    stadium.append(div);
     }else{
    stadium.prepend(div)
  }

 
if( chatOpened("s") && area==="saveMessage") {
  messageNotifier( message, fuser, time, hasFile);
}
  
 var aud_found=$("#message-container-" + chatId ).find("audio").length;

 if(aud_found){
   mediaplayer_( $("#" + chatId + "-audio"), fuser );  
  }
  
  
if( isScrolledToBtm || "page_down" in data_ ){
 userStadium.scrollTop( userStadium.prop("scrollHeight") );
 }  
}


function format__( data, hasFile, fuser, chat_from,chatid,lfpath,sfpath, dimension, highlight, vposter, bsize){
   return bbcodeToHTML(data,fuser,chat_from,chatid,lfpath,sfpath, dimension, highlight,hasFile,vposter, bsize);
}


function formatMessage( cid, fuser, data,act){
 if(!data.msg|| !fuser) return "";
  var chatId=''; var meta='';
  
 /* var msg,file,lfpath,sfpath,hl,pt,fx,size,fol;
      msg=file=lfpath=sfpath=hl=pt=fx=size=fol="";
*/
  var currentTime=moment().unix();
  
 if( "cid" in data) cid=data.cid;
 if( "chat_id" in data) cid=data.chat_id;
 
  var can_comment="";
if( $('#can-comment').is(':checked')){
  can_comment="1";
}
  
  var obj_= new Object();
  var meta_=new Object();
  
  obj_.message_id="" +  cid;
  
  meta_.fullname=userData("fullname")||"";
  meta_.can_comment=can_comment;
  meta_.file="" + (data.file||""); //video, image
  meta_.lfpath="" + (data.lfpath||""); //local file path
  meta_.sfpath="" + (data.sfpath||""); //server file path
  meta_.vposter="" + ( data.vposter||"");
  meta_.dimension="" + (data.dimension||""); //Image/Video dimension
  meta_.pt="" + ( data.pt||""); //preview text
  meta_.size="" + (data.size||"0"); //txt size or file size  
  meta_.fx="" + ( data.fx||""); //file extension
  meta_.time="" + currentTime;
  meta_.ver="" + config_.APP_VERSION;

  obj_.message= data.msg||"";
  obj_.message_preview= data.hl||""; //Highlight (text or file highlight)
  obj_.message_to="" +   fuser;
  
  if( act){  obj_.message_from="act";
  }
  else{   obj_.message_from= username;
  }
  obj_.message_time="" + currentTime;
  obj_.meta=meta_;
  
 return JSON.stringify(obj_);
}

  
function sortChats(friend , message){
 if(message){
   message=message.substr(0,100);
   message=message.replace(/(\s|<br>|\?b|\?g|\?lg|\?sm|`|-|\*|\~|_|\^|\|)/g, " ")
   .replace(/</g,'&lt;');
 }
  
  var sortTimestamp=moment().unix();
  var cfile=new android.File( CHAT_FOLDER, "CHATS/chat_list.txt");

  var data="";

  NEWCHATS__[friend]={"message":message,"timestamp":sortTimestamp};
  
 if( NEWCHATSFILE.write(JSON.stringify( NEWCHATS__ ,null,"\t") )){
     updateChatsList( friend, message );
    $("#chats-list-page #no-chat-yet").remove();   
  }

}



function copyToAwaitingSend( formatted,callback){
 try{ 
  var aDir=new android.File( CHAT_FOLDER, 'CHATS/__AWAITING_SEND__');
  var pf=JSON.parse( formatted );
  var chatid=pf.message_id;
 var cfile=new android.File( CHAT_FOLDER,  'CHATS/__AWAITING_SEND__/' + chatid + '.txt');
  
 if( make_dir( aDir) ){
   if( cfile.write( formatted) ){
    if( typeof callback=='function')
     callback();
   }
 }
 }catch(e){
   toast('Couldn\'t copy to awaiting send.' + e);
   logcat("function copyToAwaitingSend:main.js", e); 
    
  // report__('ERROR "copyToAwaitingSend()"',e);
  }    
}


function zIndex(value){
  var currentIndex=+$('.z-index').text();
  if(value===0) {
   var nextIndex=0
    currentIndex=0;
  }else{
   nextIndex=currentIndex+1;
  }
 $('.z-index').text(value||nextIndex);
   return value||currentIndex;
}


function partitionDB(fuser){
  
  try{ 
    //When partition db is full rename it 
 if(sessionStorage.getItem('partitioning') ) return;
    sessionStorage.setItem('partitioning','1');
    var db=new android.File(MAIN_FOLDER,username + '/CHATS/' + fuser + '/awaiting_partition.db');
 if(!db.isFile() ) {
 sessionStorage.removeItem('partitioning');
    return;
  }
   var len=db.length();   
  if(len && (len/1000)>config_.DBpartitionSize){ 
  
 var fol=new android.File( MAIN_FOLDER,username + '/CHATS/' + fuser + '/DB');
 make_dir(fol);
  var totaldb=fol.list().length;
  
 var renTo=new android.File(fol, (totaldb+1))
  if(!db.renameTo(renTo ) ){
  sessionStorage.removeItem('partitioning');
    return toast('Critical: Check that you have space on your device or app may crash.');
     //report__('Error "splitDB()"','Unable to partition DB' + db.toString() ); 
   }
  }
  sessionStorage.removeItem('partitioning');
  }catch(e){
 logcat("function partitionDB:main.js", e); 
    
  sessionStorage.removeItem('partitioning');
 }
}


function send( fuser,message, len,act){
fuser= fuser||$.trim( $("#message-to").val() );
  
  var deli_=new android.File( CHAT_FOLDER, "CHATS/" + fuser + "/DELIVERED");
  
if(!deli_.isDirectory() && !deli_.mkdirs()){
  return toast("Could not create deli dir");  
}
  if(!message ){ return false; }
  
  var cid= Date.now() //randomNumbers(15 );  

 var  hl=substring_(message, 0, 100);
  
 var message1=sanitizeMessage( message, act);
 var message2=sanitizeLocalText( message, act);
  
 var formatted= formatMessage( cid, fuser, { msg: message1, hl: sanitizeMessage(hl),size:len}, act );
 var localFormatted= formatMessage(cid, fuser, { msg: message2, hl: sanitizeLocalText( hl),size:len}, act );
  
 if(!act ){
   
   displayMessage({ 'message': localFormatted,
    'page_down': true,
    'area':'input_box',
    'DB':'ap'
  });
  
 sortChats( fuser, message );
   }
  var pf=JSON.parse( formatted );
  var chatid=pf.message_id;
    
 try{ 
  copyToAwaitingSend( formatted, function(){
   if(!act) {
   saveToDB( fuser, localFormatted, "input" ,true);
   }
  });
 }catch(e){
   toast( e);
 logcat("function send:main.js", e); 
 }
  
  sendMessage();
  
 if(!act){
   sessionStorage.removeItem("temp-text-" + fuser); 
  localStorage.setItem("last_message_id_" + username + "_" + fuser,chatid);
  localStorage.setItem("last_message_status_" + username + "_" +  fuser, "awaiting");
  localStorage.setItem("last_message_timestamp_" + username + "_" + fuser, moment().unix() );
  $("#message-preview-status-" + fuser ).html( msicon("awaiting") ); 
 
 }
}


function messageReadFeedback(fuser){
   if(!fuser ) return;
  else if(isGroupPage( fuser) ){
    var t_='Tap here for group info';
    if( isPage(fuser) ){
     t_='Tap here for page info';
    }
     $('#last-seen-' + fuser).text(t_);
    return;
 } 
 
  var rdir_=new android.File( CHAT_FOLDER, "CHATS/" + fuser + "/__READ-MESSAGES__");
  var gdir_=new android.File( CHAT_FOLDER, "CHATS/__READ-MESSAGES__");
  
  if( !make_dir( gdir_ ) ) return;
  if( !make_dir( rdir_ ) ) return;
  
  var list=rdir_.list();
  var total_read=list.length;
  if( total_read<1 ) { return; }
  
   for(var r=0; r<total_read; r++){
     
   var filename=  list[r]; 
     var file=new android.File( rdir_, filename);
     var renameTo_= new android.File(gdir_, filename );
     file.renameTo(renameTo_);
   }  
 }

function clearTextBox( aftersend){
  var textBox=$('#text-box');
  var tboxCont=$("#text-box-cont")
  var tboxResult=$("#text-box-result");

  textBox.val("");
  tboxResult.empty();
  textBox.height(28); //autoHeight();
  tboxCont.height(28); //autoHeight();
  tboxResult.height(28); //autoHeight();
  tboxResult.html( inputPlaceholder());
 // sessionStorage.removeItem('temp-text-' + fuser);   
}

function inputPlaceholder(){
  $("#attachment-btn-cont").show();
   
 return '<span style="color:#999; font-weight: 500;">Message</span>';
}

$(function(){
  $('.app-label').html(APPLABEL);
 
  friends_(true);
  
  var sendBtn=$('#send-message-btn');
  var voiceBtn=$('#voice-message-btn');
  var textBox=$('#text-box');
  var tboxCont=$("#text-box-cont")
  var tboxResult=$("#text-box-result");

$('#text-box').on('scroll', function () {
    $('#text-box-result').scrollTop($(this).scrollTop());
}) 
  
$("body").on("input","#text-box",function(){
  
  var this_=$(this);
  var fuser=$.trim($('#message-to').val());
  var text_=this_.val();
  
  var tlen=text_.length;
 
  this_.height(0);
   var sheight=this.scrollHeight;
    this_.height( sheight  );
    
 if(!tlen){
   tboxResult.html( inputPlaceholder());
 }else{
   $("#attachment-btn-cont").hide();
   var result= text_.replace(/</g, "&lt;"); // .replace(/<(?!br\s*\/?)[^>]+>/g,"");

 var format= bbCode( result, true, fuser);
     tboxResult.html( format );
 }
  var tbheight=this_.outerHeight();
  tboxCont.height( sheight);   
  tboxResult.height( sheight );
 
// tboxResult.scrollTop( this_.scrollTop() );
 
   if( tlen>0 ){
     voiceBtn.css('display','none');
     sendBtn.css('display','block');  
   }else{
     if( previewFilesOpened()) return;
 if( !$('#comment-container').is(':visible') ){
    sendBtn.css('display','none')
   voiceBtn.css('display','block');
    }
   }
        
  //temp-text, to temp. save text entered before send
  //should in case user clicks back before sending, so
  //text entered in textbox can be repopulated
    sessionStorage.setItem('temp-text-' + fuser, text_);
   sessionStorage.setItem('typing_to', fuser);
  clearTimeout(typingTimeout);

typingTimeout=setTimeout(function(){
    sessionStorage.removeItem('typing_to');
  },3000);
  
 });
  
  
$('body').on('click','#send-message-btn',function(e){ 
 var fuser=chatOpened('s');
  var sett=canSendChat( fuser);
  
 if( sett==0 ){
   return toast("Chat disabled");
 }else if( sett==-1 ){
   return toast("Loading settings. Try again",{type:"info"});
 }
  
 if(  previewFilesOpened() ){
    sendPreviewedFiles();
  return;
 }
  
  textBox.focus();   
 var msg=( textBox.val()||"").trim();
  
 var mlen=( msg.length+1)/1024;
 
  if( $('#comment-container').is(':visible') ){
    add_comment(fuser, msg, mlen );
    return;
  }
  
 if( mlen>config_.max_text_size ){
  return toast('Message too long.', {type:'light',color:'#333'});
 }
   
  clearTextBox();
   $('#send-message-btn').css('display','none');
   $('#voice-message-btn').css('display','inline-block');
  
if( !siteAdmin(username)){
  msg=msg.replace(/\[\/(.*?)\]/g,"[/$1 ]");
}
  send("", msg, mlen );
  
 });
  
  
$('body').on('click','.move-page-down',function(){
   var fuser=chatOpened('s');
   var sb=$('#stadium-content-' + fuser);
   sb.scrollTop(sb.prop("scrollHeight") );
  $(this).hide();
 });

  
$('body').on('click','.friend', function(){
 if( $('#chats-list-toolbar1,#group-profile-page #group-user-options-menu').is(':visible')){
  $('#group-user-options-menu').css('display','none');
   return;
 }  
  else if(  friendMessageSelected ) return;
  intervalRestCount=0;
    var this_=$(this);
    var fuser= $.trim(this_.data('friend') );
   if( fuser==username && username!='av_official'){
     return android.toast.show("You can't chat yourself up");
   }

  
  $('#message-to').val(fuser );
  $('#reading-message-from').val(fuser);
  
  var canc=$('#can-comment');
   canc.prop('checked', true);
  
  appendStadium(fuser, 'load');
  closeComment();
  
   
  var vicon='';
  var lockTextBox=false;
  var is_admin=is_group_admin( fuser, username);
 
  var is_official,is_group,is_page,is_verified;
      is_official=is_group,is_page=is_verified=false;
  var g_p=isGroupPage(fuser);
  
  if(  g_p ){
   //is_group= true;
 var glock=new android.File( MAIN_FOLDER, username + '/CHATS/' + fuser + '/lock.md');
 
  if( !is_admin && ( glock.isFile()|| fuser=="gv_pofficials") ){
  lockTextBox=true;
   }
 }
 
 if( userVerified( fuser) ){
   is_verified= true;
  vicon='<img class="verified-icon" src="file:///android_asset/chat-icons/verified_icon.png"> ';
   
 if( fuser=="uv_private" ) {
     lockTextBox=true;
   }   
 }
 
  var fname=$.trim( $('.friend-name-' + fuser + ':first').text() );
  
  $('#chatting-friend-name-' + fuser ).html( fname.replace(/</g, '&gt;') + " " + vicon);
   
  
 var fmc=+localStorage.getItem('friend_message_count_' + username + '_' + fuser);
    localStorage.removeItem('friend_message_count_' + username + '_' + fuser);
 $('#friend-message-count-' + fuser).text('0').hide();
  
 if( fmc){
   var fmcd=$("#stadium-" + fuser + " .message-container:eq(-" + fmc + ")");
    fmcd.before('<span id="nmc-' + fuser + '" class="new-messages-crossline new-messages-crossline-' + fuser + '">New messages</span>');
  }
   
 var temp_text=$.trim( sessionStorage.getItem("temp-text-" + fuser) );
 var cgroups=localStorage.getItem( username + "_groups")||"";

  var cover_text="Only admins can send message";
  var ctb=$("#cover-text-box");
 
  ctb.css("display","none");

if( lockTextBox || ( isGroupPage(fuser) && !inGroups( username, fuser) ) ){
  ctb.css("display","block");
  ctb.text( cover_text)
 }

 else if( BLOCKED_CONTACTS__[fuser]){
    $("#contact-blocked-cover").css("display","block").attr("data-fuser", fuser);
  }
  else{
    $("#contact-blocked-cover").css("display","none");
  }
  
  if(g_p ){
   $("#can-comment-container").css("display","block"); 
 }
  else{
 $("#can-comment-container").css("display","none");
    canc.prop("checked", false);
  }
  
  if(temp_text){
   voiceBtn.hide();
   sendBtn.css("display","inline-block");
    textBox.val( temp_text);
    tboxResult.html( bbCode( temp_text.replace(/\n/g,"<br>"), true ) )
  }
   else{
     sendBtn.hide();
     voiceBtn.fadeIn();
     clearTextBox();
     tboxResult.html( inputPlaceholder() )
   }
// var tbheight=$("#text-box").innerHeight()
// tboxResult.height( tbheight);
  textBox.autoHeight();
 tboxResult.autoHeight(); 
  
 setTimeout(function(){
   $('#stadiums .stadium').css('display','none'); 
  $('#stadiums-container').removeClass('visually-hidden');
  $('#stadium-' + fuser).css('display','block');
   
   if(!fmc){
 var fscontent=$('#stadium-content-' + fuser);
  fscontent.scrollTop(  fscontent.prop("scrollHeight") );
   }
   else{
     if( $('#stadium-' + fuser + ' #nmc-' + fuser).length){
    $('#nmc-' + fuser).get(0).scrollIntoView(true);  
     }
   }
   
  
  var conts=$('#contacts-container,#profile-friend-page,#create-group-form-container,#groups-container');
      conts.removeClass('viewing-contacts viewing-groups viewing-create-group-form').css('display','none');
   $('#group-profile-page').css('display','none');
   
 $('#message-notifier-container .notifier-' + fuser).remove();
    
 },100);
  
   var cl=$('#chats-list-page');   
  
      cl.find('.friend-preview-container').removeClass('friend-message-selected-indicator');
      cl.find('.friend-preview-container-' + fuser).addClass('friend-message-selected-indicator');

    messageReadFeedback( fuser);
  
  if( !sessionStorage.getItem('saving_message') ){
    partitionDB( fuser);
  }
 //  moreLoader( fuser );
  
  $('#stadium-content-' + fuser + ' #page-down-' + fuser).hide(); 
  $('.header-button:first').click();
});
  
  
$('body').on('click','.post-chat-user,.group-chat-from', function(){
  //Check bbcode.js, displayMessage(group chat_from)
  var fuser=$(this).data('fuser');
 if(!fuser) return;
  fuser=strtolower(fuser.replace('~','') );
  var $elem=$('<div/>', {
    'class': 'dyn-friend friend friend-' + fuser + ' friend-name-' + fuser,
    'data-type':'friend',
    'data-friend':fuser,
    'data-fname':fuser,
    'text': fuser,
   });
  $elem.appendTo('body');
  $elem.click();
  $elem.remove();
  $elem=null;
});
      
$('body').on('click','#add-contacts-btn',function(){
  var div=$('#add-contact-container');
   var this_=$(this);
    if(this_.hasClass('loaded') ){
   div.addClass('viewing-add-contact-form').fadeIn();
      return;
    }
   this_.prop('disabled',true);
    
   $.ajax({
      url:'file:///android_asset/add-contact.html'
    }).done(function(result ){
      div.html(result);
      this_.addClass('loaded');
      this_.prop('disabled', false);
     div.addClass('viewing-add-contact-form').fadeIn();
    }).fail(function(e){
     this_.prop('disabled', false);
     toast( JSON.stringify(e));
   });
});
  
  
  $('#chats-list-page').on('press', '.friend-preview-container', function(e) {
    //finger.js
    var this_=$(this);
    var fuser=this_.data('username');
 if(!$('#friend-chat-selected-' + fuser).length){
     friendChatSelect(fuser);
   chatsListToolbar1();
  }
   else{
     this_.removeClass('mouseover')
    $('#friend-chat-selected-' + fuser).remove();
   }
   
   var totalSelected=$('.friend-chat-selected').length;
 if(!totalSelected ){
   chatsListToolbar1('cancel');
 }else{
   $('#chats-selected-count').text(totalSelected)
 }
 });
  
  
 $('#chats-list-page').on('click','.friend-preview-container',function(){
   var this_=$(this);
   var fuser=this_.data('username');
  
 if( $('#friend-chat-selected-' + fuser).length){
    $('#friend-chat-selected-' + fuser).remove();
  }else if($('.friend-chat-selected').length){
      friendChatSelect(fuser);
  }

  var totalSelected=$('.friend-chat-selected').length;
 if(totalSelected>0 ){
  $('#chats-selected-count').text(totalSelected)
 }
  else{
     chatsListToolbar1('cancel');
   }
   
});
  
  
});

  function friendChatSelect(user){
    var elem=$('<div></div>')
    .addClass('friend-chat-selected')
    .attr('id','friend-chat-selected-' + user)
    .attr('data-username', user);
    $('.friend-preview-container-' + user).prepend(elem);
  }


    
 function addContact(fuser,fullname,callback){
   
   fuser=fuser||$.trim($('#friend_username').val() );
   fuser=strtolower(fuser);
   fullname=fullname||$.trim( $('#friend_fullname').val() );
  
 var userdata=CONTACTS__[fuser];  
   
 if( !fuser ||fuser.length<4){
 return toast("Enter a valid username");

}else if( userdata){
  return toast("Already added", {"type":"info"});
}else if( fuser==strtolower(username) ){
   return toast("You can't add yourself");
}
 
 if(fullname){
   fullname=$.trim( fullname.replace(/\s+/g," ")
   .replace(/\|/g,'') );
 
 if(fullname && ( fullname.length<2 || fullname.length>70) ){
    return toast('Name is too short or long or contains unwanted characters',{hide: 6000});
   }
 }   
 
   
 $('#add-contact-loading').fadeIn();
 
var btn= $('#add-contact-btn');
   btn.prop('disabled', true);
   
   sessionStorage.setItem('adding_contact_' + fuser,'yes');
                                 
 setTimeout(function(){
   if ($addContactRequest != null){ 
    $addContactRequest.abort();
    $addContactRequest = null;
}

   sessionStorage.setItem('adding_contact_' + fuser,'YES');
   
   $addContactRequest=$.ajax({
    url: config_.domain + '/oc-ajax/add-contact.php',
    type:'POST',
  timeout: 20000,
     dataType: "json",
    data: {
      "username": username,
      "friend_username": fuser,
      "contacts": sync_contacts(),
      "version": config_.APP_VERSION,
      'token': __TOKEN__
    }
  }).done(function(result){
   //alert(JSON.stringify(result) );
  sessionStorage.removeItem('adding_contact_' + fuser);
     
     $('#add-contact-loading').fadeOut();
    btn.prop('disabled', false);
 sessionStorage.removeItem('adding_contact_' + fuser);
  
   if(result.status && result.status=='success' ){
   try{
     
      saveContact( result.contact, fullname, function(result_,text){
    //result_- user fullname or "error"
    if(result_=='error'){
      return toast(text);
    }
     else { callback(fuser, result_); 
     $("#friend-preview-container-" + fuser).removeClass('add-contact-' + fuser);
    }
     report__('"addContact()" Added ' + fuser, JSON.stringify(result) );   
  });

   }catch(e){ 
   // alert(e)
   sessionStorage.removeItem('adding_contact_' + fuser);
   android.toast.show('Unable to save contact');
  report__('Error "addContact()"',e);
    logcat("function addContact:main.js", e);    
  } 
 }else if( result.error){
    toast(result.error);
  }
 else{
   toast('Unable to save contact at the moment');
  }
 // $('#stadium-' + fuser + ' .add-contact-menu-btn-' + fuser).show();

  
  }).fail(function(e,txt,xhr){
     $('#add-contact-loading').fadeOut();
     sessionStorage.removeItem('adding_contact_' + fuser);
    btn.prop('disabled', false);
   android.toast.show('Something went wrong. Try again');
   report__('Error ".add-contact", fail', JSON.stringify(e) );
   
   if( xhr!='timeout'){ 
     logcat("function addContact:main.js", JSON.stringify(e) );
    }
  });
   
 },1500);
 }
  

function saveContact( result, save_as, callback){
  var fuser=result.username;
  var fdir=new android.File(MAIN_FOLDER, username + "/CHATS/" + strtolower(fuser) + "/DB");     
  
if( !fdir.isDirectory() && !fdir.mkdirs()){
  return  callback("error","Unable to create " + fuser + " Directory");
 }
  delete result["status"];
  delete result["bio"];
  delete result["birth"];
  delete result["joined"];
  
  result["app_version"]=config_.APP_VERSION;
 
  CONTACTS__[fuser]=result;
 
  if( CONTACTSFILE.write( JSON.stringify( CONTACTS__, null, "\t") ) ){
  callback( result.fullname );
   
    /* 
    var pfile=new android.File( PUBLIC_FOLDER, username + '/USERS-PROFILES/' + fuser+ '.txt');
     pfile.write( JSON.stringify( result.full_contact) );
*/
  
  }else {
    callback('error','Could not save contact');
  }
    
}



function showContacts(reload ){ 
 var div=$('#contacts-container');
  div.addClass('viewing-contacts');
 
   div.addClass('contacts-loaded');    
 
  try{
 
   var contacts=loadContacts();

    $('#contacts').html( contacts);
   
  sortElementsById('#contacts>div','#contacts', true);
 
  setTimeout(function(){
    div.css('display','block');
  },200);
}catch(e){ 
  report__('Error "showContacts()"',e);
  logcat("function showContacts:main.js", e); 
    
     }
  }
    


function loadContacts(action_){
  var tc=$('#total-contacts,.total-contacts');

 var data='';
 
 var total_contacts_=Object.keys( CONTACTS__).length;
    
  var total_contacts=0;
 $.each( CONTACTS__,function( fuser, data_){
  
  if( !isGroupPage(fuser)){
     total_contacts++;
     var fname=data_.fullname;
     
      var verified='';
      var duser=fuser;
  
  var cv=checkVerified( fuser);
    verified= cv.icon; //'<img class="verified-icon" src="file:///android_asset/chat-icons/verified_icon.png"> ';
      
  var r_=randomString(4);
      
   data+='<div id="' + ( fname.replace(/[^a-zA-Z0-9]/g,'') )+ r_ + '" class="contact-container">';
   data+='<div class="container-fluid">';
   data+='<div class="row">';
   data+='<div class="col">';
   data+='<div class="contact-photo-container">' + friendProfilePicture(fuser,'contact-photo',verified) + '</div>';
   data+='</div>';
   data+='<div class="col">';
   data+='<div class="contact-friend-name-container ' + ( action_ ? action_: 'friend') + ' friend-' + fuser + '" data-fname="' + fname + '" data-type="friend" data-friend="' + fuser + '">';
   data+='<div class="contact-friend-name contact-friend-name-' + fuser + ' friend-name-' + fuser + '">' + fname + '</div>';
  
   data+='<div class="contact-friend-username">' + duser + verified + '</div>'; 
   data+='</div>';
   data+='</div>';
if(!action_ ){
   data+='<div class="col text-center" style="width: 70px; max-width: 70px;">';
   data+='<img class="delete-contact-loading" id="delete-contact-loading-' + fuser +'" src="file:///android_asset/loading-indicator/loading2.png">';
   data+='<button class="delete-contact-btn" id="delete-contact-btn-' + fuser +'" data-username="' + fuser + '">&nbsp;</button>';
   data+='</div>';
}
   data+='</div></div></div>';
   }
     
 });
  
  
  if(!total_contacts_) {   
   // tc.html('<span class="total-contact">0</span> contacts');
    tc.text("0 contact");
 
   if( action_ )   return "";
   else{
     return noContactYet(action_);
   }
  }
  
  if(action_){
    //Including groups
  tc.text( total_contacts_ + " contacts");
  }else{   
    tc.text( total_contacts + " contacts");
  }
  
  return data;
 }


function updateContact(data ){
  //Data: json
}

function sync_contacts(){
 var c_={};
   var total_contacts=0;
 $.each( CONTACTS__,function( fuser, data_){
  if( !isGroupPage(fuser) ){
     total_contacts++
     c_[fuser]=data_;
   }
 });
  
 if( total_contacts<1) return "{}";
  
  var contacts=JSON.stringify( c_);

  return contacts;
}

function serverSavedGroups(){
     //When a fresh login or new device detected,
      //User saved groups should pop up so he can 
      //refollow those groups
   var sg= $.trim( localStorage.getItem( SITE_UNIQUE__ + "_" + username + '_server_saved_groups') );
    if(sg){
    sg=sg.split(' ');
      
  var ssgdata='<div class="text-left" style="position: relative; font-weight: bold; padding: 10px 15px;">';
      ssgdata+='<img onclick="closessg();" src="file:///android_asset/chat-icons/cancel.png" style="width: 20px; height: 20px; position: absolute; right: 20px; top: 10px;">';
      ssgdata+='<small>We detected a fresh login or a new device</small><br>';
      ssgdata+='Follow your pages or groups again...</div>';
      ssgdata+='<div class="center_text_div text-left;">';
      ssgdata+='<div class="container-fluid text-left" style="padding: 0 15px 15px 15px;">';
    var ssg=""
   $.each( sg,function(i,v){
     ssg+="[[" + v + "]]<br>";
   });
 
   ssgdata+=bbCode( ssg);
   ssgdata+='</div></div>';
      
   displayData( ssgdata ,{ data_class:'.refollow',no_cancel: true })    
    }
  }
    
 function closessg(){
   localStorage.removeItem(SITE_UNIQUE__ + "_" + username + '_server_saved_groups');
closeDisplayData('.refollow');
 }
    

function triggerOnFirstPageLoad(){
  // reloadFriendThumbnails();
  
  updateNotification();
  serverSavedGroups();
  
$("#create-group-form-btn,#add-contacts-btn,#show-groups-btn-cont").hide();
 
try{
  var settings= JSON.parse( localStorage.getItem("server_settings") );

   miniSettings( settings, true);
  
 }catch(e){
  return toast("Loading settings...", { type:"info"});
 }
}


function reloadFriendThumbnails(){
  //Check function friends(); 
  //It saves & sets period friends pictures should reload or refresh
  var fiveMin=moment(new Date() ).add(5,'minutes').unix();  
 var currentTime=moment().unix();
 
  var uc=+localStorage.getItem('rft_check_');
 
  if(!uc ) {
    
  localStorage.setItem("rft_check_", fiveMin);
    uc=fiveMin;
  }  
   if (currentTime<uc ) return;
 //To clear webview cache only: android.java.webView.clearCache(true);
  try{
    //To clear app cache
 /*
  var file=android.java.activity.getCacheDir();
  var path=file.getPath();
  var dir=new android.File( path);
      dir.deleteFileOrFolder();
    */
    
  }catch(e){
  logcat("function reloadFriendThumbnails:main.js", e); 
  }
  localStorage.setItem('reload_friend_thumbnails', randomNumber(3));
  localStorage.setItem('rft_check_', fiveMin);
}


function cJob(name, time_, callback){
   //time_ in minutes
 var timeout=moment(new Date() ).add(time_,'minutes').unix();  
 var currentTime=moment().unix();  
  var uc=+localStorage.getItem(name + '_check');
   if(!uc ) {
  localStorage.setItem( name + '_check', timeout);
   uc=timeout; }
  if (currentTime<uc ) return;
  localStorage.setItem(name + '_check', timeout );
  if(typeof callback=='function'){
     callback();
  }
}
 
