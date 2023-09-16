android.webView.setAllowExternalURLs(false);
var NOTEAJAX__;
var TOPICS={}
var TOTAL_TOPICS=0;

function upgraded(pid){
  return localStorage.getItem("pro_activated");
//  return localStorage.getItem( pid + "_pro_activated");
}

function reload(){   
  location.reload()
}

function paymentInfo(){
  var price=+localStorage.getItem( PAGE_ID__ + "_payment_amount");
  var dollar_rate=+(localStorage.getItem("dollar_rate")||0);
  
  var data='<div class="text-center">Unlock/Upgrade for just &#8358;' + price;
  if( dollar_rate ){
    var dol=(price/dollar_rate).toFixed(1);
    data+=' ($' + dol + ')';
  }
   data+='<br><br>';

if( PAYM_PublicKey ){
  data+='<button class="btn btn-sm btn-info" onclick="paymentPage();">Pay with card</button>';
}
 data+='<div><button class="mt-2 btn btn-sm btn-info" onclick="otherPaymentOptions();">Other payment options</button></div>';
 data+='<br></div>';
 showInfo("",data);
}

function paymentPage(){
 localStorage.setItem("payment_page_opened", "true" );
 localStorage.setItem("payment_amount", localStorage.getItem( PAGE_ID__ + "_payment_amount") );
 localStorage.setItem("selected_book_id", PAGE_ID__);
 localStorage.setItem("reload_payment", randomString(10) );
}

function otherPaymentOptions(retry){
 
  if(!retry){
 
  var data='<div class="center-div bg-white">';
      data+='<div class="center-text-div" style="padding: 30px 16px 0 16px;">';
      data+='<div id="other-payment-o" style="min-height: 150px;"><div class="text-center"><img class="w-100" src="file:///assets/loading-indicator/loading4.png"></div></div>';
      data+='</div></div>';
   displayData( data, { oszindex: 600, osclose: true, data_id:"other-payment-potions"});
  }
 var elem=$("#other-payment-o");
 
  $.ajax({
     url: other_payment_options_url,
    dataType:"html",
}).done(function(result){
     var data= __format( result  );   
 elem.html( data.replace(/\n/g,"<br>") );
     
 }).fail(function(e) {
    
 if(elem.length){
   setTimeout(function(){
      otherPaymentOptions(1)
    }, 5000);
  }
 });
 
}


function loader(){
  var temp_=localStorage.getItem("appTemplateSelected")||DEFAULT_TEMPLATE;
  var dir=new android.File( TEMPLATES_DIR, temp_);
  
var data='<div id="loading-image-container" class="loading-image-container">';
    data+='<img src="file:///assets/drawer-pages/loader.png">';
    data+='</div>';
  return data;
}

function openTopicsList(){
 $("#TOPICS--LIST--CONTAINER").removeClass("HIDE--TOPICS--LIST");
  displayData("", { on_close:"closeTopicsList", osclose: true, oszindex: 100, dummy: true, data_id: "dummy-topics-list" });
}


function closeTopicsList(){
  closeDisplayData("dummy-topics-list");
 $("#TOPICS--LIST--CONTAINER").addClass("HIDE--TOPICS--LIST");
 //$(".SUB--TOPICS--CONTAINER").css("display","none");
 $(".SUB--TOPICS--BTN").css("display","block");
}


function __t(){ 
 try{
 var file=new android.File( EXTERNAL_DIR, "contents/" +  PAGE_ID__ + "/" + PAGE_ID__ + ".json");
  if( file.isFile() ){ 
    return JSON.parse(file.read());
  }
}catch(e){}
  
  file=new android.AssetFile("notes/" + PAGE_ID__ + ".json"); 
  return JSON.parse(file.read() );
}



