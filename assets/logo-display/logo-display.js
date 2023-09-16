var install_level=6;

$( function(){
  $(".app-label").text(APP_LABEL__);
 // $('#header').show();
 //  animateCSS('#header','slideInLeft slow');
  $("#author-name,#author-name-2").text( AUTHOR_NAME );
  
 if(!localStorage.getItem("install_status")){
   
setTimeout(function(){
  $("#author-name").fadeOut();
 $("#splash-image").fadeOut(function(){
 $("#splash-image-2-cont").css("display","block");
   animateCSS("#splash-image-2-cont","bounceInDown slow",function(){ 
   $("#powered,#author-name2,#app-label").fadeIn();
 
   });
 });
   
},3000);
  
 $("#load").show();
   
 var file=new android.File( EXTERNAL_DIR, "install-complete.txt");
 var re_install=false; //true;
  
if( file.isFile()){
    var success=+(file.read()||0);
 
 if( success===install_level){
    re_install=false; 
  }
}
 setTimeout(function(){
   
 if( re_install ){ 
   
  var data='<div class="center-div bg-white">';
      data+='<div class="center-text-div" style="padding: 30px 16px 0 16px;">';
      data+='Downloading resources...';
   data+='<div style="vertical-align: middle; margin-bottom: 30px;">';
   data+='<img style="width: 40px; margin-right: 50px;" src="file:///assets/loading-indicator/loading2.png">';
   data+='<span style="color: #d9534f;"><strong><span id="d-progress">0</span> / ' + install_level + '<strong></span>';
   data+='</div>';
   data+='</div></div>';
 displayData( data, { pos: 90, no_cancel: true, oszindex: 600, osclose:false, data_id:"load-resources"});
   
  fetchExternalAssets(true, wedding_cakes_json_url, "wedding-cakes", function(){

    /* fetchExternalAssets(true, birthday_cakes_json_url, "birthday-cakes", function(){
  fetchExternalAssets(true, womens_ankara_json_url, "womens-ankara", function(){
  fetchExternalAssets(true, mens_ankara_json_url, "mens-ankara", function(){
  fetchExternalAssets(true, tutorials_json_url, "tutorials", function(){
     fetchExternalAssets(true, contact_us_json_url, "contact-us")
  });     
    });  
  });  
 });
 */
    
});
   return;
   
} 
   android.activity.hideView("logo_display");
   android.control.execute("unlockDrawer()");   

 },9000);
}
  
else{
  
  setTimeout(function(){
    startOwnActivity("installActivity");
  android.activity.finish();
  },4000);
 
}
  
});


function fetchExternalAssets(firstTime, url, content, callback){
fetchExternalAssets_( url, function(result,e,xhr,txt){
   if(result){
     var dir=new android.File( EXTERNAL_DIR, "contents/" + content);
    
  if( !dir.isDirectory() && !dir.mkdirs() ){
    return android.toast.show("Can't create dir");  
  }

   var file=new android.File( dir, content + ".json");
   if( file.write( result) ){
 //  var wid = +android.webView.getId();
var curr_Id=+localStorage.getItem("drawerSelected")||0
    curr_Id=curr_Id+100;
   
     if(firstTime ){
   var cfile=new android.File( EXTERNAL_DIR, "install-complete.txt");
  
   var elem=$("#d-progress");
   var cnt=+elem.text();
    elem.text(cnt+1);
     //Reload drawer-pages/content.html
 if( cnt===( install_level-1) && cfile.write(install_level) ){
   
 android.activity.loadUrl("" + curr_Id, "javascript:reload()");  
  
 setTimeout( function(){
   android.activity.hideView("logo_display");
   android.control.execute("unlockDrawer()");   
  },4000);
   }
       
   if( callback) {
     callback();
   }
}else{
    android.activity.loadUrl("" + curr_Id,"javascript:listTopics()");
  }
 }
}else{
    if( firstTime){
      android.toast.showLong("Could not establish first time connection. " + txt);
    }
   
  }
});
  
}


