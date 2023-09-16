function _base64Header(ext){
 'data:image/png;base64,';
}

function uploadFilesMenu(asked){
 // var data='<div class="center_div upload-files-menu bg-light">';
  
  var fuser=chatOpened("s");
  var sett=canSendChat( fuser);
  
 if( sett==0 ){
   return toast("Chat disabled");
 }else if( sett==-1 ){
   return toast("Loading settings. Try again",{type:"info"});
 }
  
 var veri=userVerified( username);
 var vid_doc=false;
 var adm=siteAdmin( username) ;
try{
  var settings= JSON.parse( localStorage.getItem("server_settings") );
 
 if(adm || settings.enable_vid_doc=="YES"  ){
   vid_doc= true;
  }  
 }catch(e){ 
  return  toast("Loading settings...", { type:"info"});
 }
  
  if( !adm && settings.enable_file_upload!="YES"){
  return toast("Currently disabled");
}
  
 if(!hasPermission() ){
  requestPermission();
 setTimeout( function(){
   if (!asked ) uploadFilesMenu(true);
 }, 1000);
  return;
  }
  
 var data='<div class="center_text_div text-center" style="width:100%; margin-top: 0; padding: 20px 20px 10px 20px;">';
     data+='<span id="upload-image-btn" onclick="attachment(\'importChatPhotos()\',\'image\');"></span>';
 
 if( vid_doc ){
    data+='<span id="upload-video-btn" onclick="attachment(\'importChatVideos()\');"></span>';
  }

    data+='<span id="upload-audio-btn" onclick="attachment(\'importChatAudios()\');"></span>';
 
 if( vid_doc ){
   data+='<span id="upload-doc-btn" onclick="attachment(\'importChatDocuments()\');"></span>';
 }
  data+='</div>';  
  
  displayData(data, { width: '100%', max_width:'100%', oszindex:200, pos:'100',data_class:'.upload-files-menu',osclose:true})
}

function copyToAwaitingFilesSend(chatId, formatted){
 try{   
   var dir=new android.File( CHAT_FOLDER, "AWAITING-DOCUMENTS");
   
   if( make_dir(dir) ){
   var file=new android.File(dir, chatId + ".txt");
  file.write( formatted);
    }
   }catch(e){
   report__('ERROR "copyToAwaitingFileSend()" ', e);
  }
}


function sendFiles( resendId){
 var f__= $.trim( sessionStorage.getItem('__files__') );
 
  if(!f__) {
    sessionStorage.removeItem('sending_files');
    return;
  }
  
  try{
      var aDir=new android.File( CHAT_FOLDER, "AWAITING-DOCUMENTS");
   
   if( !aDir.isDirectory() ){
   sessionStorage.removeItem('sending_files');
   return;
  }
  var aFiles=aDir.listFiles();    
   if( aFiles.length<1){
    sessionStorage.removeItem('sending_files' );
   return; 
   }
  
  var a_id=f__.split(' ')[0]; //awaiting file id
    sessionStorage.setItem('__files__', (f__ + ' ').replace( a_id + ' ','') )

  var aFile=new android.File( aDir, a_id + '.txt');
  
 if( !aFile.isFile()){
   sessionStorage.removeItem('sending_files' );
  sendFiles(resendId);
   return;
 }
  var data=$.trim( aFile.read() );
    
  var d= JSON.parse( data );
     var localId= d.message_id; 
     var chat_to= d.message_to;
  
     var message=d.message;
  var file_highlight=d.message_preview;
     var fuser=chat_to;
    
  var file_type=d.meta.file||"";
  var file_ext=d.meta.fx||"";
  var preview_text=d.meta.pt||"";
  var folder=d.meta.sent_folder||"";
  var lfpath=d.meta.lfpath||"";
  var dimension=d.meta.dimension||"";
  var uploadPath= config_.upload_path + '?file_type=' + file_type;
  
  var sentDir=new android.File( FILES_FOLDER, "sent/" + folder);
   make_dir( sentDir);
  
    var docFile=new android.File( FILES_FOLDER, lfpath);
    var poster=new android.File( VPOSTER_FOLDER, localId + ".jpg");
 
   function removeFile(chatid, aFile,docFile__,poster__){
    $('#message-container-' + chatid).remove();
    
 try{      
    if( aFile.isFile() ) aFile.delete()
    if(docFile__.isFile() ) docFile__.delete();
    if(poster__.isFile() ) poster__.delete();
   }catch(e){ }
 }
      
  var max_=config_.max_chat_files_size*1024*1024;
   
 if( !docFile.isFile() ){
   sessionStorage.removeItem('sending_files');
   toast('File not found')
     $('.message-container-' + localId).remove();
   aFile.delete();
     return;
  }
  else if( docFile.length() > max_){
   sessionStorage.removeItem('sending_files' );
   toast('One file too large.');
   removeFile( localId, aFile, docFile,poster);
    return;
  }
    
  var base64=docFile.readBase64();

   sendToServer( chat_to,  {
     "url": uploadPath,
     "message":message,
     "data":base64,
     "chat_id":localId,
     "file_type": file_type,
     "lfpath": lfpath,
     "dimension": dimension,
     "pt": preview_text,
     "hl": file_highlight,
     "call_function": 'sendFiles',
     "file_ext": file_ext,
    }, function(resp, direct_resp){
  //alert( JSON.stringify(direct_resp ) )
     
if( resp=='success'){
    $("#stadiums #resend-btn-" + localId).remove();
    $("#stadiums button#del-adoc-" + localId).remove();
   
     aFile.delete();
     }
  else if( direct_resp.error){
  
  $("#stadiums button#del-adoc-" + localId).css("display","inline-block");
 
     if( file_type=="video" && $(".watching-video-" + localId).length){
       goBack();
   }
   
 if( direct_resp.error=='0'){
   toast('Chat is currently disabled. This message will NOT be sent, delivered or seen.',{hide: 10000});
   removeFile(localId,aFile,docFile,poster);   

 }else if( direct_resp.error=='1' ){
   //Invalid token
    toast('Check file size.');
    removeFile(localId,aFile,docFile,poster);   
  }
  else if( direct_resp.error=='2'){
   toast('Unsupported file.');
  removeFile(localId,aFile,docFile,poster);
 }
   else if( direct_resp.error=='3' ){
     toast('File too large');
     removeFile(localId,aFile,docFile,poster);
   }   
   else if(direct_resp.error=='51' ){
     //Not allowed
    toast('Sorry, check file size.');
     removeFile(localId,aFile,docFile,poster);
  } 
    else if(direct_resp.error=='52' ){
    toast('Sorry, parameters error or file too large.');
      removeFile(localId,aFile,docFile,poster);
 }
 else if(direct_resp.error=='54' ){
    toast('Video/Documents sharing currently disabled.');
      removeFile(localId,aFile,docFile,poster);
 }     
  else if(direct_resp.error=='53' ||direct_resp.error=='000' ||direct_resp.error=='00' ){
   //53: Cant create directory
   //000: Server failed
   //00: Upload failed
   if( moveToAwaitingDocumentResend(localId) ){
   $('#stadium-' + chat_to + ' #resend-btn-' + localId).removeClass('d-none').addClass('d-inline-block');
     }  
    }
  }
 else{
   if( moveToAwaitingDocumentResend(localId) ){
   $('#stadiums #stadium-' + chat_to + ' #resend-btn-' + localId).removeClass('d-none').addClass('d-inline-block');
   $("#stadiums button#del-adoc-" + localId).css("display","inline-block");
     }
   
 }
     
   });
  
  }catch(e){
    toast(e);
    report__('ERROR "sendFiles()"', e );
  }    
}