function listTopics(){
  TOPICS=__t();
if(TOPICS.length>200 ){
  TOPICS.length=200; 
}
 TOTAL_TOPICS= TOPICS.length;
  
  if(TOTAL_TOPICS.length<2) {
   $("#TOGGLE--TOPICS--LIST").remove();
    return;
  }
 var list_='';
 var pro_=upgraded( PAGE_ID__);
 var firstItem=TOPICS[0];
 var pro_range= firstItem.pro_items_range;
 var pro_price= firstItem.pro_price||1;
 var dollar_rate=firstItem.dollar_rate;
     
  localStorage.setItem( PAGE_ID__ + "_payment_amount", pro_price);
  localStorage.removeItem("dollar_rate");
  
 if( dollar_rate ){
  localStorage.setItem("dollar_rate", dollar_rate);
 }
   
   var min=9999;
   var max=99999;
  
  if( pro_range){
    min=+pro_range[0];
    max=+pro_range[1];
  }
  
  $.each( TOPICS, function(i,v){
     if( i==0 ) return true;
      var title=    v.title;
      var kwords=   v.keywords;
      var sub_topics= v.sub_topics;
      var icon= v.icon;
      var pro="";
      var free=v.free; 
    //Use v.free to negate an item between pro_range
    //so if (free), an item within pro_range will not require upgrade
      var page=i+1;
 
 if(!pro_ && !free && ( page>=min && page<=max) ){
     pro=1;
   }
        
  var curr=+localStorage.getItem( PAGE_ID__ + "_current_page")||2;
      list_+='<div class="t">';
    
      list_+='<div class="container-fluid hover-me TOPIC--LIST--BTN' + ( curr==page?" TOPIC--SELECTED":"") + '" id="TOPIC-' + page + '" data-pro="' + pro + '" data-sub-topic="" onclick="loadPage(event,' + page + ');">';
      list_+='<div class="row">';
      list_+='<div class="col w-60">';
     
  if(pro ){
    list_+='<img src="file:///assets/images/lock.png" class="PRO--INDICATOR">';
   }
   else{
    if( icon){
       list_+='<img class="TITLE--ICON EXTERNAL-ICON" src="' + icon + '">';
    }else {
      list_+='<img class="TITLE--ICON" src="file:///assets/images/button-icons/forward-grey.png">';
    }
   }
   list_+='</div>';
   list_+='<div class="col"><div class="TITLE">' + title +  '</div><div class="d-none">' + kwords + '</div></div>';
     
   if(sub_topics.length){
      list_+='<div class="col w-60 text-center SUB--TOPICS--TOGGLE--BTN" data-page="' + page + '"><img class="stt-btn" src="file:///assets/images/button-icons/sub-menu.png" style="width: 16px;"></div>';
   }
      list_+='</div>';
      list_+='</div>';
    
   if( sub_topics.length){
     list_+=subTopics( sub_topics, page, pro); 
   }
    list_+='</div>';

   });
  
  $("#TOPICS--LIST").html( list_ );
  $("#TOPICS--LIST--CONTAINER").scrollTop( +localStorage.getItem( PAGE_ID__ + "_topics-scroll-pos")||0 );  
}
  
  
  
