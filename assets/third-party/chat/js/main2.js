
if(!__TOKEN__){
  // console.log('test')
   //android.activity.loadUrl("main","about:blank");
  }

var notifyTimeout;
var SELECTEDMESSAGES_={};
var totalFilesSelected=0; //Files selected in selectMessage()
var totalFilesUnsentSelected=""
var friendMessageSelected="";
var totalSelected=0;


function recordVoice(t){
 var this_=$(t);
  var fuser=chatOpened('s');
  var sett=canSendChat( fuser);
  var adm=siteAdmin( username);
 if( sett==0 ){
   return toast("Chat disabled");
 }else if( sett==-1 ){
   return toast("Loading settings. Try again",{type:"info"});
 }
    
    try{
  var settings= JSON.parse( localStorage.getItem("server_settings") );
 
  if( !adm && !siteAdmin(fuser) && settings.enable_file_upload!="YES"){
  return toast("Currently disabled");
}
 
 }catch(e){ 
  return  toast("Loading settings...", { type:"info"});
 }
        
if(!hasPermission(recordPermission)){
  requestPermission( recordPermission);

 setTimeout(function(){
 if( !this_.hasClass("asked")){
   this_.addClass("asked");
   this_.click();
 }
  },1000);
  return;
  }
  
  $("#record-stadium").show();
  $("#max-record-time").text(config_.max_record_time);
 displayData("", { append: false, dummy: true, osclose: false, on_close: "cancelRecord", data_class: ".voice-message-dummy"});
   try{  
     
 if( !this_.hasClass("recorderloaded")){
   var scriptUrl = "file:///assets/chat/js/recorder.js";
 
var script = document.createElement("script");
script.type = "text/javascript";
script.src = scriptUrl;
script.onload = function() {
   this_.addClass("recorderloaded");
 };
script.onerror = function(e) {
  toast("Record failed: " + JSON.stringify(e));
  cancelRecord()
};
 document.head.appendChild(script);
 
 }
   pauseAudioPlayer();
 }catch(e){ alert(e); }
  
 }


function cancelRecord(){
 
 var rs= $("#record-stadium");
 if( !rs.is(":visible") ) return;
 recordCanceled=true;
  
 rs.hide();  
  if( isRecording){
  isRecording=false;
    stopRecord.click();
  }
 closeDisplayData('.voice-message-dummy');
}


function messageNotifier(message, fuser,time,hasFile){
  if(!message || chatOpened('s')==fuser) return;
  clearTimeout(notifyTimeout);
  message=str_ireplace( message, ['<','>',':nl::'], ['&lt;','&gt;',' '] );
  
  var fname=$('.friend-name-' + fuser + ':first').text()||fuser||"";
  var verified='';
  
  if( userVerified( fuser) ){
    verified='<img class="verified-icon" src="file:///assets/chat-icons/verified_icon.png"> ';
  }
   
 var data='<div class="notifier-' + fuser + '"><span class="notifier-name">' + fname + verified + '</span>';
      data+='<span class="the-notifier-message">' + ( hasFile?strtoupper(hasFile): message.substr(0,100) ) + '</span>';
      data+='</div>';
  
  var div=$('#message-notifier-container');
  var div2=$('#notifier-message');
      div2.prepend(data);
 if( !div.is(':visible') ) div.slideDown();
  
  notifyTimeout=setTimeout(function(){
    div.fadeOut("fast");
  },4000);
}

function toggleStadiumMenu(fuser){
 var cont=$("#menu-item-container");
 var adding=sessionStorage.getItem("adding_contact_" + fuser);
 
  var inContact=CONTACTS__[fuser];
  var blocked=BLOCKED_CONTACTS__[fuser];
  var grp_page=isGroupPage( fuser);
  
   var data="";
 if(!blocked && !grp_page && !inContact && !adding){
    data+='<li class="menu-item" id="add-contact-menu-btn">Add Contact</li>';
   }
  

if( !grp_page && !siteAdmin(fuser) ){
  if( blocked ){
    data+='<li class="menu-item" id="menu-unblock-user" data-fuser="' + fuser + '" onclick="unblockUser(this);">Unblock</li>';
  }  else{
   data+='<li class="menu-item" id="menu-block-user" data-fuser="' + fuser + '" onclick="blockUser(this);">Block</li>';
 }
  }
   data+='<li class="menu-item" id="clear-chat">Clear chat</li>';
 cont.html( data);
 $("#stadium-menu-container").toggle();
}


function blockUser(t){
  var this_=$(t);
  var fuser=this_.attr("data-fuser");
 if( siteAdmin(fuser ) ){
  return $("#stadium-menu-container").hide();
  }
  
  BLOCKED_CONTACTS__[fuser]=1;
  BLOCKEDCONTACTSFILE.write( JSON.stringify( BLOCKED_CONTACTS__) );
 toast("Blocked on this device");
 $("#stadium-menu-container").hide();
 $("#contact-blocked-cover").css("display","block").attr("data-fuser", fuser);
  send( fuser, "block-contact|" + username + "|" + moment().unix(), 4, "act");
}

function unblockUser(t){
  var this_=$(t);
  var fuser=this_.attr("data-fuser");
 if( siteAdmin(fuser ) ){
  return $("#stadium-menu-container").hide();
  }
  
  delete BLOCKED_CONTACTS__[fuser];
  BLOCKEDCONTACTSFILE.write( JSON.stringify( BLOCKED_CONTACTS__) );
 toast("Unbocked on this device",{type:"info"});
 $("#stadium-menu-container,#contact-blocked-cover").css("display","none");
  send( fuser, "unblock-contact|" + username, 4, "act");
}



function chatsListToolbar1(type){
  if(type ){
   $('.friend-chat-selected').remove();
    $('#chats-list-toolbar1').hide();
     $("#nav-bar-top").fadeIn();
    
  try{
  var settings_=JSON.parse( localStorage.getItem("server_settings"));
   var adm=siteAdmin( username);
 
if(!adm && settings_.enable_chat=="NO"){
   return  $("#show-contacts-btn").hide();
}
/*
else if(!adm && settings_.enable_send_chat=="NO"){
   return $("#show-contacts-btn").hide();
}    
 */
 }catch(e){
   return toast("Loading settings...");
 } 
  
   $("#show-contacts-btn").fadeIn();
  
 }
  else{
   $('#nav-bar-top,#show-contacts-btn').hide(); 
    $('#chats-list-toolbar1').fadeIn();
  }
}

