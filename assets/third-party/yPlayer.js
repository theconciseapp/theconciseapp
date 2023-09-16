
function loadYApi(){
 $.getScript( "https://www.youtube.com/iframe_api", function(resp, status){
    $("body").addClass("yapi-loaded");
 }).fail(function(){
  // toast("Check your internet");
   setTimeout( function(){ 
  loadYApi();
  }, 3000);
 });
}

     var player;
     var players = {};

  function onYouTubeIframeAPIReady() {
    if( typeof(YT)=="undefined") return;
    var ycvideo=$(".yplayer-container:not(.loaded)");
    
    ycvideo.each(function(pos){
      var this_=$(this);
      var id=this_.attr("id");
        player = new YT.Player( id, {
          width: window.innerWidth,
          height: window.innerHeight,
          videoId: id,
          playerVars: {
            'playsinline': 0,
            'controls' : 1,
            'fs' : 0,
            'disablekb': 1,
            'modestbranding':1,
            'iv_load_policy':3
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
 $(player).attr("data-link",id).attr("data-pos",pos);
     players[id]=player;
    });
  }

      // 4. The API will call this function when the video player is ready.
 function onPlayerReady(event) {
     var yelem=$(event.target);
     var yid=yelem.attr("data-link");
     var pos=+yelem.attr("data-pos");
     var cont=$("#" + yid);
     cont.addClass("loaded").attr("data-pos", pos);
    }

      // 5. The API calls this function when the player's state changes.
 function onPlayerStateChange(event) {

  }


function openYoutube(t){
 var this_=$(t);
  var yid=this_.data("id");
  var cont=$("#" + yid);
  if(!cont.hasClass("loaded") ){
 return android.toast.show("Requires good internet connection"); 
 }
 var pos=cont.attr("data-pos"); 
  cont.attr("data-position", pos ).css("display","block");
  
 setTimeout(function(){
  players[yid].playVideo();
 },500);
}

      
 function stopVideo(position) {
 $.each(players, function(id,v){
   players[id].stopVideo();
 });
}

function pauseVideo(position) {
  $.each(players,function(id,v){
        players[id].pauseVideo();
      });
 }



function youtubeLayout(link, title, poster){
 
 var data='<div class="media-video-container youtube-video-container">';
  data+='<div id="open-' + link + '" class="yvideo container-fluid"  data-id="' + link + '" onclick="openYoutube(this);">';
  data+='<div class="row">';
  data+='<div class="col">';
  data+='<div class="media-video-play-icon-container"><img class="media-video-play-icon" src="file:///assets/third-party/yplay.png"></div>';
  data+='</div>';
  data+='<div class="col">';
  data+='<div class="media-video-title">' + title + '</div>';
  data+='</div>';
 if(poster) {
   data+='<div class="col">';
   data+='<div class="media-video-poster-container"><img class="media-video-poster" src="' + poster + '"></div>';
  data+='</div>';
 }
  data+='</div></div></div>';
 var tcont='<div id="' + link+ '" data-link="' + link + '" class="yplayer-container"></div>';
if(!$("#" + link).length){
  $("body").append(tcont);
}
  return data;
}