function moveToAwaitingDocumentResend(chatId){
 return true;
  var file=new android.File( CHAT_FOLDER, 'AWAITING-DOCUMENTS/' + chatId + '.txt');
   var rename_to=new android.File( CHAT_FOLDER,  'AWAITING-DOCUMENTS-RESEND/' + chatId + '.txt');
 
 if(file.renameTo(rename_to) ){
    return true;
  }
}

function moveToAwaitingDocuments(chatId){
 var file=new android.File( CHAT_FOLDER, 'AWAITING-DOCUMENTS-RESEND/' + chatId + '.txt');
 var rename_to=new android.File( CHAT_FOLDER, 'AWAITING-DOCUMENTS/' + chatId + '.txt');
  if(file.renameTo(rename_to) ){
    return true;
  }
}



function uploadFiles( obj ){
  var type='';
  if("type" in obj) type=obj.type;
 var tmpDir=new android.File(PUBLIC_FOLDER, 'TEMP-DIR'); 
  
  if( !tmpDir.isDirectory() ) return;
  var files=tmpDir.list();
 var fuser=chatOpened('s');
  //$('.friend-preview-container-' + fuser ).remove();
 
 var pos;
  var files_total=files.length;
  $("#preview-upload-files").empty();
  
  var valid=0;
  var max=0;

   
 try{
  var settings= JSON.parse( localStorage.getItem("server_settings") );
  
 var max_file_size=+settings.max_upload_size||1;
  
 }catch(e){ 
  return toast("Loading settings...", { type:"info"});
 }
   
   
 for( pos=0; pos<files_total;pos++){
 
   var file=files[pos];  
   var file_ext=strtolower( file.split('.').pop() );
   
   var sent_folder='';
    
   var file_=new android.File( tmpDir, file);
   var file_size=file_.length()||1;
   var size=file_size/1048576;

   if( type==="image" ){
    
   if( size <max_file_size ){
     valid++;
     sent_folder=type + "s";
     preview_text="Image File";
     file_ext="jpg";
   }
  }
   else if(type==="audio"){
 
   if( size <max_file_size ){
     valid++;
     sent_folder=type + "s";
     preview_text="Audio File"; 
     file_ext="mp3";
     }
   }
   else if( type==="video" ){
    
   if( size <max_file_size ){
      valid++;
     sent_folder=type + "s";
     preview_text='Video File';
     file_ext='mp4'
    }
   }
   else{
   
     if( size < max_file_size ){
     valid++;
     sent_folder="documents";
     preview_text=strtoupper( file_ext ) + ' File';
     type="document"; //file_ext;
       
     }
   }
      
  
  if(  mconfig_.file_preview && ( type=="image" ||type=="video") ){
   
  if( sent_folder ) preview_files( type, fuser, file );
  
 }
   else {
     var caption="";
  if( sent_folder ) uploadFiles_( tmpDir, fuser, files_total, pos, file, sent_folder, preview_text, caption, type, file_ext);
  
   }
 }

  if( valid ){
 
  setTimeout(function(){
 var sb=$("#stadium-content-" + fuser);
   sb.scrollTop(sb.prop("scrollHeight") );

 },500);
 
  try{
  tmpDir.delete();
  }catch(e){}
  
  setTimeout(function(){
    
 if(!sessionStorage.getItem('sending_files') ){
     sendFiles();
    }
   },2000);
  
  }
  else{
   toast("Some files are too large. Max: " + max + "MB");
  }
}