function toggleVideoPlayButton(hide_){
 if( hide_ ) {
 //  $('.chat-video,.mejs__layer,.mejs__controls').css({'visibility':'hidden'});
 }
  else {

//  $('.chat-video,.mejs__layer,.mejs__controls').css({'visibility':''});
  }
 }




function messageSelectedToolbar(type){
  var fuser=chatOpened("s");
  var cover=$("#chats-list-cover-container");
 if( type){
   toggleVideoPlayButton();
   $(".message-selected").remove();
   $("#message-selected-toolbar").css("display","none");
   cover.css("display","none");
   $("#stadiums a").removeAttr("disabled");

   totalFilesSelected=0;
   totalFilesUnsentSelected="";
   friendMessageSelected="";
   SELECTEDMESSAGES_={};
  $("#copy-message").css("display","inline-block");
  }
  else{
    $("#stadiums a").attr("disabled", true);
    toggleVideoPlayButton( true);
    $("#message-selected-toolbar").fadeIn("fast");
    
  cover.fadeIn();
  chatsListToolbar1("cancel");
 }
}


$(function(){

 $('body').on('click','.header-button',function(){
    var this_=$(this);
   var item=this_.data('header-button-item');
   $('.header-button').removeClass('header-button-selected');
   this_.addClass('header-button-selected');
   $('.header-page').css("display","none");
   $('#' + item).css("display","block");
  
   if($('#chats-list-toolbar1').is(':visible')){
     if(item!='chats-list-page-container'){
       chatsListToolbar1('cancel');
      }
   }
    
  });
  
 
  
 $('body').on('click','#stadium-menu-container',function(){
    $(this).css("display","none");
  });
  
 $('body').on('click','#add-contact-btn', function(){
   var this_=$(this);
  // this_.prop('disabled',true);
  addContact(false,false, function(friend_username,fullname){
    this_.prop('disabled',false);
    appendStadium(friend_username);
     $('#friend_username, #friend_fullname').val('');
    toast('Contact saved.',{ type: 'success'});
        
   $('#contacts-container').removeClass('contacts-loaded');
   $('#chatting-friend-name-' + friend_username).text(fullname);
    showContacts(1);
   });
        
 });

  $('#stadiums-container').on('click','#add-contact-menu-btn',function(){
  var fuser=chatOpened('s');
    if(sessionStorage.getItem('adding_contact_' + fuser) ){
       return;
    }
   
  addContact(fuser, false , function(fusername, fullname){
   appendStadium(fusername);
   $('#contacts-container').removeClass('contacts-loaded');
   $('#chatting-friend-name-' + fusername).text(fullname);
  toast('Contact saved.',{ type: 'success'});
     });
   });
  
$("#stadiums").on("click","a",function(e) {
    var d= $(this).attr('disabled');
    if (d === 'disabled') {
        e.preventDefault();
    }
});
  
$('#stadiums').on('press', '.message-bubble a', function(e) {    
    var href=$(this).text();
    android.clipboard.setText(href.replace(/"/g,"") );
    toast("Link copied", {type: "primary"});  
});
  
  $('#stadiums').on('press', '.message-container', function(e) {
    //finger.js
   if( $(e.target).is("a") ){
     return; 
   }
    var this_=$(this);
    var chat_id=this_.data("chat-id"); 
    
   if( this_.hasClass("deleted-message") ){
     return toast("Hidden message", {type:"primary"});
   }
   else if( this_.hasClass("friend-message-container") && friendMessageSelected.search(chat_id)<0){
     friendMessageSelected=friendMessageSelected + chat_id + " ";
   }
    var fuser=chatOpened("s");
      
  if( !$("#message-selected-" + chat_id).length){
    
   totalSelected=selectMessage(fuser,chat_id);
   messageSelectedToolbar();
  }
   else{
    totalSelected=deselectMessage(fuser,chat_id);
   }
   
  if(!totalSelected ){
   messageSelectedToolbar("cancel");
 }else{
   $('#message-selected-count').text(totalSelected);
  }
 });
  
  
 $('#stadiums').on('click','.message-container',function(){
   var this_=$(this);
   var chat_id=this_.data("chat-id");    
   var fmc=this_.hasClass("friend-message-container");
   
   if( this_.hasClass("deleted-message") ){
     if(!fmc){

   var del_bub=$("#message-bubble-del-" + chat_id );
 
if( del_bub.hasClass("d-none") ){
   $("#message-bubble-" + chat_id ).addClass("d-none");
   del_bub.removeClass("d-none");
  return;
  }   

 var ppin=localStorage.getItem(username + "_privacy_pin")||"1234";
 var pass=prompt("Enter your secret password");
  
  if( pass==ppin){
   del_bub.addClass("d-none");
   $("#message-bubble-" + chat_id ).removeClass("d-none");
 }
  return;
}            
 return toast("Hidden message", {type: "primary"});
   }
   else if(  fmc && friendMessageSelected.search(chat_id)<0 ){
     friendMessageSelected=friendMessageSelected + chat_id + " ";
   }
     
    var fuser=chatOpened("s");
    
 if( $("#message-selected-" + chat_id).length){
  var  totalSelected=deselectMessage(fuser,chat_id);
  }else if( $(".message-selected").length){
     
    var totalSelected=selectMessage(fuser,chat_id);
  
  }
 
 if( !totalSelected ){
    messageSelectedToolbar("cancel");
  }
 else{
  $("#message-selected-count").text(totalSelected);
 }
   
});
  
$("#stadiums").on("click",".share-message",function(){
    if( $("#message-selected-toolbar").is(":visible") ) return;
   
   var this_=$(this);
   this_.hide();
   var fuser=chatOpened("s");
   setTimeout(function(){
     this_.show();
   },1000);
  var chatId=this_.data("chat-id");
  
  var data=$("#file-share-" + chatId ).val();
 
 if(!data ) return toast("File not found");
   data=data.split("|");
   var filename=data[0];
   var rfuser=filename.split("-")[0];
  
  var folder=data[1];
  var file_test1=new android.File(FILES_FOLDER, 'sent/' + folder + '/' + filename);
  var file_test2=new android.File(FILES_FOLDER, 'received/' + folder + '/' + filename);
 
   if(file_test1.isFile() ){
   file_test1.share()
   }
  else if(file_test2.isFile() ){
    file_test2.share();
   }
   else{
     return toast("Download file first");
   }
    
 });
  

$('body').on('click','.show-full-chat-phot',function(){  
  if( $(".message-selected").length) return;
   var d=$(this);
   var ppfc=$("#chat-photo-full-container");
      ppfc.addClass("viewing-chat-photo-full");
   
   var path=d.attr("src");
   ppfc.html('<img id="chat-photo-full" src="' + path + '" onerror="imgError(this);">');
   ppfc.show();
  
});
  
   
$('body').on('click','.delete-contact-btn',function(){
    var this_=$(this);
    var fuser=this_.data('username');
    var fullname=$('.contact-friend-name-' + fuser + ':first').text();
 var cby="x*";    
  var title='Delete ' + ftoUpperCase(fullname) + '?';
   var page_= isPage(fuser)?"page":"group";
 if( isGroupPage(fuser) ){
    title="Leave " + page_ + " <strong>" + ftoUpperCase(fullname) + "</strong>?";    
    cby=CONTACTS__[fuser].created_by;
 }
  
  var data='<div class="center_header text-left" style="white-space: nowrap; overflow-x: hidden; text-overflow: ellipsis; padding: 13px 16px 0 16px; width: 90%; font-size: 15px; font-weight: normal;">' + title + '</div>';
     data+='<div class="center_text_div text-right" style="font-weight: bold; width:100%; font-size: 13px; padding: 10px 15px; ">';
   if( cby==username){
     data+='<div class="text-secondary text-left" style="font-size: 11px;">You created this ' + page_ + '. If you leave, the ' + page_ + ' will be deleted</div>';
   }
  data+='<div class="mt-3"><span onclick="closeDisplayData(\'.remove-contact-div\');" style="margin-right: 25px; color: #d9534f;">CANCEL</span><span id="remove-contact" data-fuser="' + fuser + '" style="color: #0079c6;">REMOVE</span></div>';
  data+='</div>';
displayData(data,{ width: '90%', oszindex:205, pos:'50', data_class:'.remove-contact-div', osclose:true});
  });
  
 $("body").on("click","#remove-contact", function(){
  var fuser=$(this).data("fuser");
  if( isGroupPage( fuser ) ){
     leaveGroup(fuser);
 }
  else removeContact_(fuser);
 });
  
  
 $('#stadiums-container').on('click','#clear-chat',function(){
 //Clear chat from stadium menu
  var fusername=chatOpened("s"); 
  var data='<div class="center_header text-left" style="padding: 13px 20px 0 20px; font-weight: normal; font-size: 15px;">Are you sure you want to clear messages in this chat?</div>';
   data+='<div class="center_text_div text-right" style="font-weight: bold; width:100%; font-size: 13px; padding: 30px 16px 10px 16px;">';
   data+='<span onclick="closeDisplayData(\'.delete-chats-div\');" style="margin-right: 25px; color: #d9534f;">CANCEL</span><span class="" onclick="deleteChatsNow_(\'' + fusername + '\');" style="color: #0079c6;">DELETE</span>';
   data+='</div>';
   displayData(data,{ width: '90%', oszindex:205, pos:'50', data_class:'.delete-chats-div', osclose:true});
 });
  

$("#recipients-container").on("click",".forward-to",function(){
    var this_=$(this );
    var fuser=this_.data("friend");
    var fname=this_.data("fname");
   DBLINK_(fuser);
  
 $("#chatting-friend-name-" + fuser ).text(fname);
    forwardMessages(fuser );
    messageSelectedToolbar("cancel");
    goBack();
  $("#recipients").empty();
 });
                              
                              
 $("body").on("click","#show-console-log", function(){
   var opacity=+$(this).css("opacity");
   if( opacity<1 ) return;
   var cl=$(".console-log");
   
    if(cl.is(":visible") ) cl.hide();
    else cl.fadeIn();
  });
     
 $("#show-console-log").on("press", function(e) {    
   $(this).css("opacity", 1);
});
   
  
 $("body").on("click",".go-back",function(){
    goBack();
 });
 
  
 //COPY POST CODES 
  
$("body").on("click","code", function(e){
  var target_=$(e.target);
  if( target_.is("a")
   || target_.is("span") ){
     return; 
   }
    
  var this_=$(this);
  
  var text_=( this_.html()||"").replace(/<br>/g,"\n");
  var code_=$("<div></div>").html(text_).text()||"";
    if(!code_) {
      return android.toast.show("Nothing to copy");
    }
    android.clipboard.setText( $.trim( code_) );
    toast("Copied", {type: "primary"});
  });  
});


function enlargePhoto(t, double){
  if($("#message-selected-toolbar").is(":visible")){
    return;
  }
 var this_=$(t); 
  
  if( double){
    
  var size=+this_.attr("data-size")+50;
  if( size>250){
    return $(".ENLARGED--PHOTO").attr("data-size", "100").css({"width": "","max-width":"100vw","max-height":"100vh"});   
  }
  return $(".ENLARGED--PHOTO").attr("data-size", size).css({"width": size +"%","max-width":1200,"max-height":1200});   
  }    

 var ppfc=$('#chat-photo-full-container');
     ppfc.addClass('viewing-chat-photo-full');
 
  var src=this_.attr("src");
   $("#enlarged-photo-container").html('<img id="full-picture-loading" class="w-16" src="file:///android_asset/loading-indicator/loading2.png"><img id="chat-photo-full" onclick="enlargePhoto(this,1);" onload="eploaded(this);" data-size="100" src="' + src + '" class="ENLARGED--PHOTO">'); 
   ppfc.css("display","block"); 
  }

function eploaded(t){
 var src=t.src;
  if( src.match(/base64/i)) return;
  $("#full-picture-loading").remove();
}

function goBack(){
  //new Event('backButtonPressed
  var evt = new Event('onBackPressed', { bubbles: true, cancelable: false })
    document.dispatchEvent(evt);
}

function alert__( text){
  var aid=randomString(5);
  var data='<div class="center-header bg-light text-left" style="white-space: nowrap; overflow-x: hidden; text-overflow: ellipsis; line-height: 40px; padding-left: 16px; font-size: 15px;">Alert</div>';
     data+='<div class="center-text-div bg-white text-left" style="width:100%; font-size: 15px; padding: 10px 15px 60px 15px; ">';
     data+=bbCode(text);
    data+='</div>';
    data+='<div class="center-footer bg-light text-right" style="line-height: 40px;">';
     data+='<div onclick="closeDisplayData(\'.alert-' + aid + '\');" style="display: inline-block; color: #0079c6; width: 60px; font-weight: bold; padding-right: 16px;">OK</div>';
  data+='</div>';
 displayData(data,{ width: '90%', oszindex:205, pos:'50', data_class:'.alert-' + aid, osclose: false});
  
}


function deleteAwaitingDoc(chatId){
  var mcont=$("#message-container-" + chatId);
 if(!confirm("Remove?")) return;
  
  var aDir= new android.File( CHAT_FOLDER, "AWAITING-DOCUMENTS");
 //var ms=$("#message-status-' + chatId);
  
  if( !aDir.isDirectory() ){
   return toast("Deleted", {"type":"success"});
 }
 
  var fuser=chatOpened("s");
  
var file=new android.File(aDir, chatId + ".txt");
if( file.isFile() ){
 try{
  if( file.delete() ){
    mcont.remove();
 
 if( SEND_FILE_AJAX ){
  SEND_FILE_AJAX.abort();
 }

 sortChats( fuser , "You unsent a message");
   return;
      }
    }catch(e){}
  }
  
  toast("Could not delete");
}



function selectMessage(fuser,chat_id){
  var totalSelected_=Object.keys(SELECTEDMESSAGES_).length;
 //  var sis=$(".show-if-sent");
  var sent=true;
  
  if( $("#message-status-" + chat_id).hasClass("message-status-0") ){
    sent=false; 
  }
  
 if( isWatchingVideo() ) { 
 }
  else if(totalSelected_>15) {
   toast("Maximum reached", {type: "warning"});
 }
  else{
   
    var elem=$("<div></div>")
    .addClass("message-selected")
    .attr("id","message-selected-" + chat_id)
    .attr("data-friend-username", fuser);
 
  var mdiv=$("#message-text-" + chat_id);
 // var isFile_=mdiv.hasClass('message-file');
  var file_data_div=mdiv.find(".FILE__");
  var isFile_=file_data_div.length;
    
  var chat_date=$("#chat-date-" + chat_id).text();

  var message="";
  var file=0;
  var felem=$("#forward-message");
    
  if( !totalFilesUnsentSelected){
     felem.css("display","inline-block");
  } else{
   felem.css("display","none");
 }
    
  if( isFile_  ){
     file=isFile_;
    var meta= file_data_div.attr("data-meta"); //$('#stadium-content-' + fuser + ' #share-file-' + chat_id).attr('data-meta');
    var sfpath=meta.split("|")[1]||"";
   
  if( !sfpath) sent=false;
    
    var file_msg=$.trim( $("#file-share-" + chat_id ).val() );
        file_msg=file_msg.split("|")[0];
       message='{"msg":"[file=::' + file_msg + '::]","meta":"' + escape( meta ) + '"}';
     
   totalFilesSelected++;
   $("#copy-message,#forward-message").css("display","none");
  
if( sent){
   if( !totalFilesUnsentSelected) {
  felem.css("display","inline-block");
 }
  
}else{
  totalFilesUnsentSelected=totalFilesUnsentSelected + chat_id + ' ';
}
    
  }
  else { 
    message= mdiv.html();
  }
    
  message=str_ireplace( message, ['<br>','&nbsp;','&amp;','&lt;','&gt;'],['\n','\u00A0','&','<','>'] );
    SELECTEDMESSAGES_[chat_id]=[chat_date, file, message];
  
  $("#message-container-" + chat_id).prepend(elem);
  }
    return Object.keys(SELECTEDMESSAGES_).length;
}


function deselectMessage(fuser, chat_id){
  $('#stadium-' + fuser + ' #message-selected-' + chat_id).remove();
 var chkSel= SELECTEDMESSAGES_[chat_id];
  
  if( chkSel[1] ) {
    totalFilesSelected--;
  }
 
 totalFilesUnsentSelected=totalFilesUnsentSelected.replace(chat_id + ' ','');
 friendMessageSelected=friendMessageSelected.replace( chat_id + ' ','');
  
if( !totalFilesSelected){
  $("#copy-message").css("display","inline-block");
}

if(!totalFilesUnsentSelected) {
  $("#forward-message").css("display","inline-block");
 }
  
  delete SELECTEDMESSAGES_[chat_id];
  return Object.keys(SELECTEDMESSAGES_).length;
  }

function selectRecipients(){
   
 var div=$('#recipients-container');
  div.addClass('viewing-recipients').show();

 
  try{
 
  var gps=  loadGroups("forward-to");
  var cont= loadContacts("forward-to");
 
      $("#recipients-groups").html( gps );
      $("#recipients").html( cont);
    
   var fuser=chatOpened('s');
  
    sortElementsById('#recipients>div','#recipients', true);

}catch(e){ 
  report__('Error "selectRecipients()"',e); 
     }
  }
    
function forwardMessages(fuser){
  
  if ( isGroupPage( fuser) ){
  if( !is_group_admin( fuser, username) && groupLocked(fuser) ){
    return android.toast.show("Only admins can send message");
   }
  }
  
   try{
  var settings_=JSON.parse( localStorage.getItem("server_settings"));
   var adm=siteAdmin( username);
 
if(!adm && settings_.enable_chat=="NO"){
   return toast("Disabled");
} 
else if(!adm && !siteAdmin(fuser) && settings_.enable_send_chat=="NO"){
   return toast("Disabled");
}    
   
 }catch(e){
   return toast("Loading settings...");
 }
   
  $('#can-comment').prop('checked', false);
  var currentTime=moment().unix();
  $.each( SELECTEDMESSAGES_, function(i,v){
     
    var isFile_=v[1];
    var data= v[2];
    
   var meta,hl,file,pt,fx,size,lfpath,sfpath,dimension;
       meta=hl=file=pt=fx=size=lfpath=sfpath=dimension="";
    
  if( isFile_){
    var parse_=JSON.parse( data);
    var message= removebbCode( parse_.msg);
      meta=parse_.meta.split('|');
    hl=meta[2];
    pt="";
    lfpath=meta[0]||"";
    sfpath=meta[1]||"";
    file=meta[3];
    size=meta[4];
    dimension=meta[5]||"";
    
  }else{
    var message= removebbCode(data);
    hl=substring_(message , 0, 100);
  }

   var chatId=randomNumbers(15);
 
  var formatted=formatMessage( chatId, fuser, { msg: sanitizeLocalText( message),
    chat_id: chatId, hl:hl, file: file, pt: pt, fx:fx, size: size, lfpath: lfpath, sfpath: sfpath, dimension: dimension});
 
   var sformatted=formatMessage( chatId, fuser, { msg: sanitizeMessage( message),
     chat_id:chatId,hl:hl,file: file,pt: pt,fx:fx,size:size, lfpath:"", sfpath: sfpath, dimension:dimension });
 forwardSend( formatted, sformatted, fuser, isFile_,chatId);
 
  });
 
}


function forwardSend( formatted, sformatted, friend_username, isFile_,chatId){
   if( !formatted) return false;
  
  displayMessage({ 
    'message': formatted,
    'page_down': true,
    'area':'input_box',
    'DB': 'ap'
  });
  
  copyToAwaitingSend( sformatted,function(){
    sortChats(friend_username,'Forwarded &#9755;');
    saveToDB( friend_username, formatted, 'input' ,true);
 });
 
  localStorage.setItem('last_message_id_' + username + '_' + friend_username, chatId);
  localStorage.setItem('last_message_status_' + username + '_' + friend_username, 'awaiting');
  localStorage.setItem('last_message_timestamp_' + username + '_' + friend_username, moment().unix() );
 
   sendMessage();
 }

function copyMessages(){
  var copy='';
  $.each( SELECTEDMESSAGES_,function(i,v){
   var chat_id=i;
    var chat_date=v[0]||moment().format('DD/MMM/YYYY');
    var isFile_=v[1]||"";
    var message=v[2]||"";
      copy+='[ ' + chat_date + ' ]\n' + message + '\n\n';
  });
  

  var data= removebbCode(copy);
  
  android.clipboard.setText( $.trim(data) );
  toast('Copied to clipboard.',{type:'info'});
  messageSelectedToolbar('cancel');
  
}

function deleteMessages(){
  //Delete selected messages only
  var total=Object.keys(SELECTEDMESSAGES_).length;
  var data='<div class="center_header text-left" style="padding-left: 30px; padding-top: 13px; font-size: 15px;">Hide ' + total + ' messages?</div>';
     data+='<div class="center_text_div text-right" style="color: #0079c6; width:100%; font-weight: bold; font-size: 14px; padding: 10px 15px;">';
     data+='<div class="mb-3 text-right" onclick="deleteMessagesNow_();">HIDE FOR ME</div>';
     data+='<div class="mb-3 text-right" onclick="closeDisplayData(\'.delete-messages-div\');" style="color: #d9534f;">CANCEL</div>';
     
  if( !friendMessageSelected ) {
     data+='<div class="mb-3 text-right" onclick="deleteMessagesNow_(1);">HIDE FOR EVERYONE</div>';
   }
  
    data+='</div>';
displayData(data,{ width: '90%', oszindex:205, pos:'50', data_class:'.delete-messages-div', osclose:true});  
}

function deleteMessagesNow_(everyone){
  //Delete selected messages only
  var copy='';
  var fuser=chatOpened('s');
  var ddir=new android.File(MAIN_FOLDER,username + '/CHATS/' + fuser + '/__DELETED_MESSAGES__');
  if( !make_dir( ddir) ){
    return android.toast.show('Something went wrong');
   }
  
  var file=new android.File(ddir, 'deleted.txt');
  var flen=file.length;
  
 if( flen ){
   flen=flen/1024;
 if( flen>15){
    return android.toast.show('You have deleted over 1000 messages on this chat, consider clearing this chat instead.');
  }
   else if( flen>14.5){
   android.toast.show('You have deleted over 1000 messages on this chat, consider clearing this chat instead.');
  }
 }
  
  var last_cid=$("#stadiums .message-container:last").data("chat-id");
  
$.each( SELECTEDMESSAGES_, function(i,v){
   var chat_id=i;
   
 if( file.append( chat_id + ' ') ){
   $("#message-bubble-del-" + chat_id ).removeClass("d-none");
   $("#message-bubble-" + chat_id ).addClass("d-none");
   $('#message-container-' +chat_id ).addClass('deleted-message');
  
   // $('#deleted-message-cover-' + chat_id).css('display','block');
   $('#share-file-' + chat_id).remove();
 
 if( everyone){
   var udb=username;
 
  if( isGroupPage(fuser) ){
   udb=fuser;
   }
 send( fuser, "delete-message|" + udb + "|" + chat_id + "|" + username , 4, "act");
 
}
   
if(chat_id==last_cid) {
  sortChats( fuser , "You hid this message");
  }
}
  
});
  
  loadOldMessages();
  
  closeDisplayData('.delete-messages-div');
  messageSelectedToolbar('cancel');
}

function deleteChats(){
  //Clear chats confirm
    var total=+$('#chats-selected-count').text();  
  var data='<div class="center_header text-left" style="padding-left: 30px; padding-top: 13px; font-weight: normal; font-size: 15px;">Delete ' + total + ' chats?</div>';
     data+='<div class="center_text_div text-right" style="font-weight: bold; width:100%; font-size: 13px; padding: 10px 15px;">';
     data+='<span onclick="closeDisplayData(\'.delete-chats-div\');" style="margin-right: 25px; color: #d9534f;">CANCEL</span><span class="" onclick="deleteChatsNow_();" style="color: #0079c6;">DELETE</span>';
  data+='</div>';
displayData(data,{ width: '90%', oszindex:205, pos:'50', data_class:'.delete-chats-div', osclose:true});  
}


function deleteChatsNow_(fuser_){
   var selected=$('.friend-chat-selected');
   if(!fuser_ && !selected.length) return toast('No chat selected.');
  
 try{ 
   /*
   var chatListFile=new android.File(MAIN_FOLDER, username + '/CHATS/chat_list.txt');
   if( !chatListFile.isFile() ) {
     return toast('Unable to delete chats.');
   }
 */
   if(fuser_){
     selected=$('<div></div>')
       .attr('data-username',fuser_);
   }

 selected.each( function(){
   
     var this_=$(this);
     var fuser=$.trim(this_.data('username') )     
          
  if(!fuser) /*Skip*/ return;
    
    var userDir=new android.File( MAIN_FOLDER, username + '/CHATS/' + fuser);
   if( !userDir.deleteFileOrFolder() ) return;
   
    $('#stadium-' + fuser ).remove();
    
   if(fuser_){
     //Clear
    var sortTimestamp= moment().unix();
    NEWCHATS__[fuser_]={"message":"", "timestamp": sortTimestamp }
     
    $("#message-preview-" + fuser_).find(".message-preview-text").text("");
   var ffolder=new android.File(MAIN_FOLDER, username + '/CHATS/' + fuser_);
     make_dir( ffolder);
     appendStadium(fuser_ );
    var fname=$.trim($('.friend-name-' + fuser_ + ':first').text() );
  $('#chatting-friend-name-' + fuser_ ).text(fname||fuser_);
   }
      else{
      //Delete
     delete NEWCHATS__[fuser];
       
     $('#friend-preview-container-' + fuser + ', #stadium-' + fuser 
      + ',#stadium-toolbar-container-' + fuser).remove();
  }
       
       
 localStorage.removeItem('last_message_timestamp_' + username + '_' + fuser);
 localStorage.removeItem('last_message_status_'    + username + '_' + fuser);
 localStorage.removeItem('friend_message_count_'   + username + '_' + fuser);    
 localStorage.removeItem('last_chat_id_' + fuser);


   });
     
  NEWCHATSFILE.write( JSON.stringify( NEWCHATS__,null, "\t") );
        
  }catch(e){
    toast(e);
    logcat('function deleteChatsNow_ main2.js', e);
  }  
   

 closeDisplayData('.delete-chats-div');
 chatsListToolbar1('cancel');
 }


function removeContact_( fuser){
  
var loader=$("#delete-contact-loading-" + fuser);
 var delBtn=$("#delete-contact-btn-" + fuser);
  delBtn.hide();
  loader.show();
   
  try{
    setTimeout(function(){
    loader.hide();
    delBtn.show();
      
    delete CONTACTS__[fuser];      
      
 if( CONTACTSFILE.write( JSON.stringify( CONTACTS__, null, "\t") ) ){
    $("#friend-preview-container-" + fuser).addClass("add-contact-" + fuser);
    showContacts(true);
 }
},300);    
 }catch(e){
   loader.hide();
   delBtn.show();
   
   toast('Failed to delete. ' + e);
   report__('Error "removeContact_()"', e);
  logcat('function removeContact_ main2.js', e);
 }
  
  closeDisplayData(".remove-contact-div");
  
}

 


function USER_ACCOUNT_ACTION( data_){
  //Actions will be taken if a message is sent by "act" or "act_act"
 
 var data=$.trim(data_ ).replace(/\\\|/g,"&#124;").replace(/(&#58;)/g,':').split('|');
  var act=$.trim(data[0] );
  var loc=$.trim(data[1]); //location or group pin or fuser
  
  if( act==="block-contact"){
     localStorage.setItem("user-blocked-lastseen-" + loc, data[2] );
  } 
  else  if( act==="unblock-contact"){
     localStorage.removeItem("user-blocked-lastseen-" + loc );
  } 
 
  else if( act==="remove-from-group"){
    removeGroup_(loc);
    android.toast.show("Removed from group: " + loc.toUpperCase() );
 
  }else if( act==="remove-from-group-admin"){
    remove_from_group_admin(loc);
  }else if(act==="add-as-group-admin"){
    add_as_group_admin(loc);
  android.toast.showLong('You have been made an admin in group: ' + loc.toUpperCase());
   } else if(act==="lock-group"){
     var glock=new android.File( CHAT_FOLDER, "CHATS/" + loc + "/lock.md")
  glock.write("locked");
     }
  else if(act==="unlock-group"){
     var glock=new android.File( CHAT_FOLDER, "CHATS/" + loc + "/lock.md")
if(glock.isFile() ){
  glock.delete();
    } 
  }
  else if( act==="delete-message"){
    
  try{
    var ddir=new android.File( CHAT_FOLDER, "CHATS/" + loc + "/__DELETED_MESSAGES__");
  if( !make_dir( ddir) ){
    return android.toast.show("Something went wrong");
   }
    
 var file=new android.File( ddir, "deleted.txt");
  var chat_id=data[2];
  var fuser=data[3];
    
 if( file.append( chat_id + " ") ){
    if( isGroupPage(loc) ) fuser=loc;
   
 if( fuser== chatOpened("s") ){
    
   $("#message-bubble-del-" + chat_id ).removeClass("d-none");
   $("#message-bubble-" + chat_id ).addClass("d-none");
   $("#message-container-" +chat_id ).addClass("deleted-message");

   //$('#deleted-message-cover-' + chat_id).css('display','block');
    $("#share-file-" + chat_id).remove();
 }
   
  } 
  }catch(e){}
  }
  else if ( act=='auto-logout'){
  
    //Permit Auto logout once per day
  var day=moment().format('D');
  
    var savedDay=+localStorage.getItem(SITE_UNIQUE__ + "_" + username + "_auto_logout_permission")||35;
    if( day==savedDay) return;
    
 localStorage.setItem(SITE_UNIQUE__ + "_" + username + "_auto_logout_permission", day);

 localStorage.removeItem("__TOKEN__");
 localStorage.setItem("login_required","yes");
  
  setTimeout(function(){
    toggleView("login");
    toggleView("main","hide");
    toggleView("go_social","hide");
  }, 30000);
 }
  else if( act=='d-alert'){
    //direct alert
  if( strtolower(loc)==username){
   alert__( data[2]||"" ); 
    return 1;
  }
 }
  else if(act=='remove-upgrade'){
   localStorage.removeItem('upgrade_required');  
 //Check chat_globals.js
    closeDisplayData('.update-requred');
  }
  else{
  alert__(act);
    return 1;
 }  
  
    return 0;
}



function appMinimized(v){
 var am_=sessionStorage.getItem('app_minimized')||"";
 //alert( v + "\n" + am_)
  
if( v && v==1){
  sessionStorage.setItem('app_minimized', randomString(3));
  pauseAudioPlayer();
  cancelRecord();
  return true;
}else if (v &&  v==2 ){
  sessionStorage.removeItem('app_minimized'); 
  messageReadFeedback( chatOpened('s'));
  return false;
}
  
else if(am_ ) {
  return true;
}
else {
  messageReadFeedback( chatOpened('s'));
  return false;
 }

}
 

function changeAccount(){
  var data='<div class="center_header text-left" style="padding-left: 15px; padding-top: 13px; font-size: 15px;">Change account?</div>';
     data+='<div class="center_text_div text-right" style="width:100%; font-size: 13px; padding: 8px 15px;">';
     data+='<div class="row">';
     data+='<div class="col text-left"><img class="w-20 h-20" id="change-account-loading" style="display:none;" src="file:///android_asset/loading-indicator/loading2.png"></div>';
     data+='<div class="col"><span onclick="closeDisplayData(\'.change-account-div\');">CANCEL</span></div>';
     data+='<div class="col text-center"><span class="" onclick="changeAccount_();">CHANGE</span></div>';
     data+='</div></div>';  
  displayData(data,{ width: '90%', oszindex:205, pos:'50', data_class:'.change-account-div', osclose:true});  
}



function changeAccount(){
  var data='<div class="center_header text-left" style="padding-left: 15px; padding-top: 13px; font-size: 15px;">Change account?</div>';
     data+='<div class="center_text_div text-right" style="width:100%; font-size: 13px; padding: 8px 15px;">';
     data+='<div class="row">';
     data+='<div class="col text-left"><img class="w-20 h-20" id="change-account-loading" style="display:none;" src="file:///android_asset/loading-indicator/loading2.png"></div>';
     data+='<div class="col"><span onclick="closeDisplayData(\'.change-account-div\');">CANCEL</span></div>';
     data+='<div class="col text-center"><span class="" onclick="changeAccount_();">LOGOUT</span></div>';
     data+='</div></div>';  
  displayData(data,{ width: '90%', oszindex:205, pos:'50', data_class:'.change-account-div', osclose:true});  
}


function changeAccount_(t){
 var this_=$(t);
 
  clearTimeout( marTimeout);
  clearTimeout( gmTimeout)
  
  $('#change-account-loading').css('display','block');
  //Delay logout if app is sending, fetching or saving
  //messages from server to avoid loss of data
 if( localStorage.getItem('is_sending_message')
  || localStorage.getItem('is_fetching_messages')
  || localStorage.getItem('saving_message') ){
 
 setTimeout( function(){
   localStorage.setItem('is_logging_out','Yes');
    changeAccount_();
  },500);
   return;
  }  
  localStorage.setItem('is_logging_out','Yes');
  localStorage.removeItem('__TOKEN__');
  localStorage.removeItem('username');
  __TOKEN__=null;
  toggleView('login');
 
localStorage.setItem('login_required','yes');
 
   setTimeout( function(){
   localStorage.removeItem('is_logging_out');
 android.activity.loadUrl("main","about:blank");
 android.activity.loadUrl("go_social","about:blank");
     toggleView('main','hide')
     toggleView('go_social','hide')
   },1000);
  }


function closeChat(){
 var fuser=chatOpened('s');
 //  friends_();
  $('#stadiums-container').addClass('visually-hidden');
  $('#reading-message-from').val('');
  $('#stadium-' +fuser + ' .new-messages-crossline').remove();
  $('#chats-list-page .friend-preview-container').removeClass('friend-message-selected-indicator');
  closePreviewFiles();
  closeComment();
  
  messageSelectedToolbar('cancel');
  pauseAudioPlayer();
  closeRecipients();
 if( config_.auto_clean_stadium){
   var stadiumEl=$('#stadium-' + fuser);
  if( stadiumEl.length ) stadiumEl.remove();
  stadiumEl=null;
}
  
 }

function closeRecipients(){
  $('#recipients-container').removeClass('viewing-recipients').css('display','none');
  $('#recipients').empty(); 
}


var exitPressCount__;

function onBackPressed(){
  clearTimeout( watchingVideoTimeout);  

if( localStorage.getItem("go_social_opened") ){
  
 return "Dont trigger";
  }
  else if( $('#group-profile-page .context-menu').is(':visible')){
  
    $('#group-profile-page .context-menu:last').css('display','none');
   return;
 } else if( $(".center-div").is(":visible") ){
   var elem=$(".center-div:last");
  if( !elem.hasClass("no-cancel") ){
   closeDisplayData( elem.data("class") );
   cancelRecord();
 }
   return;
}
  else if($('.console-log').is(':visible')){
  $('.console-log').css('display','none');
    return;
  }
  
else if( $('#chat-photo-full-container').hasClass('viewing-chat-photo-full')){
  $('#chat-photo-full-container').removeClass('viewing-chat-photo-full').css('display','none');  
  
  return;
 }
    
 else if( $('#profile-friend-picture-full-container').hasClass('viewing-friend-profile-full-picture')){
    $('#profile-friend-picture-full-container').removeClass('viewing-friend-profile-full-picture').css('display','none');  
 
   return;
 }
  else if( $('.viewing-recipients').length){
  closeRecipients();
    
 return;
  }
  else if($('#message-selected-toolbar').is(':visible') ){
    messageSelectedToolbar('cancel');
   
    return;
  }
  else if($('#chats-list-toolbar1').is(':visible')){
    chatsListToolbar1('cancel');
    
    return;
  } 
 /*
 else if( $('#profile-picture-full-container').hasClass('viewing-my-profile-full-picture')){
  $('#profile-picture-full-container').removeClass('viewing-my-profile-full-picture').css('display','none');  
  return;
 }
 */
 
 else if($('#group-members-container').is(':visible')){
   $('#group-members-container').css('display','none');

   
   return;
 }
  else if( $("#video-element-container").is(":visible") ){
   exitVideoFullScreen();
   return;
 }
  else if( $('#create-group-form-container.viewing-create-group-form').length){
    if( sessionStorage.getItem('new_group_created') ){
  sessionStorage.removeItem('new_group_created')
   
      showGroups(1);
 } 
  $('#create-group-form-container').removeClass('viewing-create-group-form').css('display','none');
  
    return;
 } 
  else if($('.viewing-groups').length){
 $('#groups-container').removeClass('viewing-groups').css('display','none');
   
    return;
  }
 else if( $('#profile-friend-page').is(':visible')){
    $('#profile-friend-page').fadeOut('fast');
   if( lpAjax) lpAjax.abort();
   clearTimeout( lpTimeout)
   clearTimeout( delay_lpTimeout)
    return;
  }
  else if($('#group-profile-page').is(':visible')){
    $('#group-profile-page').fadeOut('fast');
    if( lgprofileAjax) lgprofileAjax.abort();
   if( lgprofileTimeout) {
     clearTimeout( lgprofileTimeout);
   }
 
    return;
  }
  else if($('#stadium-menu-container').is(':visible') ){
    $('#stadium-menu-container').css('display','none');
    return;
  }
  else if($('#profile-page-container,#settings-page-container').is(':visible')){
   $('.header-button:first').click();
    return;
 }
 else if( $('.viewing-add-contact-form').length){
  $('#add-contact-container').removeClass('viewing-add-contact-form').fadeOut();
    showContacts(1);
   return;
 }
  else if( $("#preview-files-container").is(":visible") ){
   closePreviewFiles();
    return;
  }
   else if( $('.upload-files-menu').length){
    closeDisplayData('.upload-files-menu');
     return;
  }
  else if($('.viewing-contacts').length){
   // friends_();
 $('#contacts-container').removeClass('viewing-contacts').css('display','none');
    return;
  }
  
 else if( $('#comment-container').is(':visible')){
   closeComment();
   return;
 }
 else if( !$('#stadiums-container').hasClass('visually-hidden') ){
    closeChat();
   return;
 }
    
 var quit_=$('.header-button-selected').data('header-button-item');
  
 if( quit_=='chats-list-page-container'){
   
 if( MS__==='m'){
   
  if( exitPressCount__ ){
    android.activity.finish();
   return;
   }
   
  android.toast.show('Press again to exit.');
    exitPressCount__=true;
  setTimeout( function(){
    exitPressCount__=false; },1500);

  return; 
}
    return openGoSocial(); 
  }
  
}

function exitApp(){
  android.activity.finish(); 
  /*try{
    var p = new android.JavaObject("android.os.Process");
      pc.killProcess( p.myPid());   
   }catch(e){  }
  */
}


function insertAtCursor(myField, myValue) {
    //IE support
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
}

var emoTimeout;
   

function emojiFocus( textarea){
  //Focus textarea when emoji in use
  textarea=textarea||document.getElementById('text-box');  
 if( !$('#emoji-container .lsx-emojipicker-container').is(':visible') ){
   $(textarea).attr('readonly','readonly');
   $(textarea).focus();
   $(textarea).removeAttr('readonly');
  }
}
 

function registerPresence(){
  var day=moment().format('D');
  var prevDay=+localStorage.getItem(username + '_register_presence')||35;
  
 if(!username || prevDay==day ) return;
 sessionStorage.setItem('DELAY','yes')
  $.ajax({
    url:config_.domain + '/oc-ajax/record-presence.php',
    type:'post',
    dataType:'json',
    timeout: 5000,
    data: {
      username: username,
      token: __TOKEN__
    }
 
  }).done(function(result){
    sessionStorage.removeItem('DELAY');
  if( result.status && result.status=='success' ){
   localStorage.setItem(username + '_register_presence',day); 
    }
 }).fail(function(e){
    sessionStorage.removeItem('DELAY')
  });
}

 setTimeout( function(){
   registerPresence();
 },10000);

upgradeRequired([]);


function backupData(){
   var folder = new android.File( CHAT_FOLDER);
if( !folder.isDirectory() ){
    return;
  }
  var saveToDir = new android.File( BACKUP_DIR );

 if(!saveToDir.isDirectory() && !saveToDir.mkdirs()){
 return android.toast.show("Backup directory not created"); 
}

 var last_bu=new android.File( CHAT_FOLDER, "last-bu.txt");
  
var saveTo= new android.File( saveToDir, username + ".zip");
 
 if(!last_bu.write("Backup time: " + moment().format("DD-MM-YYYY h:ia"))){
   return;   
 }
  last_bu.append("\nApp version: " + APP_VERSION );
  last_bu.append("\nSystem ApiLevel: " + android.system.getApiLevel() );
  
  folder.zip( saveTo,function(detail){
  if( detail.error){
    //"Error: " + detail.error
  }else{
    last_bu.append("\nSuccessful");
  }
});

}


 cJob('osb_backup', 30, function(){
   backupData();
 });


$(window).on('orientationchange',function(){
  exitVideoFullScreen();
   closeChat();
});



/*
document.addEventListener("backButtonPressed", function(){
  onBackPressed();
});
*/

document.addEventListener("onBackPressed", onBackPressed);

 