function loadPage(event,page_, nav){
  if( NOTEAJAX__) NOTEAJAX__.abort();
  var this_=$(event.currentTarget);
  var target_=$(event.target);
 
  var page=page_||localStorage.getItem( PAGE_ID__ + "_current_page")||2;
      page=+page;
  
 if( nav===-1) {
   page=page-1;
 }
  else if ( nav===1){
   page=page+1;
  }
  
  
 if ( page<2 ){
    return toast("No more", {type: "info"});
  }else if( page > TOTAL_TOPICS){
    return toast("No more",{type:"info"});
  }
   
if( event && ( target_.hasClass("SUB--TOPICS--TOGGLE--BTN") || target_.hasClass("stt-btn") ) ){
 var sub_topic_cont=$("#SUB--TOPICS--CONTAINER--" + page);
 
 if( sub_topic_cont.is(":visible") ){
    sub_topic_cont.slideUp();
 }else{
    sub_topic_cont.slideDown();
 }
 return;
}
  
 var topicBtn=$("#TOPIC-" + page);
 
  if( topicBtn.attr("data-pro") && !upgraded( PAGE_ID__) ){
    return paymentInfo();
 }
  
  $(".TOPIC--LIST--BTN").removeClass("TOPIC--SELECTED");
    topicBtn.addClass("TOPIC--SELECTED");
  
  $(".refresh-btn-container").remove();
   
  var sub_topic=this_.data("sub-topic")||0;
  $(".SUB--TOPICS--BTN").removeClass("SUB--TOPIC--SELECTED");
 
 if( sub_topic ){ 
  this_.addClass("SUB--TOPIC--SELECTED");
 }
  
 var result= TOPICS[page-1];
 var url=result.path;

var save_folder=new android.File( EXTERNAL_DIR, "contents/" + PAGE_ID__ + "/external-notes");
  
 if( !save_folder.isDirectory() && !save_folder.mkdirs() ){
  return android.toast.show("Could not create folder: " + save_folder.toString() );
  }
  
var externalUrl= url.match(/\b(https:\/\/)/);
var ext_file=new android.File( save_folder, page + ".txt");
var localExists=false;

  $("#CURRENT--PAGE").val(page);
  
  $("#MAIN--NOTE--CONTAINER").append( loader());
  var ndiv=$("#NOTE--TEXTS");
  ndiv.addClass("NOTE--TEXTS--" + page).html("");
  
if( externalUrl && ext_file.isFile() ){
 localExists=true;
  noteLoaded( ext_file.read() , sub_topic, page );
  //toast("Updating...", {type:"info"});
}
 
var cache=false;
   
if( externalUrl){
     var path=url;
    cache=true;
}
   else{
var path_=result.path + "/" + (page-1 ) + ".html";
var path= "file:///assets/notes/notes/" + path_; 
  }
  
 var title= result.title;
 $("#TOOLBAR--TITLE").text( title);

if(page_ ) closeTopicsList();
  
  NOTEAJAX__=$.ajax({
     url: path,
    dataType: "text",
   // cache: cache,
}).done(function(note){
    
$(".loading-image-container").remove();
 
   if( externalUrl ){
   ext_file.write(note);
 }
 
noteLoaded(note, sub_topic, page ); 
 onYouTubeIframeAPIReady();
    
}).fail(function(e,txt,xhr){
   // alert( JSON.stringify(e))
    $(".loading-image-container").remove();
 localStorage.setItem( PAGE_ID__ + "_current_page" , page);
var refresh=$('<div class="element-center refresh-btn-container text-center"><small>Could not load. Refresh</small><br></div>')
     .append('<img style="width: 40px; height: 40px;" src="file:///assets/drawer-pages/refresh.png">')
     .click(function(){
    loadPage( event, page, 0);
});
    
 if(!localExists ){
   $("#MAIN--NOTE--CONTAINER").append(refresh);
   $("#SEARCH--FOUND").text(0);
 }
});
 
   settings_();
}


function noteLoaded(note, sub_topic, page){
  var data= __format( note  );   
 $(".NOTE--TEXTS--" + page).html( data.replace(/\n/g,"<br>") );
   mediaplayer_( $("audio"), "super" );   
    
  if( sub_topic){
     $(".sub-topic").css("display","none");
     $("#sub-topic-" + sub_topic).css("display","block");
  }
   else{
     localStorage.setItem(  PAGE_ID__ + "_current_page", page);
   }
    
  var dir=new android.File(EXTERNAL_DIR, "contents/" +  PAGE_ID__ + "/NOTES-METAS/" + page);
  var file=new android.File(dir, "scroll-pos.txt");

 if( file.isFile() ){
  var pos=+file.read()||0
  $("#NOTE--CONTAINER").animate({scrollTop: pos});
 }
 
  
  var tsearch=$.trim( $("#TOPICS--SEARCH--BOX").val())
  var text=$.trim($("#SEARCH--BOX").val())||tsearch;
  //var text=$.trim( $("#TOPIC--SEARCH--BOX").val())
  if( text.length ) {
  var elem=$("#NOTE--TEXTS");
    elem.unmark().mark(text);
  var found=elem.find("mark").length;
    $("#SEARCH--FOUND").text(found||"")
  // elem.scrollTo("mark:first", 3000);
 }
  
   
   $("#NOTE--TEXTS").unmark().mark(text); 
}


function nextPrev(nav){
 $("#TOPICS--SEARCH--BOX").val("");
 loadPage({},0,nav);
 }

