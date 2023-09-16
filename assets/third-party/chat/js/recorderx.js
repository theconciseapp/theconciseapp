 var recordSec = 0;
 var recordTimer_;
 var isRecording=false;
 var sec_rec_time, minute_rec_time, rec_time;


function pad ( val ) { return val > 9 ? val : "0" + val; }    
 
 function recordTimer(){
  var max_time=+$('#max-record-time').text();
      max_time=max_time*60;
   var cur_sec=0;
   recordTimer_=setInterval( function(){
    $("#record-seconds").html( pad( ++recordSec%60));
    var min_=pad(parseInt(recordSec/60,10))
     $("#record-minutes").html( min_ );
     cur_sec++;
    var perc=(cur_sec*100)/max_time;
     $('#record-progress-radar').css("width","" +perc + "%");
     $('#record-progress-nob').css("left","" +perc + "%");
     
   if(min_==config_.max_record_time) {
    if(isRecording) {
      $('#record-now').click();
    }
     
     }
    }, 1000);
 }

 window.addEventListener('DOMContentLoaded',  function(){
    const getMic = document.getElementById('mic');
    const recordButton = document.getElementById('record-now');
    const list = document.getElementById('recordings');
    if ("MediaRecorder" in window) {
      // everything is good, let's go ahead
   
    getMic.addEventListener('click', async() => {
      //  getMic.setAttribute('hidden', 'hidden');
    try {
       //await
   const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
   });
          
          const mimeType = "audio/webm"; //'audio/webm';
     
          let chunks = [];
          const recorder = new MediaRecorder(stream, { type: mimeType });
         
          recorder.addEventListener("dataavailable", event => {
             
            if (typeof event.data === "undefined") return;  
               if (event.data.size === 0) return;

               chunks.push(event.data);
          
          });
    
   recorder.addEventListener("stop", () => {
   closeDisplayData(".voice-message-dummy");
     
  const recording = new Blob(chunks, {
        type: mimeType
   });
    $("#record-minutes, #record-seconds").text("00");
 
   if( !isRecording){
    chunks=[];
    return;
  }else if( minute_rec_time<1 && sec_rec_time<2){
    chunks=[];
    toast('Record too short');
    return;
  }
     
     chunks = [];
      isRecording=false;
     saveSendAudio( recording, rec_time);     
   });         
         recordButton.removeAttribute('hidden');
         
    recordButton.addEventListener('click', () => {
    
    if (recorder.state === 'inactive') {
        recorder.start();
      $(recordButton ).removeClass('record-icon').addClass('stop-record-icon');
  isRecording=true;   
  recordTimer();
   } else {
     recorder.stop();
     recordSec=0;
    $("#record-stadium").hide();
    $("#record-progress-radar").css("width","0");
    $("#record-progress-nob").css("left","0");
    $(recordButton).removeClass('stop-record-icon').addClass('record-icon')
   
   sec_rec_time=+$("#record-seconds").text();
   minute_rec_time=+$("#record-minutes").text();
   rec_time=$("#record-timer").text();
   clearInterval( recordTimer_);
  
   }
   });
   } catch(e) {
  toast("You denied access to the microphone");
        }
      });
    
    } else {
   toast("Your device doesn't support voice message");
    }
  });
        

function saveSendAudio( blob, rec_time){
  closeDisplayData(".voice-message-dummy");
  
  var fuser=chatOpened("s");
  var chatId= randomNumber(15);
  var filename=fuser + "-" + chatId;
  var preview_text="\u266B Voice message (" + rec_time + ")";
   
  var file_ext="mp3";
  var sentDir=new android.File( FILES_FOLDER, "sent/audios");
  if(!sentDir.isDirectory() && !sentDir.mkdirs()){
    return toast("Dir error");
  }
  
  var file=new android.File( sentDir, filename + "." + file_ext);

 try{
   if(result.length<2){
        return android.toast.show("Recording failed. Try updating chrome or system software"); 
       }
      
  var base64= result[1];
  var size  =base64.length;

if( file.writeBase64( base64) ){
  var message="[file=::" + filename+ "." + file_ext + "::]";   
  
  var lfpath="sent/audios/" + filename + "." + file_ext;
  var cid= Date.now(); //randomNumbers(15 );  

  var formatted=formatMessage( cid, fuser, {msg:sanitizeMessage( message, "direct"),
     chat_id: chatId, hl: preview_text, file: "audio",pt: preview_text,fx:file_ext,size:size, lfpath: lfpath });
  
  displayMessage({
    "message": formatted,
    "page_down": true,
    "area":"uploadFiles",
    "DB":"ad"
  });
  
  sortChats( fuser,preview_text)
  copyToAwaitingFilesSend( chatId, formatted);

  $(".friend-preview-container-" + fuser).remove();
  localStorage.setItem("last_message_id_" + username + "_" + fuser, chatId);
  localStorage.setItem("last_message_status_" + username + "_" + fuser, "awaiting");
  localStorage.setItem("last_message_timestamp_" + username + "_" + fuser, moment().unix() );

 
  var f__= sessionStorage.getItem("__files__")||"";
   sessionStorage.setItem("__files__", f__ + chatId + " ");
  
   if(!sessionStorage.getItem("sending_files") ){
     sendFiles();
    }
 }else{
  android.toast.show("Couldn't send voice message");
}
   };
reader.readAsDataURL(blob);
 }catch(e){ toast(e); }
}


function cancelRecord(){
 // return;
 var record=$('#record-now');
 var rs= $('#record-stadium');
 if( !rs.is(':visible') ) return;
 
 rs.hide();  
  if( isRecording){
  isRecording=false;
    record.click();
  }
 closeDisplayData('.voice-message-dummy');
}


$(function(){
  
$('body').on('click','#voice-message-btn',function(){
 var this_=$(this);
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
  
   try{
   var mic=$('#mic');
  if(!mic.hasClass('initialised') ){
    mic.click();
    mic.addClass('initialised');
  }
  $('#record-stadium').show();
    $('#max-record-time').text(config_.max_record_time);
    pauseAudioPlayer();
    displayData('',{ append:false, dummy: true, osclose: false, on_close:'cancelRecord', data_class:'.voice-message-dummy'});
 }catch(e){ alert(e); }
 });
 
});