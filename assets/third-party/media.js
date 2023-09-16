var FILES_FOLDER="";
var LIVE__=true;
var VPOSTER_FOLDER="";
var externalDir="";

function imageScale(imgW,imgH,maxW,maxH){
 return(Math.min((maxW/imgW),(maxH/imgH,1)));
}

function photoLayout(file_id, lfpath,sfpath, dimension, file_title, fsize, ext_img){
  var chatid=file_id;
  
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
   var data='<img alt="" class="show-full-chat-photo media-photo" onclick="enlargePhoto(this);" style="height:' + imgheight + '; width:' + imgwidth + ';" src="' +  FILES_FOLDER +'/' + lfpath + '" data-fuser="super" onerror="sentChatImageError(this,\'' + file_id + '\');">'; 
  }
  else{
    var data='<img alt="" height="' + imgheight + '" class="lazy show-full-chat-photo media-photo" onclick="enlargePhoto(this);" style="height: ' + imgheight + '; width:' + imgwidth + 'px;" id="chat-photo-' + chatid + '" data-fuser="super" data-id="' + file_id + '" data-chat-id="' + chatid + '" data-src="' + sfpath + '" data-ext-img="' + ext_img + '" onerror="receivedChatImageError(this);">';
 }
  data+='<input class="FILE__" id="file-share-' + chatid + '" type="hidden" value="' + file_id + '.jpg|images" data-meta="' + meta_ + '">';

  return '<div class="media-container"><div class="media-image-container" data-file-id="' + file_id + '" data-chat-id="' + chatid + '">' + data + '</div></div>'; 
 }



function fileLayout( ext, file_id, lfpath,sfpath,file_title, fsize){
 var chatid=file_id;    
 var download_url="";
 var path= lfpath
 ext=ext||"unk";
  
   if( !lfpath ){
 var downloadUrl= sfpath;
 var path='received/' + ext + 's/' + file_id + '.' + ext;
  }
  
  var  meta_=path + "|" + sfpath + "|" + file_title + "|document|" + fsize + "|0"
  
var data='<div class="media-document container-fluid ' + ( sfpath ? 'download-document':'') + '" id="media-document-' + chatid + '" data-fuser="super" data-ext="' + ext + '" data-download-url="'  + sfpath + '" data-chat-id="' + chatid + '" data-path="' + path + '" data-id="' + file_id + '" onclick="downloadDocument(this);">'; 
    data+='<div class="row">';
    data+='<div class="col text-primary" style="padding:0; border-right: 1px solid #0079c6; overflow-x: hidden; width: 40px; max-width: 40px;">';
    data+='<input class="FILE__" id="file-share-' + chatid + '" type="hidden" value="' + file_id + '.' + ext + '|documents" data-meta="' + meta_ + '">';
    data+='<div class="media-document-icon">' + ext.substr(0,3) + '</div></div>';
    data+='<div class="col" style="padding-left:0; overflow-x: hidden;"><div class="document-title">' + file_title + '</div></div>';
    data+='</div></div>';
   
 return '<div class="media-container"><div class="media-document-container" data-file-id="' + file_id + '" data-chat-id="' + chatid + '">' + data + '</div></div>';
}


function audioLayout( file_id, lfpath,sfpath,preview_text, fsize){ 
  var chatid=file_id;
  var downloadUrl='';
  var dv='';
    
  var received=new android.File( FILES_FOLDER, 'received/audios/' + file_id + '.mp3');
   
  if( lfpath){
   var sourceUrl= FILES_FOLDER + '/' +  lfpath;
     }
  else if( received.isFile() ){
   var sourceUrl=received.toString();    
  }else{
    downloadUrl= sfpath;
    var sourceUrl=sfpath;
    dv='download-audio';
  }
  
  if( !LIVE__){
    sourceUrl=sourceUrl.replace("http://localhost:8080", externalDir +"/Icode-Go/data_files/www");
  }
  
  var  meta_=lfpath + "|" + sfpath + "|" + preview_text + "|audio|" + fsize + "|0";

var data='<div class="media-container"><div class="media-audio-container" data-file-id="' + file_id + '" data-chat-id="' + chatid + '"><figure id="' + chatid + '-audio-container" class="audio-container" data-chatid="' + chatid + '">';
    data+='<input class="FILE__" id="file-share-' + chatid + '" type="hidden" value="' + file_id + '.mp3|audios" data-meta="' + meta_ + '">';
    data+='<div class="audio-title text-center">' + ( preview_text||"" ) + '</div>';
    data+='<audio id="' + chatid + '-audio" class="' + dv + ' audio-tag" data-download-url="' + downloadUrl + '" data-fuser="super" data-chatid="' + chatid + '" data-fileid="' + file_id + '" src="' + sourceUrl + '">';
    data+='</audio>';
    data+='</figure></div></div>';
  
  
    return data;
}

