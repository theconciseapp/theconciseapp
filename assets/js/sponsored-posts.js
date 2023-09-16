var adAjax;
var adTimeout;
function sppreview(){
  
  if(!ENABLE_AD__ ) return;
 var file=new android.File( EXTERNAL_DIR, "sponsored-posts.json");
 
  if( file.isFile() ){
    $("#SPONSORED--POSTS--PREVIEW").html(format_sppreview( PAGE_ID__,  file.read() ) )
    .css("display","block");
  }

  $.ajax({
     url: sponsored_post_url,
    dataType: "text",
    type: "GET",
  }).done( function(result){     
  
 if( file.write( result ) ){     
   $("#SPONSORED--POSTS--PREVIEW").html(format_sppreview( PAGE_ID__, result) )
   .css("display","block");
}
    
 }).fail(function(e){
   setTimeout(function(){
     sppreview();
   },5000);
  });
}

function format_sppreview( page_id, data){
 try{
   var json=JSON.parse(data);
 } catch(e){ 
  return toast("Ad Data error"); 
  }
  
  var page_ad=json[page_id]||[];
  var gen_ad=json["all_pages"]||[];

 var AD__= gen_ad.concat(page_ad);
  
  var data="";
if( AD__.length ){
  
 $.each( AD__, function(i,v){
   var thumb=v.thumbnail;
   var cpath=v.content_path;
   var i_=i+1; 
   data+='<div id="ad-' + i_ + '" data-pos="' + i_ + '" class="d-inline-block ad-cont ad-preview-img-container" data-path="' + cpath + '" onclick="viewAd(' + i_ + ');">';
   data+='<img src="' + thumb + '" class="ad-preview-img">';
   data+='</div>'; 
     
   });
 }
    return data;
}


function viewAd( pos, nav){
  if(adAjax) adAjax.abort();
  clearTimeout(adTimeout);
  
 var cpageElem=$("#CURRENT--AD--PAGE");
 var cpage=pos||cpageElem.val()||1;
     cpage=+cpage;
  
 if(nav===-1){
  cpage=cpage-1;   
  }
  else if( nav===1 ){
  cpage=cpage+1; 
  }
  
 if( cpage<1 ){
   return toast("No more",{type:"info"});  
 }
  
  var this_= $("#ad-" + cpage);
 
 if(!this_.length){
    return toast("No more",{type:"info"}); 
 }
  else if( this_.hasClass("ad-selected") ){
    return;
  }
   $(".ad-cont").removeClass("ad-selected");
  this_.addClass("ad-selected");
  cpageElem.val(cpage);
  
  var path=this_.data("path");
  
  var spdiv=$("#SPONSORED--POSTS--DATA")
   spdiv.html('<div class="text-center"><img id="AD--LOADER--INDICATOR" src="file:///assets/loading-indicator/loading3.png"></div>');
  
  $("#SPONSORED--POSTS,#AD--CLOSE--BTN").css("display","block");
  
   adAjax=$.ajax({
     url: path,
    type: "GET",
    dataType: "text",
  }).done( function( result){

 var data= __format(result  );
   spdiv.html( data.replace(/\n/g,"<br>") );
     
 }).fail(function(e, txt, xhr){
     if( txt==="abort") return;
     //android.toast.show("Check your network");
   adTimeout=setTimeout(function(){
     if ($("#SPONSORED--POSTS").is(":visible")){
 viewAd( pos );
     }
   },5000);
 
});
  
}

function closeAdWindow(){
  clearTimeout(adTimeout);
  $("#SPONSORED--POSTS,#AD--CLOSE--BTN").css("display","none");
  $(".ad-cont").removeClass("ad-selected")
 if(adAjax) adAjax.abort();
}

$(function(){
  sppreview();
});