function enlargePhoto(t, double){
 var this_=$(t);
  
  if( double){
  var size=+this_.attr("data-size")+50;
  if( size>250){
    return $(".ENLARGED--PHOTO").attr("data-size", "100").css({"width": "","max-width":"100vw","max-height":"100vh"});   
  }
  return $(".ENLARGED--PHOTO").attr("data-size", size).css({"width": size +"%","max-width":1200,"max-height":1200});   
  }
 
 var src=this_.attr("src");
 $("#ENLARGED--PHOTO--CHILD--CONT").html('<img onclick="enlargePhoto(this,1);" data-size="100" src="' + src + '" class="ENLARGED--PHOTO">');
 openCustomPage("ENLARGED--PHOTO--CONT");
}

function fetchPicture(path, width,height, q, onerror, callback ){
   q=q||1;
 var img = document.createElement("img");
     img.crossOrigin='anonymous';
     img.onload = function(){     
       var canvas = document.createElement("canvas");
       var ctx = canvas.getContext("2d");

       width =width ||img.width;
       height=height||img.height;
       
       canvas.width=width;
       canvas.height=height;
 
     ctx.drawImage(this,0,0,width, height);
     callback( canvas.toDataURL("image/jpeg", q) );
  };
      img.src = path;
   if(onerror){
     img.addEventListener("error",function(e){
     callback("","error", e);
     });
   }
}