function videoLayout(file_id,lfpath,sfpath, dimension, file_title, poster, fsize){
  var chatid=file_id;
  var downloadUrl='';
  var dv='';
  var file_title=file_title.split("~")[0];
  
  var received=new android.File( FILES_FOLDER, 'received/videos/' + file_id + '.mp4');

  if( lfpath ){
   var sourceUrl= FILES_FOLDER + '/' +  lfpath;
  }
 else if(received.isFile() ){
  var sourceUrl=received.toString();
 }
  else{
        downloadUrl=sfpath;
    var sourceUrl=sfpath;
    dv='download-video';
  }
  
  if( !LIVE__){
    sourceUrl=sourceUrl.replace("http://localhost:8080", externalDir +"/Icode-Go/data_files/www");
  }
 
 var name= sourceUrl.split("/").pop().split(".")[0];
 //var local_vposter=VPOSTER_FOLDER + "/" + name + ".jpg";
    
  var dim=dimension.split("_");
  var width=+dim[0]||250;
  var height=+dim[1]||0;
 
  var dW=$(window).width();
  var maxW=dW<250?dW:250;
  
 if( height ){
  var size=imageScale( width,height, maxW,320);
  var imgheight= Math.ceil( size*height ) + "px";  
  var imgwidth= Math.ceil( size*width ) + "px";
 }
  
  else {
    imgwidth=maxW + "px";
    imgheight="auto";
  }
  
  var  meta_=lfpath + "|" + sfpath + "|" + file_title + "|video|" + fsize + "|0";

  
  
   var data='<div class="media-video-container video--container">';
  data+='<div class="container-fluid"  id="open-video-' + chatid + '" onclick="openVideo(this);" data-fuser="super" data-fileid="' + file_id + '" data-filetitle="' + file_title + '" data-dv="' + dv + '" data-durl="' + downloadUrl + '" data-vid="' + chatid + '" data-source-url="' + sourceUrl + '" data-poster="' + poster + '" data-vid="' + chatid + '">';
  data+='<div class="row">';
  data+='<div class="col">';
  data+='<div class="media-video-play-icon-container"><img class="media-video-play-icon" src="file:///assets/third-party/play.png"></div>';
  data+='</div>';
  data+='<div class="col">';
  data+='<div class="media-video-title">' + file_title + '</div>';
  data+='</div>';
 if(poster) {
   data+='<div class="col">';
   data+='<div class="media-video-poster-container"><img class="media-video-poster" src="' + poster + '"></div>';
  data+='</div>';
 }
  data+='</div></div></div>';

  return data;
}


function openVideo(t){
  if( $('#message-selected-toolbar').is(":visible")){
    return;
  }
  var this_= $(t);
   var vid=this_.data('vid');  
  var sourceUrl=$.trim(this_.attr('data-source-url'));
  var poster=this_.data('poster');
  var fuser=this_.data('fuser');
  var file_id=this_.data('fileid');
  var file_title=this_.data('filetitle');
  var dv=this_.attr('data-dv');
  var downloadUrl=this_.attr('data-durl');

  var data='<figure id="' + vid + '-video-container" class="video-container" data-fuser="' + fuser + '" data-chatid="' + vid + '">';
     data+='<input id="file-share-' + vid + '" type="hidden" value="' + file_id + '.mp4|videos" />';
     data+='<div class="video-title text-center">' + file_title + '</div>';
     data+='<video id="' + vid + '-video" class="' + dv + ' video-tag" data-fuser="' + fuser + '" data-download-url="' + downloadUrl + '" data-chatid="' + vid + '" data-fileid="' + file_id + '" poster="' + poster + '" autoplay controls preload="none" src="' + sourceUrl + '#t=0.1">';
     data+='</video>';
     data+='</figure>';
   
  $(".video-container").css('display','none');
 
 if( !$('#' + vid + '-video-container').length) {
    $('#video-element-container').append(data);

 try{
    mediaplayer_( $('#' + vid + '-video'), fuser );
 }catch(e){ 
    toast(e);
    }
  }
    
  $('#' + vid + '-video').trigger('play');
 $("#video-element-container, #" + vid + "-video-container").css("display","block");
}