function preview_files(type, fuser, file){
   var tmpDir=new android.File( PUBLIC_FOLDER, 'TEMP-DIR');
  // var tmpDir=new android.File( PUBLIC_FOLDER, 'TEMP-DIR');
  var pcont=$("#preview-upload-files")
  
     file=new android.File( tmpDir,file);
   
 var src=file.toString();
 var rid= randomString(5);
  
if( type==="image"){
  
  var eid="pimg-id-" + rid;
  var data='<div id="' + eid + '" class="preview-file-photo-container">';
     data+='<img onerror="previewPhotoError(this);" src="' + src + '" class="preview-file-photo preview-loading" data-id="' + eid + '" data-original-src="' + src + '" onload="previewPhotoLoaded(this)">';
     data+='</div>';
}
  else if( type==="video"){
    var vid=rid;
    var file_id=vid;
    var poster="file:///android_asset/chat-icons/bg/transparent.png";
    
    var eid="pvid-id-" + rid;
    
var data='<div id="' + eid + '" class="preview-file-video-container">';
     data+='<figure id="' + vid + '-video-container" class="video-container" data-fuser="' + fuser + '" data-chatid="' + vid + '">';
     data+='<video src="' + src + '#t=0.5" id="' + vid + '-video" class="video-tag preview-loading" data-original-src="' + src + '" data-id="' + eid + '" poster="' + poster + '" preload="auto" onloadeddata="videoLoaded(this)" autoplay muted onerror="videoError(this);"></video>';
     data+='</figure>';
    data+='<span class="video-preview-play-icon-container" data-vid="' + vid + '" onclick="playVideoPreview(this);"><img class="w-60 h-60" src="file:///android_asset/chat-icons/play.png"></span>';
    data+='</div>';
   }
  
    pcont.append(data);
   
  $('#voice-message-btn,#attachment-btn-container').css('display','none');
  $('#send-message-btn').css('display','inline-block');
 
  var pCont=$("#preview-files-container");
   pCont.attr("data-type", type);
  
 setTimeout(function(){
    pCont.css("display","block");
  }, 100);
}

function previewPhotoLoaded(t){
  var this_=$(t);
  var width= t.naturalWidth;
  var height= t.naturalHeight;
  var src=this_.data("original-src"); 
 
  this_.attr("data-width", width)
  this_.attr("data-height", height);
  this_.removeClass("preview-loading");
 
  var unDir=new android.File(PUBLIC_FOLDER, 'TEMP-DIR/unprocessed-images'); 
    make_dir( unDir);
 var prev_name=src.split("/").pop().split(".")[0];
 var name=prev_name + "~" + width +"~" + height + "~.jpg";
 var file=new android.File(src);
 var copy_to=new android.File( unDir, name);
  file.copyTo( copy_to);
}

function previewPhotoError(t){
  var this_=$(this);
  var id=this_.data("id");
  var src=this_.data("original-src"); 
  var file=new android.File(src);

  try{
    file.delete();
  }catch(e){}
  
  $("#" + id).remove();
}

function playVideoPreview(t){
  var vElem=$("#preview-upload-files video");
  vElem.trigger('pause');
  var this_=$(t);
  var vid=this_.data("vid");
  var elem=$("#" + vid + "-video");
  if( elem.hasClass("playing") ){
     elem.trigger("pause").removeClass("playing");
  }else{
    elem.trigger("play").prop("muted", false).addClass("playing");
  }
}


function videoLoaded(video){
  var message_id=randomNumber(15);
  setTimeout(function(){
    video.pause();
  snapVideo(video, false, message_id);
  snapVideo(video, true, message_id)
  },200);
}


function snapVideo(video, thumb, message_id){
  var this_=$(video);
  var id=this_.data("id");
  var fuser=chatOpened("s");
  var duration=video.duration;
   
//  var posterDir=new android.File( PUBLIC_FOLDER, username + '/CHATS/' + fuser + '/video-posters');  
  var posterDir=new android.File( VPOSTER_FOLDER);  
  
  if(!posterDir.isDirectory() && !posterDir.mkdirs() ) {
    return;
  }
  var src=this_.data("original-src"); 
  
 var canvas = document.createElement("canvas");
// scale the canvas accordingly
  var oriWidth= video.videoWidth;
  var oriHeight=video.videoHeight;
 
 var width=oriWidth||350; //50;
// var perc=(width*100)/oriWidth;
 var height=oriHeight||350; // (perc/100)*oriHeight;
  
if( thumb){
  width=50;
  var perc=(width*100)/oriWidth;
  height= (perc/100)*oriHeight;
}
  
   canvas.width = width; 
   canvas.height =height; 
// draw the video at that frame
  var ctx=canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
// convert it to a usable data URL
 var dataURL = canvas.toDataURL("image/jpeg", 0.7);
 var data=dataURL.split(',')[1];
 
  message_id=message_id||randomNumber(15) 
  
  var prev_name=src.split("/").pop().split(".")[0];
  var name_=fuser + "-" + message_id;
  var name= name_ + "~" + width +"~" + height + "~";
 
  var poster=new android.File( posterDir, name_ + (thumb?"-thumb":"") + ".jpg");
  var copy_=false;
  
  if( data && poster.writeBase64( data) ){
      copy_=true;
    
   }
 else if(duration && duration>4 ){
    copy_=true;
   }
if(thumb  ) return;
  
var file=new android.File(src);

if( copy_){
  var unDir=new android.File(PUBLIC_FOLDER, 'TEMP-DIR/unprocessed-videos'); 
    make_dir( unDir);
var copy_to=new android.File( unDir, name + ".mp4");
  file.copyTo( copy_to); 
  this_.removeClass("preview-loading");
}
 else{
   $("#" + id).remove();
   try{
      file.delete();
   }catch(e){}
 }
   
   return message_id;
}

function videoError(video){
  var this_=$(video);
  var id=this_.data("id");
     $("#" + id).remove();
}