function shareFile(t){
  var this_=$(t);
  
 var photo=$(".ENLARGED--PHOTO").attr("src");
  var temp=new android.File( EXTERNAL_DIR,"shared.jpg");
  this_.attr("src", "file:///assets/loading-indicator/loading2.png");
  
var share_src="file:///assets/images/share.png";
 
 if( photo.match(/file:\/\/\//) ){
  photo=photo.replace("file:///assets/",""); 
  var file=new android.AssetFile( photo );
if( file.copyTo(temp) ){
 this_.attr("src", share_src);
 android.control.execute("share_fileExt('" + temp.toString() + "');");  
  return
 }
 this_.attr("src", share_src);
 toast("Failed. Please retry");
}
  else{
   fetchPicture(photo, 0,0, 1, true, function(base64,err, err_details){  
if( err ){
  this_.attr("src", share_src);
 return toast( "Failed");
}

if( base64 && temp.writeBase64(base64.split(",")[1] ) ){
   android.control.execute("share_fileExt('" + temp.toString() + "');");  
 }else{
    toast("Failed. Please retry.");
   }
this_.attr("src", share_src);     
 });
  
}
  
  
}



function openSearchBox(){
  $(".search-box-container").fadeIn();  
}

function closeSearchBox(){
  $(".search-box-container").css("display","none");  
  $("#NOTE--TEXTS").unmark();
  $("#SEARCH--BOX").val("");
  $("#SEARCH--FOUND").text("")
     
}


function isMobile(){
  return $("#IS--MOBILE").is(":visible");
}


function settings_(){
  var fs=+localStorage.getItem("text-font-size")||14;
  var fw=localStorage.getItem("text-font-weight")||"Normal";
  var tc=localStorage.getItem("text-color")||"black";
  var bc=localStorage.getItem("background-color")||"white";
  var lg=localStorage.getItem("text-line-gap")||"1.6";

 $("#NOTE--CONTAINER").css({"font-size": fs,"font-weight":fw, color:tc});
  $("#NOTE--TEXTS").css({"line-height":lg});
 $("body,#TOPICS--LIST--CONTAINER").css({background:bc});
 $("#TOPICS--LIST--CONTAINER").css({color:tc});
}
  


var scrollTimer;
var searchTimer;

$(function(){

$("#NOTE--CONTAINER").on("scroll", function() {
 var nextPrevBtn=$("#NOTE--NAV--CONTAINER button")
  var page=$("#CURRENT--PAGE").val()||1;
  var dir=new android.File( EXTERNAL_DIR, "contents/" +  PAGE_ID__ +  "/NOTES-METAS/" + page);
  var pos=$("#NOTE--CONTAINER").scrollTop();
   clearTimeout( scrollTimer);
 scrollTimer=setTimeout(  function(){
 
 if( !dir.isDirectory() && !dir.mkdirs()){
     return;
   }
  var file=new android.File(dir, "scroll-pos.txt");
  file.write( pos);
  nextPrevBtn.animate({opacity:"0.6"},2000);   
}, 400);
  
  nextPrevBtn.css({opacity:1});
});
  
 
 $("#TOPICS--LIST--CONTAINER").on("scroll", function(){
   var pos=$(this).scrollTop();
  localStorage.setItem( PAGE_ID__ + "_topics-scroll-pos", pos);
 });
  
  
 $("body").on("input","#SEARCH--BOX", function(){   
   clearTimeout(searchTimer);
   var sf= $("#SEARCH--FOUND");
   var sl=$("#SEARCH--LOADER");
   
    sf.hide(); sl.show();
   searchTimer=setTimeout(function(){
   var text=$.trim( $("#SEARCH--BOX").val())
   $("#NOTE--TEXTS").unmark().mark(text);
   var found=$("#NOTE--TEXTS mark").length;
    sl.hide();
    sf.text(found||"");
    sf.show();
   },900);
 });
  
  
 $("body").on("input","#TOPICS--SEARCH--BOX", function() {
  // Retrieve the input field text and reset the count to zero
      var filter = $(this).val(),
        count = 0;
   // Loop through the comment list
      $("#TOPICS--LIST .TOPIC--LIST--BTN, .SUB--TOPICS--CONTAINER, .SUB--TOPICS--BTN").each(function() {
      // If the list item does not contain the text phrase fade it out
        if ($(this).text().search(new RegExp(filter, "i")) < 0) {
          $(this).hide();  // MY CHANGE
          // Show the list item if the phrase matches and increase the count by 1
        } else {
          $(this).show(); // MY CHANGE
          count++;
        }
      });
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

function fetchExternalContents( url ){
  fetchExternalAssets_( url, function(result,e,xhr,txt){
   if(result){
     var dir=new android.File( EXTERNAL_DIR, "contents/" + PAGE_ID__);
     if(!dir.isDirectory() && !dir.mkdirs()){
   return android.toast.show("Can't create direc- " + dir.toString() );    
     }
     
   var file=new android.File( dir, PAGE_ID__ + ".json");
   var fexists=file.isFile();
   if( file.write( result) ){
     if( !fexists) {
       location.reload();
     }
     else listTopics();
   }
 }else{
   //Ignore
 }
  
});   
}



function doOnOrientationChange() {
   function ori(){
     switch(window.orientation) {
      case 90:
         return 2;
        break;
      case -90:
        return 2;
        break;
      case 0:
        return 1;
        break;
      case 180:
        return 1
        break;
      default:
        break;
    }
   }
  
//var val_=ori();
  closeTopicsList();
  
}

window.addEventListener('orientationchange', doOnOrientationChange);

// Initial execution if needed
doOnOrientationChange();

window.addEventListener('onOrientationChanged',function(newConfig){

// Checks the orientation of the screen
   alert (newConfig.orientation)
});


function onBackPressed() {
  var total_op=customPageOpenedIds.length;

 var adCount=1; //localStorage.getItem('app_ad_count'); 
 
  if($(".so-options-container").is(":visible")){
 return $(".so-options-container").css("display","none");
  } 
 else  
 if( $('.display--data').length ){
  var elem=$('.display--data').last();
    var on_close=elem.data("on-close");
   if(!elem.hasClass('no-cancel') ){
   closeDisplayData( elem.data('id'), on_close );
 }
  return;
}
 else if( total_op){
     var last=customPageOpenedIds[total_op-1];
    closeCustomPage(null,last);
    return;
  }
   else if( $("#video-element-container").is(":visible") ){
   exitVideoFullScreen();
   return;
 }
  else if( $(".yplayer-container").is(":visible") ){
   var elem=$(".yplayer-container:visible");
   var pos=elem.attr("data-position");
   $(".yplayer-container").css("display","none").empty();
    pauseVideo(pos);
  return;
  }
   else if( $(".search-box-container:visible").length){
    closeSearchBox();
    return;
  }
  else if( $("#SPONSORED--POSTS").is(":visible") ){
   closeAdWindow();
 return;
  }
 
 var cp=+$("#CURRENT--PAGE").val();

if( cp>=3 ){
 return nextPrev(-1);
}
  
if( adCount){
  localStorage.removeItem('app_ad_count'); 
 if(confirm("Do you really want to quit?")) {  
   sessionStorage.clear();
   android.activity.finish();
  }
 }
  else{
  showExitAd();
  localStorage.setItem('app_ad_count','1');
 }
 
}

function showExitAd(){
  
}