function mediaplayer_($elem, fuser, preview){
  //preview: if video is been preview before being sent
  $elem.mediaelementplayer({
//$('video,audio').mediaelementplayer({
  defaultVideoWidth: '100%',
  defaultVideoHeight: '100%',
  videoWidth: 250, /*340,*/
  videoHeight: 230,
  hideVideoControlsOnLoad: true,
  clickToPlayPause: true,
  controlsTimeoutDefault: 2000,
  features: ["playpause","current", "progress", "duration"],
  enableKeyboard: false,
  stretching: 'none',
  pauseOtherPlayers: true,
  ignorePauseOtherPlayersOption: false,
  hideVolumeOnTouchDevices:true,
  
  success: function(media, originalNode, instance) {
   var node=$(originalNode);
    var chatid=node.data('chatid');
  var isVideo=node.hasClass('video-tag');
  var isAudio=node.hasClass('audio-tag')
 
  
media.addEventListener('loadedmetadata',function(){
 if( isVideo ) enableVideoFullScreen( node, chatid,preview );
    
});
    
  media.addEventListener('seeked',function(){
  
  if( isVideo){
    setTimeout(function(){
     captureVideoPoster(originalNode,fuser,chatid);
   },800);
  }
  });
    
  media.addEventListener('play',function(e){
   
  if( isVideo ){
  
    enableVideoFullScreen( node, chatid, preview);
    downloadVideo(node);
    
  }else if( isAudio ){
    downloadAudio(node);
 }
  });  
   
 },
  error: function(){
    exitVideoFullScreen(true)
   toast('Unable to load.');
  }
});
}


function enableVideoFullScreen(node_, chatid, preview){
   if( node_.hasClass('video-tag') ){
     
    var cont=node_.parent().closest('.mejs__container');
    cont.addClass('mejs__custom-fullscreen ' + (!preview?'watching-video watching-video-' + chatid:'') );
      cont.removeAttr('style');
      cont.attr('data-wvchatid',chatid);
    
    cont.find('.mejs__overlay,.mejs__layer').css({width:'100%',height:'100%'});
    $('#text-box-container,.toolbar1').hide(); 
 
   }
}


function exitVideoFullScreen(remove_){
  $('video').trigger('pause');
 var fs=$('.mejs__custom-fullscreen');
  
  $('#video-element-container,.video-container').css('display','none');
  
var chatid=fs.attr('data-wvchatid');
$('#text-box-container,.toolbar1').show();

 if(remove_){
  $('#' + chatid + '-video-container').remove();
}

}

function isWatchingVideo(){
 return $('#video-element-container').is(":visible")
}



function pauseAudioPlayer(){
  $('audio').trigger('pause');
}



function captureVideoPoster(video,fuser,chatid){
 if( !$(video).hasClass('video-tag') ) return;
  var posterDir=new android.File( VPOSTER_FOLDER);  
  if(!posterDir.isDirectory() && !posterDir.mkdirs() ) return;
  var src=video.src;
  var name= src.split("/").pop().split(".")[0];

 var poster=new android.File(posterDir, name + '.jpg');
 if( poster.isFile() ) return;
 
  var canvas = document.createElement("canvas");
// scale the canvas accordingly
  var oriWidth=video.videoWidth;
  var oriHeight=video.videoHeight;

 var width= oriWidth
 var perc=(width*100)/oriWidth;
 var height=oriHeight; //(perc/100)*oriHeight;
 
   canvas.width = width; 
   canvas.height =height; 
// draw the video at that frame
  var ctx=canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
// convert it to a usable data URL
 var dataURL = canvas.toDataURL("image/jpeg", 0.8);
 var data=dataURL.split(',')[1];
 
 if( data && poster.writeBase64( data)){
   $('#video-poster-' + chatid).attr('src', poster.toString() );
  }
  
}


function downloadDocument(t){
 if (!confirm("Download")) {
   return;
 }
 var this_=$(t);
 var url=this_.data("download-url");
 if(!url){
 return  toast("Url not found");
 }
  location.href=url;
}