function sendPreviewedFiles(){
if(  $("#preview-upload-files .preview-loading").length){
  return android.toast.show("Please wait...");
   }
  
 var textBox=$("#text-box");
 var fuser=chatOpened("s");
 var msg=( textBox.val()||"").trim();
 var fuser=chatOpened("s");
 var mlen=( msg.length+1 )/1024;

 if( mlen>config_.max_text_size ){
  return toast("Message too long", {type: "light",color: "#333"});
 }
  
  clearTextBox(true);
 sessionStorage.removeItem('temp-text-' + fuser); 

 var type=$("#preview-files-container").attr("data-type");
 var tmpDir=new android.File(PUBLIC_FOLDER, "TEMP-DIR/unprocessed-images"); 
   
  if( type==="video"){
   var tmpDir=new android.File(PUBLIC_FOLDER, "TEMP-DIR/unprocessed-videos");    
 }
 
  if( !tmpDir.isDirectory() ) return;
  var files=tmpDir.list();
  
  $(".friend-preview-container-" + fuser ).remove();
 
 var pos;
  var files_total=files.length;
  var message_id="";
  
 for( pos=0; pos<files_total;pos++){
 
   var file=files[pos];
   var file_ext=strtolower( file.split('.').pop() );
   var dim=file.split("~");
   var dimension=dim[1] + "_" + dim[2];
   
   var sent_folder='';
   
   if(type==="image"){
     sent_folder=type + "s";
     preview_text="Image File";
     file_ext="jpg";
   }  
   else if(type==="video"){
     sent_folder=type + "s";
     preview_text="Video File";
     file_ext="mp4";
 
   var filename=file.split("~")[0];
   message_id=filename.split("-")[1];
     
 }
  
 uploadFiles_( tmpDir, fuser, files_total, pos, file, sent_folder, preview_text, msg, type, file_ext, dimension, message_id);

 }
  
  
 setTimeout(function(){
 var sb=$("#stadium-content-" + fuser);
     sb.scrollTop(sb.prop("scrollHeight") );

 },500);
 
  try{
  tmpDir.delete();
  }catch(e){}
  
  setTimeout(function(){
 if(!sessionStorage.getItem("sending_files") ){
     sendFiles();
    }
   },  2000); 
  
  closePreviewFiles();
  
}

function previewFilesOpened(){
 return $("#preview-files-container").is(":visible");
}

function closePreviewFiles(){
  var text=$("#text-box").val();
  
    $('#text-box-container,.toolbar1').show();
  $("#preview-files-container").css("display","none");
if(!text.length){
  $('#send-message-btn').css('display','none');
  $('#voice-message-btn').css('display','inline-block');
}
  
  $("#attachment-btn-container").css("display","block");
  $("#preview-upload-files").empty();
 
  var tmpDir=new android.File( PUBLIC_FOLDER, "TEMP-DIR"); 

   try{
   if( tmpDir.isDirectory() )
      tmpDir.deleteFileOrFolder();
   }catch(e){}
}

   
 function uploadFiles_( tmpDir, fuser,files_total,i, v, sent_folder, preview_text, caption, file_type, file_ext, dimension, message_id){
   //var tmpDir=new android.File( PUBLIC_FOLDER, 'TEMP-DIR');
 
  var message_id=message_id||randomNumber(15 );
  var file_highlight= v.replace(/[^a-z0-9 _.-]+/gi,'');
  var sentDir=new android.File(FILES_FOLDER, 'sent/' + sent_folder);
     make_dir(sentDir );
   var chatId=message_id;
   var filename= fuser + '-' + chatId;
   var f__= sessionStorage.getItem("__files__")||"";
   sessionStorage.setItem("__files__", f__ + chatId + " ");   
   
   var file=new android.File( tmpDir, v);
   var size=file.length();
  
  //var  dimension_= dimension?"?ocwh=" + dimension:""
  var lfpath="sent/" + sent_folder + "/" + filename + "." + file_ext;
  
   var rename_to= new android.File( sentDir, filename + "." + file_ext );  
    if( file.renameTo( rename_to) ){
     
      /*var file__=rename_to.toString().replace(FILES_FOLDER + "/", "");
     
    var fdir= new android.File( CHAT_FOLDER, "CHATS/" + fuser + "/files-info");
     if( make_dir( fdir) ){
    var allFile=new android.File( fdir, file_type + "-files.txt");
        allFile.append('"' + chatId + '":{"file_path":"' + file__ + '","dimension":"' + dimension + '","local":true}\n,\n');       
    var allFile=new android.File( fdir, "allfiles.txt");
        allFile.append('"' + chatId + '":{"file_path":"' + file__ + '","dimension":"' + dimension + '","local":true}\n,\n');       
   }
   */
      var message="[file=::" + filename + "." + file_ext + "::]";
    
   if(i==0 && caption){
      message+="<br>" + caption;
    }
      
   var formatted=formatMessage( message_id, fuser,
   { msg: sanitizeMessage( message, 'direct'),
   chat_id:chatId,hl:v,pt:preview_text, lfpath: lfpath, dimension: dimension, sent_folder: sent_folder, file: file_type, fx: file_ext,size: size });
 
      displayMessage({
    'message':formatted,
    'page_down': true,
    'area':'uploadFiles',
    'DB':'ad'});
      
     
  sortChats( fuser, preview_text)
  copyToAwaitingFilesSend( chatId, formatted);
   
 if(i==( files_total-1 ) ){
  localStorage.setItem('last_message_id_' + username + '_' + fuser,chatId);
  localStorage.setItem('last_message_status_' + username + '_' + fuser, 'awaiting');
  localStorage.setItem('last_message_timestamp_' + username + '_' + fuser, moment().unix() );
 } 
   }
 }
 
   
   
