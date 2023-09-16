var recordSec = 0;
 var recordTimer_;
 var isRecording=false;
 var sec_rec_time, minute_rec_time, rec_time;

let audioIN = { audio: true };
	// audio is true, for recording

	// Access the permission for use
	// the microphone
	navigator.mediaDevices.getUserMedia(audioIN)

	// 'then()' method returns a Promise
	.then(function (mediaStreamObj) {

		// Connect the media stream to the
		// first audio element
		let audio = document.querySelector('audio');
		//returns the recorded audio via 'audio' tag

		// 'srcObject' is a property which
		// takes the media object
		// This is supported in the newer browsers
	/*
    if ("srcObject" in audio) {

		audio.srcObject = mediaStreamObj;
		}
		else { // Old version
		audio.src = window.URL
			.createObjectURL(mediaStreamObj);
		}
 */
      
		// It will play the audio
	/*	audio.onloadedmetadata = function (ev) {

		// Play the audio in the 2nd audio
		// element what is being recorded
	//	audio.play();
		};
*/
		// Start record
		let start = document.getElementById("record-now");

		// Stop record
		let stop = document.getElementById("stop-record");

		// 2nd audio tag for play the audio
		let playAudio; // = document.getElementById('audioPlay');

		// This is the main thing to recorded
		// the audio 'MediaRecorder' API
		let mediaRecorder = new MediaRecorder(mediaStreamObj);
		// Pass the audio stream

		// Start event
start.addEventListener('click', function (ev) {
	$(start).css("display","none");
    $(stop).css("display","block");
	
  mediaRecorder.start();
        recordTimer();
        isRecording=true;
   //let record_state=mediaRecorder.state;
 })

		// Stop event
stop.addEventListener('click', function (ev) {
	$(stop).css("display","none");
    $(start).css("display","block");
	isRecording=false;
  mediaRecorder.stop();
 
     recordSec=0;
    $("#record-stadium").hide();
    $("#record-progress-radar").css("width","0");
    $("#record-progress-nob").css("left","0");
   // $(recordButton).removeClass("stop-record-icon").addClass("record-icon");
   
   sec_rec_time=+$("#record-seconds").text();
   minute_rec_time=+$("#record-minutes").text();
   rec_time=$("#record-timer").text();
   clearInterval( recordTimer_);
  
    	// console.log(mediaRecorder.state);
  });

		// If audio data available then push
		// it to the chunk array
 mediaRecorder.ondataavailable = function (ev) {
  dataArray.push(ev.data);
}

		// Chunk array to store the audio data
		let dataArray = [];

		// Convert the audio data in to blob
		// after stopping the recording
 mediaRecorder.onstop = function (ev) {
    closeDisplayData(".voice-message-dummy");
		// blob of type mp3
		let audioData = new Blob(dataArray,
					{ 'type': 'audio/mp3' });
			
	
		// After fill up the chunk
		// array make it empty
		dataArray = [];

		// Creating audio url with reference
		// of created blob named 'audioData'
	
         $("#record-minutes, #record-seconds").text("00");
 
   if( minute_rec_time<1 && sec_rec_time<2){
    toast('Record too short');
    return;
  }
 
     isRecording=false;
     saveSendAudio( audioData, rec_time);     
    
               
    /*
    let audioSrc = window.URL
			.createObjectURL(audioData);
*/
          
		// Pass the audio url to the 2nd video tag
 //playAudio.src = audioSrc;
		}
	})

	// If any error occurs then handles the error
	.catch(function (err) {
		console.log(err.name, err.message);
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
   
  var reader = new FileReader();
    reader.onloadend = function() {
      
  var result= reader.result.split(',');
   
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

   /*
   var mic=$('#mic');
  if(!mic.hasClass('initialised') ){
    mic.click();
    mic.addClass('initialised');
  }
  */
     
  $('#record-stadium').show();
  $('#max-record-time').text(config_.max_record_time);
    pauseAudioPlayer();
    displayData('',{ append:false, dummy: true, osclose: false, on_close:'cancelRecord', data_class:'.voice-message-dummy'});
 }catch(e){ alert(e); }
 });
 
});

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
     
   if(min_>=config_.max_record_time) {
    if(isRecording) {
      $(stop).click();
    }
     
     }
    }, 1000);
 }