function sendToServer( fuser, obj,callback){
 
  var message=obj.message;
  var base64=obj.data;
  var chatId=obj.chat_id;
  var url=obj.url;
  var call_function=obj.call_function;
  var file_type=obj.file_type;
  var file_ext=obj.file_ext;
  var lfpath=obj.lfpath;
  var dimension=obj.dimension||"";
  var preview_text=obj.pt;
  var file_highlight=obj.hl;

  var video_poster="";
  var poster=false;
 
  if( file_ext==="mp4"){
    
  var posterDir=new android.File( VPOSTER_FOLDER);  
  
  if(!posterDir.isDirectory() && !posterDir.mkdirs() ) {
    return;
  }
  poster=new android.File( posterDir, fuser + "-" + chatId + "-thumb.jpg"); 
  
  if( poster.isFile() ){
     video_poster=poster.readBase64();
  }
    else poster=false;
}
  
  var span=$('#upload-status-' + chatId);
  var size=base64.length;
  sessionStorage.setItem('sending_files','1');
 
 var us= $('#upload-status-' + chatId);
     us.css({ width: "1%"});
  
 var usc=$("#usc-" + chatId);
  usc.css("display","inline-block");
 $("#resend-btn-" + chatId).removeClass("d-inline-block").addClass("d-none");

setTimeout(function(){
  
  SEND_FILE_AJAX=$.ajax({
   xhr: function() {
      var xhr = new window.XMLHttpRequest();
    // Upload progress     
    xhr.upload.addEventListener("progress", function(evt){
        if (evt.lengthComputable) {
     var percent= (evt.loaded / evt.total)*100;
  
  $('#stadium-' + fuser + ' #resend-btn-' + chatId).removeClass('d-inline-block').addClass('d-none');
  $('#upload-status-' + chatId).css({ width: "" + percent + "%"});
  $('#usc-' + chatId).css('display','inline-block');
   
  if( percent==100){
    $('#upload-status-' + chatId).css({width:'100%'});
    $('#usc-' + chatId).css('display','none'); //usc-upload status container @"displayMessage()"
  
  }
   }
 }, false); 
       return xhr;
    },
    
    "url": url,
    "dataType":"json",
    "data":{
     "chat_to": fuser,
     "username" : username,
     "token": __TOKEN__,
     "version": config_.APP_VERSION,
     "chat_id":chatId,
     "base64": base64,
     "video_poster": video_poster,
     "dimension": dimension,
     "file_ext": file_ext,
 },
 
 type:'POST'
}).done( function(resp){
  //alert( JSON.stringify( resp) )
    
 if(resp.status && resp.status=='success' ){ 
  // $('.resend-btn-' + chatId).remove();
 
  callback("success", resp);
      size=resp.file_size;
  var server_folder=resp.file_folder;
  var sfpath=resp.file_path; //server full path
  var filename= fuser + '-' + chatId;
  var poster_path= resp.poster_path||"";
   
   var cid=randomNumbers(15 );
   
   var formatted_=formatMessage( cid, fuser, {msg:sanitizeMessage(message,'direct'),
     chat_id:chatId,hl:file_highlight,file: file_type,pt: preview_text,fx:file_ext,size:size, lfpath:lfpath, sfpath:sfpath, dimension: dimension});
 
   var sformatted_=formatMessage(  cid, fuser, {msg:sanitizeMessage(message,'direct'),
     chat_id:chatId,hl:file_highlight,file: file_type,pt: preview_text,fx:file_ext,size:size, sfpath: sfpath,  vposter: poster_path, dimension: dimension});
 
 var msgDiv=$("#stadiums #message-container-" + chatId);

 if( !msgDiv.length ){
  
   displayMessage({ 
      "message": formatted_,
      "page_down": true,
      "area":"sendToServer",
      "DB": "ap",
    //  "display_after": tempDiv,
     });
   
  }
   
 /*  var  meta_attr=lfpath + "|" + sfpath + "|" + file_highlight + "|" + file_type + "|" + size + "|" + dimension;
  $("#stadiums #share-file-" + chatId).attr("data-meta", meta_attr );
 */ 
   
   sortChats( fuser, preview_text);
   copyToAwaitingSend( sformatted_, function(){
   saveToDB( fuser, formatted_, 'input' ,'dont_display');
 
      
    var fdir= new android.File( CHAT_FOLDER, "CHATS/" + fuser + "/__FILES-INFO__");
     
     if( make_dir( fdir) ){
    var allFile=new android.File( fdir, file_type + "-files.txt");
        allFile.append('"' + chatId + '":{"file_path":"' + lfpath + '","dimension":"' + dimension + '","local":true}\n,\n');       
    var allFile=new android.File( fdir, "allfiles.txt");
        allFile.append('"' + chatId + '":{"file_path":"' + lfpath + '","dimension":"' + dimension + '","local":true}\n,\n');       
   }
   
     
   });
   sendMessage();
 
   if(poster){
     try{ poster.delete(); }catch(e){}
   }
   
   
 }
  else{
   callback('error',resp);
  }  
    
 setTimeout(function(){
   sendFiles();
 },3000);
  }).fail(function(e){
  setTimeout(function(){
   sendFiles();
 },3000);
  
 $("#stadiums #del-awaiting-doc-" + chatId).css("display","inline-block");
 $('#usc-' + chatId).css('display','none');
  callback('error', {"error":"000","ereport":JSON.stringify(e) } );
  });
  
 },500);
}   

  
  $(function(){
    
 $('body').on('click','.resend-btn',function(){
  var this_=$(this);
  var chatId=this_.data("chat-id");
   this_.removeClass("d-inline-block").addClass("d-none");
 
 var f__=sessionStorage.getItem("__files__")||"";
    sessionStorage.setItem("__files__", f__ + chatId + " " );
    setTimeout( function(){
      sendFiles();
    },200);
    
  });
});


function attachment(event,type){
closeDisplayData('.upload-files-menu');
  var tmpDir=new android.File(PUBLIC_FOLDER, "TEMP-DIR"); 

  try{
   if( tmpDir.isDirectory() )
      tmpDir.deleteFileOrFolder();
   }catch(e){}
   
 android.control.execute("" + event);
 // android.control.dispatchEvent(event,null);
}

function camera(asked){
  //Chat camera
  var fuser=chatOpened('s');
  var sett=canSendChat( fuser);
  var adm=siteAdmin( username) ;
  
 if( sett==0 ){
   return toast("Chat disabled");
 }else if( sett==-1 ){
   return toast("Loading settings. Try again",{type:"info"});
 }
  
try{
  var settings= JSON.parse( localStorage.getItem("server_settings") );
 
  if( !adm && settings.enable_file_upload!="YES"){
  return toast("Currently disabled");
}
 
 }catch(e){ 
  return  toast("Loading settings...", { type:"info"});
 }
  
 if(!hasPermission(cameraPermission)){
  requestPermission( cameraPermission);
 setTimeout(function(){
   if(!asked ) camera(true);
 },1000);
  return;
  }

  
 var token=randomString(5);
  localStorage.setItem('import_token', token);
  var tmpDir=new android.File(PUBLIC_FOLDER, 'TEMP-DIR'); 
  try{
   if( tmpDir.isDirectory() )
      tmpDir.deleteFileOrFolder();
   }catch(e){}
  android.control.execute("takePhoto()");
}   


var checkDownloadInt_;

function checkDownloadSuccess(){
  
  if(sessionStorage.getItem('download_running') ){
    return;
    //toast('running')
  }
  
  var tmpDownloadDir=new android.File( TMP_DL_FOLDER );
  var list=tmpDownloadDir.listFiles();
  var total=list.length;
  
  if(total<1){
    sessionStorage.removeItem('download_running');
   clearInterval(checkDownloadInt_);
    return;
  }
  
  sessionStorage.setItem('download_running','true');
  var len=0;
 
   checkDownloadInt_=setInterval(function(){
   
   if( len>=total ){
   sessionStorage.removeItem('download_running');
     clearInterval(checkDownloadInt_);
   checkDownloadSuccess();
  return;
  }
   
   var file=new android.File( list[len] );
   var obj=JSON.parse(file.read() );
   var did=obj.did;
   var chatid=obj.chat_id;
   var file_path=new android.File(obj.file);
 
   // if(!file_path.isFile() ){ file.delete(); }
         
  var result =getDownloadStatus(did);
   // alert(JSON.stringify(result))
  if(!result){
    downloadFailed(obj,did);
   }
   else{
  var dstatus=result.status;
  var tbytes=result.bytes;
  var rbytes=result.bytes_so_far;
     
  if(dstatus==8){
    $('#dsc-'+ chatid).css('display','inline-block');
    $('#download-status-' + chatid).css({width:'100%'});
    $('#dsc-'+ chatid).fadeOut(3000);
    //Download complete
   downloadCompleted(obj,did);
  }
 else if(dstatus==16){
    //Download failed
    downloadFailed(obj,did);
  }
   else{
    var percent=( Math.floor( (rbytes*100)/tbytes ) );
     $('#dsc-'+ chatid).css('display','inline-block');
    $('#download-status-' + chatid).css({ width: "" + percent + "%"});
     } 
   }
  len++;
 },2500);
  }


function downloadCompleted(obj,did){
  var chatid=obj.chat_id;
  var file_type=obj.file_type;
  var file_=obj.file; /*String: e.g received/images/TMP/file.png*/
  var filename=obj.filename;
  var fuser=obj.fuser;
 
  var rid=randomString(15);
  
try{ 
   
  var tmpFile=new android.File( TMP_DL_FOLDER, did + ".txt");
  var renameTo_=new android.File( FILES_FOLDER, filename.replace("/TMP","") );
  
  var f_=new android.File( file_);
  
  if( !f_.isFile() ){
   if(tmpFile.isFile() ) tmpFile.delete(); 
 return;    
  }
  
  
 if( f_.renameTo( renameTo_) ){
  var file_=renameTo_.toString();
  var sfile=file_.replace(FILES_FOLDER + "/", "");

 var fdir_= new android.File( CHAT_FOLDER, "CHATS/" + fuser + "/__FILES-INFO__");
  
 if( make_dir( fdir_) ){
   
 var allFile=new android.File( fdir_, file_type + "-files.txt");
     allFile.append('"' + chatid + '": {"file_path":"' + sfile + '"}\n,\n');
 var allFile2=new android.File( fdir_, "allfiles.txt");
     allFile2.append('"' + chatid + '": {"file_path":"' + sfile + '"}\n,\n');
  }
   
   if(file_type==="image"){
   $("#chat-photo-" + chatid).attr("src", file_ ).addClass("show-full-chat-photo");
   $("#chat-photo-full").attr("src", file_);
 }
  else if( file_type==="video"){
   $("#open-video-" + chatid).attr("data-source-url", file_ ); 
  }
  else if(file_type==="document"){
     android.control.dispatchEvent("ViewFile", [file_]);
  }
     
   
   tmpFile.delete();
  }
 }catch(e){}

}

function downloadFailed( obj, did){
  var chatid=obj.chat_id;
  var file_type=obj.file_type;
  var file=new android.File( obj.file);
  $('#dsc-'+ chatid).fadeOut();
   
  try{
    
  if(file_type=='image'){
   $('#chat-photo-' + chatid).addClass('download-photo');
 }
   else if(file_type=='video'){
   $('#chat-video-' + chatid).addClass('download-video');
 }
 
    else if(file_type=='document'){
      $('#chat-document-' + chatid).addClass('download-document');
 }
 
 else if(file_type=='audio'){
   $('#chat-audio-' + chatid).addClass('download-audio');
 }
    
 
  var tmpDownloadDir=new android.File(TMP_DL_FOLDER);
   var tmpFile=new android.File(tmpDownloadDir, did + '.txt');
   tmpFile.delete();
   file.delete();
  }catch(e){}
  
}


function downloadNow(url,obj){
 var chatid=obj.chat_id;
  var filename=obj.filename;

  var did = android.download.start({
  url: url,
  path: FILES_FOLDER_ + '/' + filename,
 });
 
  obj['did']=did;
  
  var tmpDownloadDir=new android.File( TMP_DL_FOLDER);

if(!tmpDownloadDir.isDirectory() && !tmpDownloadDir.mkdirs()){
  return toast('Unable to create tmp download directory.');
}
  
 
var tmpFile=new android.File(tmpDownloadDir, did + '.txt');
  if( !tmpFile.write( JSON.stringify(obj) ) ){
  return toast('Unable to create tmp download file.');
}
 
  checkDownloadSuccess();
 }


function logError(){
  alert('error');
}

$(function(){
  
  checkDownloadSuccess();
    
$('body').on('click','.download-photo',function(){
  if($('.message-selected').length) return;
    var this_=$(this );
    var url=this_.attr("data-url");
    var fileid=this_.attr("data-id");
    var durl=this_.attr("data-url");
    var chatid=this_.attr("data-chat-id");
    var filename=fileid + ".jpg";
    var fuser=this_.data("fuser");
 
  var receivedDir=new android.File( FILES_FOLDER, 'received/images/TMP');
   
  if( !receivedDir.isDirectory() && !receivedDir.mkdirs() ){
 return toast('Could not create images directory.');
  }
 var file=new android.File(receivedDir, filename);

  if( !file.isFile() && this_.hasClass('download-photo') ){
  this_.removeClass('download-photo');
 
   downloadNow(durl,{
    chat_id: chatid,
    filename: 'received/images/TMP/' + filename,
    file_type: 'image',
    file: "" + file.toString(),
    fuser: fuser
  });
    
}
  

 });
  
  
  $('body').on('click','.chat-document',function(){
   //if( $('.message-selected').length) return;
    if( $('#message-selected-toolbar').is(":visible")){
    return;
  }
 
   var this_=$(this);
    var path=this_.attr("data-path");
    var id=this_.data("id");
    var durl=this_.attr("data-download-url");
    var chatid=this_.data("chat-id");
    var ext=this_.data("ext");
    var fuser=this_.data("fuser");
    var filename=id + "." + ext;
    var receivedDir=new android.File( FILES_FOLDER, 'received/documents/TMP');
   
  if(!receivedDir.isDirectory() && !receivedDir.mkdirs() ){
   return toast('Could not create pdfs directory.');
 }
  
 var rFile=new android.File( receivedDir.toString().replace('/TMP','') ,filename);  
 var sFile=new android.File( FILES_FOLDER, 'sent/documents/' + filename ); 
 
   if( !durl || sFile.isFile() ){
    // alert("File existed@ " + sFile.toString())
     try{
      android.control.dispatchEvent("ViewFile",[sFile.toString()]);
     // android.control.execute("ViewFile('" + sFile.toString() + "')");
     }catch(e){ alert(e); }
    
  return;
   }
    else if(rFile.isFile()){
      android.control.dispatchEvent("ViewFile",[rFile.toString()]);
     return; 
    }
   
 if( this_.hasClass('download-document') ){
   
   if( !confirm('Download?') ) return;
  
  this_.removeClass('download-document');
     
 var file= new android.File(receivedDir, filename );
  //android.clipboard.setText(durl)
  downloadNow( durl, {
    chat_id: chatid,
    filename: 'received/documents/TMP/' + filename,
    file_type: 'document',
    file: file.toString(),
    fuser: fuser,
  });
 }
   
  });
  
 
});


function downloadVideo(node_){
 
  var chatid=node_.data('chatid');
  var fileid=node_.data('fileid');
  var url=node_.attr('src');
  var durl=node_.attr('data-download-url');
  var filename=fileid + '.mp4';
  var fuser=node_.data('fuser');
  
var receivedDir=new android.File( FILES_FOLDER,'received/videos/TMP');
  if( !receivedDir.isDirectory() && !receivedDir.mkdirs()){
return toast('Could not create videos directory.');
 }
   
   var file=new android.File(receivedDir, filename);
        
if( !file.isFile() && node_.hasClass('download-video') ){
   $('#open-video-' + chatid).attr("data-dv","");
  node_.removeClass('download-video');
  if( !confirm('Download also?') ) return;
  
  
  downloadNow( durl,{
    'chat_id': chatid,
    'filename': 'received/videos/TMP/' + filename,
    'file_type': 'video',
    'file':file.toString(),
    'fuser': fuser,
   });
} 
 }


function downloadAudio(node_){
  
  var chatid=node_.data('chatid');
  var fileid=node_.data('fileid');
  var url=node_.attr('src');
  var durl=node_.attr('data-download-url');
  var filename=fileid + '.mp3';
  var fuser=node_.data('fuser');
  
var receivedDir=new android.File( FILES_FOLDER,'received/audios/TMP');
  if( !receivedDir.isDirectory() && !receivedDir.mkdirs()){
return toast('Could not create audios directory.');
 }
   
   var file=new android.File(receivedDir, filename);
        
  if( !file.isFile() && node_.hasClass('download-audio') ){
    node_.removeClass('download-audio');
    if( !confirm('Download also?') ) return;
    
  downloadNow( durl,{
    'chat_id': chatid,
    'filename': 'received/audios/TMP/' + filename,
    'file_type': 'audio',
    'file':file.toString(),
    'fuser': fuser,
   });
  }   
}



 function resizeImageData( datas, maxWidth, maxHeight, callback,ext){
   datas='data:image/jpeg;base64,' + datas;

   var img = document.createElement('img');
     img.onload = function(){     
     // We create a canvas and get its context.
       var canvas = document.createElement('canvas');
       var ctx = canvas.getContext('2d');

       var width=img.width;
       var height=img.height;
       
 function aspectRatio(srcWidth, srcHeight, maxWidth, maxHeight) {
   var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return { width: srcWidth*ratio, height: srcHeight*ratio };
 }   
    var aspect_=aspectRatio(width,height,maxWidth, maxHeight); 
      
      canvas.width = aspect_.width;
      canvas.height = aspect_.height;

      ctx.drawImage(this,0,0,width, height,0,0,canvas.width,canvas.height);
     callback(canvas.toDataURL('image/jpeg',90) );
  };
      img.src = datas;
   }


function uploadProfilePicture(type){
  closeDisplayData('.upload-profile-picture-div');  
 if(
   type=='camera'){
   var token=randomString(5);
  localStorage.setItem('import_token', token);
  android.control.execute("takeProfilePicture()");
 }else if ( type=='gallery'){
  android.control.execute("importMyProfilePicture()");
  // android.control.dispatchEvent('myProfilePicture', null);  
 }
}   

function removeProfilePicture(){
  var data='<div class="center_header text-left" style="padding-left: 30px; padding-top: 13px; font-size: 15px;">Remove photo?</div>';
     data+='<div class="center_text_div text-right" style="width:100%; font-size: 13px; padding: 10px 15px;">';
     data+='<span onclick="closeDisplayData(\'.remove-profile-picture-div\');" style="margin-right: 25px;">CANCEL</span><span class="" onclick="removeProfilePicture_();">REMOVE</span>';
  data+='</div>';
  displayData(data, { width: '90%', oszindex: 500, pos:'50', data_class:'.remove-profile-picture-div',osclose:true});
  closeDisplayData('#upload-profile-picture-div');
}


function removeProfilePicture_(){
  closeDisplayData('.remove-profile-picture-div');
  closeDisplayData('.upload-profile-picture-div');
  
  sessionStorage.setItem('DELAY','1');
   $.ajax({
   'url': DOMAIN_ + '/oc-upload/remove-profile-picture.php',
   'type': 'POST',
   'dataType':'json',
   'data':{
     'username': username,
     'token': __TOKEN__
      }
 }).done(function( result){
     sessionStorage.removeItem('DELAY','1');
  if( result.status ){
    var profileDir=new android.File(MAIN_FOLDER, username);
    var file=new android.File( profileDir,'profile_picture.jpg');

   try{
     file.delete()
   }catch(e){ toast(e); }
   return myProfilePicture();
}
     else if(result.error ){
        toast(result.error,{type:'light',color:'#333'});
   }
 }).fail(function(e ){
     sessionStorage.removeItem('DELAY','1')
     toast('Unable to remove photo.');
   });
}


function processProfilePicture(evt){
  try{
  var profileDir=new android.File(MAIN_FOLDER, username );
  if(!profileDir.isDirectory() && !profileDir.mkdirs() ){
    toast('Failed to update profile picture.');
   android.activity.loadUrl("go_social","javascript:toast('Failed to upload.');");
  }
  var path = evt.detail.path;
  var file = new android.File(path);
  var pin= evt.detail.pin;
   android.activity.loadUrl("go_social","javascript:toast('Uploading...',{type:'info'});");
   processProfilePicture_(file, profileDir, pin);
    
  }catch(e){
    return report__('ERROR "processProfilePicture()"', e);
 } 
}


 function processProfilePicture_(file, profileDir, pin){
   pin=pin||"";
  //Pin is set if upload is from go-social.js
    var base64 = file.readBase64();
      sessionStorage.setItem('DELAY','1');
    $('#profile-picture-loading').css('display','block');
    $.ajax({
         'url': DOMAIN_ + '/oc-upload/upload-profile-picture.php',
         'type': 'POST',
        'dataType':'json',
         'data':{
           'base64': base64,
           'username': username,
           'pin': pin,
           'token': __TOKEN__,
           'version': config_.APP_VERSION,
      }
  }).done(function(result){
      sessionStorage.removeItem('DELAY');
   var save=true;
 if( pin && pin!=username) {
   save= false;
 }
   
  $('#profile-picture-loading').css('display','none');   
   
  if( result.status ){
   android.activity.loadUrl("go_social","javascript: goProfilePhotoUploaded();");
   //Check go-social2.js 
 if(save){
     var copy_to=new android.File(profileDir,'profile_picture.jpg');  
    
    if( file.copyTo( copy_to ) ){
       myProfilePicture();
       toast( result.result,{type:'success'});
    try{
       file.delete();
     }catch(e){}
   
   return report__('Profile picture updated successfully.');
 }else{
       android.toast.show('Could not process your picture.');
     android.activity.loadUrl("go_social","javascript:toast('Could not process photo.');");
    return report__('Error: "processProfilePicture_()"','Could not copy');
     } 
   }
 return;
  }else if( result.error){
    toast("Couldn't update profile picture");
   report__('Profile picture update failed-2.', result.error);    
  }
  android.activity.loadUrl("go_social","javascript:toast('Upload failed.');");
 }).fail(function(e, txt,xhr){
    sessionStorage.removeItem('DELAY');
      $('#profile-picture-loading').css('display','none');
      toast('Failed to update profile picture. ' + xhr);
      android.activity.loadUrl("go_social","javascript:toast('Failed to upload');");
     report__('Error: "processProfilePicture_()"', JSON.stringify(e));    
       });
  }

  

document.addEventListener("profile_picture.ready", function(evt){
  //Profile picture from camera
  processProfilePicture(evt);
  imgcache_=imgcache();
});
  
document.addEventListener("my.profile.picture.received", function(evt){
  //Profile picture Coming From Gallery  
  processProfilePicture( evt);
   imgcache_=imgcache();

});

document.addEventListener("pic.ready", function(evt){
  processImage(evt );
});
  

document.addEventListener('picCompleted',function t(evt){
 //alert(evt.detail.path)
 setTimeout(function(){
   uploadFiles({
     type: "image" });
 },500);
  
});
   
document.addEventListener('videoCompleted',function t(evt){
  setTimeout(function(){
   uploadFiles({
     type: "video" });
  },500);
});


document.addEventListener('audioCompleted',function t(evt){
  setTimeout(function(){
    uploadFiles({
     type: "audio" });
  },500);
});


document.addEventListener('documentsCompleted',function t(evt){
  
  setTimeout(function(){
    uploadFiles({
      type: "document" });
  },500);
});

