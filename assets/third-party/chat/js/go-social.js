var GO_UPLOAD_FILE_PATHS=[]; 
var GO_UPLOADED_FILE_PATHS=[];
var POST_FILES_EDIT={};

var commentAjax,fsuggestionsAjax=false,fsuggestionsTimeout=false;
var commentTimeout,lspTimeout,lspLoading,lspAjax;
var loadingPosts,loadingGoPages,tloadingGoPages,searchingPosts,loadingProfilePosts,loadingNotificationAjax,loadingNotificationsPosts;
var loadingFullPost=false;
var connCounts=0;
var WAIT_FOR_ME=false;
var composingTimeout=false;
var imgcache_=imgcache();
var postEditMeta;


var GO_FOLDER=PUBLIC_FOLDER + '/' + username + '/GO-SOCIAL';

localStorage.setItem('go_social_opened','true');
//This lStorage is removed at app launch. Check control menu.js

function loginRequired(){
  return localStorage.getItem("login_required");
  }

function loggedIn(){
  return localStorage.getItem("logged_in");
  }  


function storedPostLikes_(){
	var sl=localStorage.getItem("POSTS_SAVED_LIKES")||"";
var len=sl.length;
if( len> 3000){
	localStorage.removeItem("POSTS_SAVED_LIKES");
	sl=null;
}
	return sl?JSON.parse(sl):{}
}

var POSTS_SAVED_LIKES= storedPostLikes_();

function postLiked(pid){
	return POSTS_SAVED_LIKES[pid];
}
	
function storePostLike(lid, reaction){
 POSTS_SAVED_LIKES[lid]=reaction;
 localStorage.setItem("POSTS_SAVED_LIKES", JSON.stringify( POSTS_SAVED_LIKES));
}

function removePostLike( lid){
  delete POSTS_SAVED_LIKES[lid];
		localStorage.setItem("POSTS_SAVED_LIKES", JSON.stringify( POSTS_SAVED_LIKES) );
	}



function stackOrder(value_){
 var stacksDiv=$('#go-stack-order');
  if( value_){
   return stacksDiv.prepend( value_ + ',');
  }                          
  var stacks= stacksDiv.text()||"";
  var next="";
  if( stacks) {
    next=stacks.split(',')[0]||"";
    stacksDiv.text( stacks.replace(next + ",","") );
   return next;
  }
  else return "";
 }
 
  

function AE(time_){
  if( !go_config_.aet) return;
  time_=time_||moment().unix();
 var it=+localStorage.getItem('Aet');
  if(!it ){
   it= time_;
   localStorage.setItem('Aet', it ); 
  }
 var mejila= time_- 43200;
  if( it< mejila){
     android.control.execute("AE(1);");
  }
}


function openMessage(){
  $('#total-new-messages').attr('data-total',0).text(0).css('display','none');
  localStorage.removeItem(username + '_total_new_messages');
  localStorage.removeItem('go_social_opened');
  localStorage.setItem('message_opened','yes');
  toggleView("main");
 setTimeout(function(){
   toggleView('go_social','hide');
  },200);
  
}


if( MS__=='m'){
  openMessage();
  quitLoading(); //Non existent function
}

function zindex(){
  var zindex=$("#z-index");
  var zi=+zindex.val()||40;
  zindex.val( zi+10)
   return zi;
 }

function toggleLeftSidebar(){
	var sbar=$('.side-bar-container');
    var mcont=$('.main-content-container');

  if( mcont.hasClass("main-content-marginLeft")){
    return toggleRightSidebar();
  }
  
  var oWidth_=+sbar.attr("data-width");
  var oWidth=oWidth_||sbar.width();
  
  if( !oWidth_) {
   sbar.attr("data-width", oWidth);
 }
  
  if( !sbar.hasClass("hide-left-sidebar") ){
	 sbar.animate({
            width: 0
        }, 100,function(){
   sbar.css({"width": oWidth,"display":"none"});
   sbar.addClass("hide-left-sidebar");
   sbar.css("display","");
});
 $(".main-content-shadow").fadeOut(100);
  }else{
    sbar.removeClass("hide-left-sidebar").css({"width":0, "display":"inline-block"});
        
     sbar.animate({
        width: oWidth
     }, 100 );

     $(".main-content-shadow").fadeIn(200);
}
	}



function toggleRightSidebar(){
  var mcont=$('.main-content-container');
  var sbar=$('.right-side-bar-container');

 if( !$(".side-bar-container").hasClass("hide-left-sidebar") ){
   return toggleLeftSidebar();
 }
  
   var oWidth=sbar.width();
	if( !sbar.hasClass("hide-right-sidebar") ){
	//Close
      mcont.animate({
           marginLeft: 0
        }, 100, function(){
   mcont.removeClass("main-content-marginLeft");
   sbar.addClass("hide-right-sidebar");
   mcont.css("margin-left","");
});
      
 $(".main-content-shadow").fadeOut(100);
		
 }else{
   //Open
	sbar.removeClass("hide-right-sidebar");
    mcont.animate({
       marginLeft: -oWidth
   },100, function(){
     mcont.addClass("main-content-marginLeft");
     mcont.css("margin-left","");
    });
 $(".main-content-shadow").fadeIn(200);
  }
}


function go_user_icon( user ,class_, picture ){
  var rid="";
	if( user==username) rid=randomString(3);
  
  class_=class_||'friend-picture';
  var real_path=picture||config_.users_path + '/' + strtolower( user[0]+'/' + user[1] + '/' + user[2] + '/' + user ) + '/profile_picture_small.jpg?i=' + rid;
  var avatar='file:///android_asset/go-icons/avatar-grey.png';
  return '<img class="lazy ' + class_ + '" alt="" onerror="go_imgIconError(this);" src="' + avatar + '" data-src="' + real_path + '" data-id="' + strtolower(user ) + '">';
}

function go_user_photo( user, class_){
  class_=class_||'friend-picture';
  var real_path=config_.users_path + '/' + strtolower( user[0]+'/' + user[1] + '/' + user[2] + '/' + user ) + '/profile_picture_full.jpg?i=' + imgcache_;
  var avatar='file:///android_asset/go-icons/avatar-grey.png';
  return '<img class="lazy ' + class_ + '" alt="" onerror="go_imgIconError(this,\'' + user + '\');" src="' + avatar + '" data-src="' + real_path + '" data-id="' + strtolower(user ) + '">';
}


function go_user_mphoto( user, class_,avatar){
  //medium photo
  class_=class_||'friend-picture';
   avatar=avatar||"avatar.png";
  
  var real_path=config_.users_path + '/' + strtolower( user[0]+'/' + user[1] + '/' + user[2] + '/' + user ) + '/profile_picture_medium.jpg?i=' + imgcache_;
  var avatar_="file:///android_asset/go-icons/" + avatar;
  return '<img class="lazy ' + class_ + '" alt="" onerror="go_imgIconError(this,\'' + user + '\',\'' + avatar + '\');" src="' + avatar_ + '" data-src="' + real_path + '" data-id="' + strtolower(user ) + '">';
}


function go_imgIconError(image,user,avatar) {
	avatar=avatar||"avatar.png";
  var src="file:///android_asset/go-icons/" + avatar;
  image.src = src;
  image.onerror=null;
}


function go_postImgError(image, bg,cnt_) {
  bg=bg||'transparent2';
  cnt_=cnt_||3;
 if ( !image.hasOwnProperty('retryCount')){
      image.retryCount = 0;
  }
 var cnt=image.retryCount;
  if ( cnt < cnt_){ 
  image.src += '?' + +new Date;
  image.retryCount += 1;
  }else{
   image.onerror=null;
   return image.src ='file:///android_asset/go-icons/bg/' + bg + '.png';
  }
}


function go_imgError(image,bg) {
    image.onerror = null;
  setTimeout( function (){
     image.src += '?' + +new Date;
   }, 1000);
}


function goFetchPhoto(path, callback){
  var img = document.createElement('img');
     img.onload = function(){     
       var canvas = document.createElement('canvas');
       var ctx = canvas.getContext('2d');

       var width=img.width;
       var height=img.height;
       
       canvas.width=width;
       canvas.height=height;
 
     ctx.drawImage(this,0,0,width, height);
     callback( canvas.toDataURL('image/jpeg', 0.8) );
  };
      img.src = path;
     img.addEventListener('error', function(e){
      callback('','error'); 
      });
}
  
function go_videoPlayerLayout( data, fdload, poster,reposted, from_comm){
  
 var sourceUrl= data.path;
 var fsize= data.size;
 var width=  data.width;
 var height= data.height;

  var vid =randomString(10 );
 
  var dsourceUrl=sourceUrl; //Download source url
  
 //sourceUrl="http://www.jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v";  
  if( !LIVE__){
    sourceUrl=sourceUrl.replace("http://localhost:8080", externalDir + "/Icode-Go/data_files/www");
  }

  if(!width){
  var dim_=getParameterByName("ocwh", sourceUrl)||"";
  var dim=dim_.split("_");
  var width=+dim[0]||500;
  var height=+dim[1]||0;
  }
  
  var dW=$(window).width();
  var maxW=dW<500?dW:500;
  
 if( from_comm) maxW=200;
 
  if( height){
 var size=imageScale( width , height, maxW, 700);
  
  var imgheight= Math.ceil(size*height) + "px";
  var imgwidth= Math.ceil( size*width ) + "px";
  
}else{
  
    imgwidth= maxW + "px";
    imgheight="auto";

}
   var data='<div class="go-video-poster-container go-post-photo-container">';
     data+='<img class="go-video-poster go-post-photo lazy" style="height:' + imgheight + '; width: ' + imgwidth + ';" src="file:///android_asset/go-icons/white-bg.png" data-src="' + poster + '" onerror="go_postImgError(this,\'black\');">';
     data+='<img class="go-video-play-icon" data-vid="' + vid + '" src="file:///android_asset/chat-icons/play.png">';
     data+='<div onclick="goOpenVideo(this);" data-fdload="' + fdload + '" class="' + ( reposted? 'reposted':'go-open-video') + '" data-vid="' + vid + '" data-durl="' + dsourceUrl + '" data-fsize="' + fsize + '" data-source-url="' + sourceUrl + '" data-poster="' + poster + '"></div>';
     data+='</div>';
   
  return data;    
}

 

function go_photoLayout(data, fdload, reposted, from_comm){
 var file_path=data.path;
 var fsize=  data.size;
 var width=  data.width;
 var height= data.height;
  
if(!width){
  var dim=getParameterByName("ocwh", file_path)||"";
      dim=dim.split("_");
  var width=+dim[0]||500;
  var height=+dim[1]||0;
}
  
 
  var dW=$(window).width();
  var maxW=dW<500?dW:500;
  var maxH=700;
 if( from_comm ){
   maxW=200; 
   maxH=300;
 }
  
 if(height){
  var size=imageScale( width, height, maxW, maxH);
  var imgheight= Math.ceil(size*height) + "px";
  var imgwidth= Math.ceil( size*width ) + "px";
 }
  else{
    
    imgwidth= maxW + "px";
    imgheight="auto";
  }
  
  var data='<img class="lazy go-post-image go-post-photo ' + (reposted?'reposted':'') + '" style="height: ' + imgheight + '; width: ' + imgwidth + '" data-original-height="' + height + '" data-original-width="' + width + '" alt="" data-fsize="' + fsize + '" data-fdload="' + fdload + '"  src="file:///android_asset/go-icons/bg/post-white-bg.png" data-src="' + file_path + '" onerror="go_postImgError(this);">';  
  return '<div class="go-post-image-container go-post-photo-container">' + data + '</div>'; 

}


function go_formatFiles(data, fdload, reposted, full, from_comment ) {
 if(!data) return "";
  
  try{
    data=JSON.parse( data);
  }catch(e){
    return "";
  }
  var total=data.length;
  var file_result="";
  var cnt=0;
  
 $.each( data, function(i,data_){
     cnt++;
   var ext   = data_.ext;
   
 if ( !full && cnt > 4) {
   file_result+='<span class="go-more-photos">+ More</span>';
  return false;
 } 
   
   if( ext=='jpg'){
  file_result+= go_photoLayout( data_, fdload, reposted,from_comment);
 }else if ( ext=='mp4') {
  var poster=data_.poster;
  file_result+= go_videoPlayerLayout( data_, fdload, poster,reposted, from_comment );
    }
  });

  return file_result; 
  }


function goOpenGallery(t,type){
  //Type: image, video
  if(!hasPermission(rights) ){
  return requestPermission(rights);
 }
  
  var allow_vid=false;
   
 try{
  var settings= JSON.parse( localStorage.getItem("server_settings") );
 
 if( siteAdmin( username) || settings.enable_vid_doc=="YES"  ){
   allow_vid=true;
  } 
    
 }catch(e){ 
  return toast("Loading settings...", { type:"info"});
 }
    $('#go-upload-preview-container').empty();
   GO_UPLOAD_FILE_PATHS=[]; //Empty paths
   GO_UPLOADED_FILE_PATHS=[]; //Empty uploaded paths
  var this_=$(t);
      this_.prop('disabled',true);  
    try{
   var dir=new android.File( PUBLIC_FOLDER, 'go-TEMP-DIR');
    if( dir.isDirectory() ){
      dir.deleteFileOrFolder();
    }
  }catch(e){ return toast(e); }
  
    setTimeout(function(){
    this_.prop('disabled', false);
  }, 1500);

 var pformat= $('#selected-photo-format').val();
 
 var isVerified= userVerified( username);
 
  
  if( allow_vid ){
    var function_="goImportPostFiles();";
  }
  else{
    function_="goImportPostImages('" + pformat + "');";
   }
 
  //function_="goImportPostVideos();";  
    
    android.control.execute( function_);
   // android.control.dispatchEvent(event,null);
 }


function display_post(settings,  post, full, sponsored_post ){
   var result="";
  var adm=siteAdmin( username );
  
    $.each( post, function(i,v){ 
      var me=false;
  
      //POSTER INFO
     
   var post_title=v.post_title||"";
   var post_by=v.post_by;
   var email=v.email;
   var country=v.country;
   var bio=v.bio;
   var birth=v.birth;
   var joined=v.joined_on;
   var fullname=v.real_name;
   var phone=v.phone;
   var fstatus=v.follow_status||"";
   var post_files=v.post_files||"";
            
 // save_user_profile( post_by, fullname, email, phone, country,bio,birth, joined);
   
   var post_type=v.post_type;
   var ppic =v.poster_pic||"";
      
     var post_id=v.id;
     var highlight= ( v.post_preview||"").replace(/</g,'&lt;');
     var time_= timeSince( +v.post_date);
     var time= time_;
      
    var sponsored=false;
   
    if ( sponsored_post ){
    sponsored=true;
    time='Sponsored';
  
   if( adm ) time+=' &bull; ' + time_;
   
  }
      
     var meta= v.post_meta||'{""}';
   //  var total_likes= +(v.total_likes||0);
     var total_comments= +(v.total_comments||0);
     var total_shares= +( v.total_shares||0);
     var reactions=v.reactions||"{}";
     var reactions_={};
     
    try{
      reactions_= JSON.parse( reactions);
    }catch(e){}; 
      
  var veri=checkVerified( post_by, fullname);
  var verified=veri.icon;
  var fullname_= veri.name;
      fullname=fullname_ + ' ' + verified;
      
  var data=parseJson( meta );
  
  var true_author=data.true_author||"";
  var post_length=+data.plen;
  var can_comment=data.can_comment;
  var shareable= data.shareable;
  var commentable= data.commentable;
  var reposted= data.repost||"";
  var op_by= data.opost_owner||"";
  var optitle=data.optitle||"";
  var op_name_= data.opbf||op_by;
  var odeleted= data.odeleted||0;
      
  if( username==true_author ||
   ( goPage( username) && post_by==username)  ){
    me=true;
  }
      
  var op_name="";
  
   if( reposted){
 var op_v=checkVerified( op_by, op_name_);
     op_name= op_v.name + ' ' + op_v.icon;
    }
    
  var op_time= timeSince( data.opost_time);
  var op_id= data.opost_id||"";
  var op_preview= data.opost_preview||"";
   
  if( op_preview.length>100){
    op_preview=op_preview.substr(0,100) + '...';
   }
  var version= data.ver;
  var hasFile=data.has_files;
  var bsize=data.size||0;
  var size= hasFile?readableFileSize( +bsize, true, 0):'';
  var meta_="";
 // var post_files=data.post_files||"";     
  var plink=data.link;
  var plinkText=data.link_title;
  var fdload=data.fdload||"";
      
  var total_files=+(data.total_files||0)
  var post_bg_=data.post_bg||"";
  var opost_bg_=data.opost_bg||"";
  
   var opost_bg="";
   var post_bg="";
      
  if( post_bg_){
      post_bg=post_bg_ + ' go-pbg' + ( post_length<60?' go-pbg-font':'');
    }
      
  if( highlight.length > 200 ){
      highlight='<div data-pid="' + post_id + '" data-post-by="' + post_by + '" data-true-author="' + true_author + '" class="go-load-full-post">' + highlight.substring(0,200) + '<span class="go-post-more-link">...More</span></div>';
  }
      
  if(!full){
     highlight= '<div class="go-post-preview go-post-preview-' + post_id + ' ' + ( highlight?post_bg:'') + '">' + go_textFormatter( highlight) + '</div>';
   }
    else{
     highlight= '<div class="go-post-preview go-post-preview-' + post_id + ' ' + post_bg + ' ">' + go_textFormatter( v.post||"" ) + '</div>'; 
   }
   
var open_file=false;
   
 if( reposted||
      ( total_files > 4 && !full ) ){ 
     open_file=true;
 }
 
 var format="";
 var format_= go_formatFiles(post_files , fdload, open_file, full );

   if(!odeleted){ 
 format='<div class="go-post-files-container ' + ( total_files >1?'go-post-files-container-m go-multiple-images go-multiple-images-' + total_files:'') + '">' + format_ + '</div>';
 }
   var hide_author=settings.go_hide_author_name;
       
   var p='<div class="go-post-container go-post-container-' + post_id  + '">';
       p+='<div class="go-post-header">';
       p+='<div class="row">';
   
  if( sponsored || hide_author==="NO"){
       p+='<div class="col go-post-by-icon-col">';
       p+='<div class="go-post-by-icon-container">' + go_user_icon( post_by, 'go-post-author-icon go-post-author-icon-' + post_by, ppic) + '</div>';
       p+='</div>';
   }
      
       p+='<div class="col go-post-fullname-' + post_by + ( sponsored && !adm?' go-sponsored-profile':' go-open-profile') + '" data-hide-author="' + hide_author + '" data-user="' + post_by + '" data-user-fullname="' + fullname_ + '">';
   
   if( sponsored || hide_author==="NO" ){
        p+='<div><span class="go-post-fullname go-puser-fullname-' + post_by + '">' + fullname + '</span></div>';
    }
        
  if( sponsored ||  settings.go_hide_post_time==="NO"){
       p+='<div class="go-post-date">' + time  + ' &bull; <img class="icon-small" src="file:///android_asset/go-icons/world.png"></div>';
   } 
      p+='</div>';
       p+='<div class="col-2 p-0 text-center">';
       p+='<div class="go-post-options-btn" data-hide-author="' + hide_author + '" data-pid="' + post_id + '" data-post-by="' + post_by + '" data-true-author="' + true_author + '" data-post-type="' + post_type + '" data-pbf="' + fullname_ + '">';
      
     if( me ){
       p+='<img class="w-30" src="file:///android_asset/go-icons/3dots-green.png">';
      }else{
       p+='<img class="w-30" src="file:///android_asset/go-icons/3dots.png">'; 
      }
       p+='</div>';
       p+='</div></div></div>';
   
      p+='<div class="' + ( total_files > 4 && !reposted && !full?' go-open-single-post':'') + '" data-post-by="' + post_by + '" data-pid="' + post_id + '">';     
       
 if(  post_title && settings.enable_post_title=="YES" ){
  
 p+='<div class="go-post-title">' + post_title + '</div>';
	
 }     
      
      p+='<div class="go-post-highlight go-post-highlight-' + post_id + '">' + highlight + '</div>';
    
   if ( reposted ){
  
     if( opost_bg_ && op_preview ){
       opost_bg=opost_bg_ + ' go-pbg' + ( op_preview.length<60?' go-pbg-font':'');
     }
    
       p+='<div class="container go-opost-container go-open-single-post" data-odeleted="' + odeleted + '" data-post-by="' + op_by + '" data-cpid="' + post_id + '" data-pid="' + op_id + '">';
    
    if( !odeleted){
       p+='<div class="row">';
       p+='<div class="col go-opost-by-icon-col">';
       p+='<div class="go-opost-by-icon-container">' + go_user_icon( op_by, 'go-opost-by-icon') + '</div>';
       p+='</div><div class="col p-0">';
       p+='<div class="go-opost-fullname">' + op_name + '</div>';
       p+='<div class="go-opost-date">' + op_time  + ' &bull; <img class="icon-small" src="file:///android_asset/go-icons/world.png"></div>';
       p+='</div></div>';
    }  
     
  if( optitle) {
  p+='<div class="go-post-title">' + optitle + '</div>';
    }
     
       p+='<div id="go-opost-preview-' + op_id + '" class="go-opost-preview ' + opost_bg + '">' + bbCode( op_preview ) + '</div>';
     
     
   }
       p+='<div class="go-post go-post-' + post_id + '">' + ( format||"") + '</div>';
     
    p+='<div class="post-link-container" id="post-link-container-'+ post_id + '">';

   if( !odeleted && plink){
	plinkText=plinkText.split("...");
	
     p+='<div class="container-fluid go-nice-link-container">';
      p+='<div class="row"><div class="col"><a href="' + plink + '" class="go-nice-link" data-repost="' + reposted + '" target="blank_">' +  plinkText[0] + '<div class="form-text">' + ( plinkText[1]||"") + '</div></a></div>';
      p+='<div class="col-2 text-center go-nice-link-info" data-link="' + plink + '"><img class="mt-1 w-16 h-16" src="file:///android_asset/go-icons/info.png"></div></div></div>'; 

   
   }
       
   p+='</div>';
     
   if( reposted){
     
      p+='</div>';
     
     }
      p+='</div>';
      
    var total_r=0;
    var remoji='';
   
  $.each( reactions_, function(i, rcount){
       var rv=+rcount;
        total_r=total_r+ ( +rv);
     if( rv){
       remoji+='<img class="go-like-post-iconx-' + post_id + ' icon-normal w-18 h-18" src="file:///android_asset/chat-icons/reactions/' + i + '.png">';
     }
      });
 
  //var ldir=new android.File( PUBLIC_FOLDER, username +'/GO-POSTS-LIKES');
  var reacted=false;
   var liked="like-empty";
  
 /* if( ldir.isDirectory() ){
    var plfile=new android.File(ldir, post_id + '.txt');
   if( plfile.isFile() ){
     var reacted=true;
     liked=plfile.read()||"like-empty";
   }
 }
   */   
      
 var plike=postLiked( post_id);
 
 if( plike ){
     var reacted=true;
     liked=plike;
 }
      
  
  var allow_reactions=settings.go_allow_reactions;
      
  var licon='file:///android_asset/chat-icons/reactions/' + liked + '.png';
      
     var total_reactions= abbrNum(total_r, 1);
     var total_likes=+reactions_["like"]||0;
     
      p+='<div class="go-post-footer">';
      p+='<div class="reactions-box-container reactions-box-container-' + post_id + '"></div>';
  
  if(allow_reactions==="YES"){
     p+='<div style="padding: 5px 5px 10px 20px;" class="reacted-icons-container reacted-icons-container-' + post_id + '" data-reactions=\'' + reactions + '\'> ' + remoji + ' <span class="total-likes-' + post_id + '" data-total-reactions="' + total_r + '">' + (total_reactions ||"") + '</span></div>';
   }
      p+='<div class="row">';
      
    if( allow_reactions==="YES" && post_by!='cv_drafts' && fstatus!="0"){
        p+='<div class="col text-center"><button data-reactions=\'' + reactions + '\' data-post-by="' + post_by + '" data-pid="' + post_id + '" class="go-like-post-btn-' + post_id + ' go-like-post-btn' + ( reacted?' go-post-liked':'') + '"><img class="go-like-post-icon-' + post_id + ' icon-normal" src="' +licon + '"> <span class="total-likes-' + post_id + '" data-total-reactions="' + total_r + '">' + total_reactions + '</span></button></div>';
    }
      
   if( settings.go_allow_comment==="YES" && post_by!='cv_drafts' && fstatus!="0" && commentable){
      p+='<div class="col text-center"><button data-pid="' + post_id + '" data-post-by="' + post_by + '" class="go-open-comments-box"><img class="icon-normal" src="file:///android_asset/go-icons/comment.png"> <span id="total-comments-' + post_id + '">' + abbrNum(total_comments,1) + '</span></button></div>';
   }
      
   var can_post=settings.go_can_post;
   var can_share=settings.go_allow_share;
    
   if( ( can_post=="1" ||can_share!="YES" ) && !siteAdmin( username) ){
         can_post=false;
      }
      
   if(!odeleted && can_post && fstatus!="0" && shareable ){
    
      p+='<div class="col text-center"><button data-pid="' + post_id + '" data-share-pid="' +( reposted?op_id:post_id) + '" data-notify="' + post_by + '" data-cpid="' + post_id + '" data-pbn="' + fullname_ + '" data-spbn="' + op_name_ + '" class="go-share-post-btn">';
      p+='<img class="icon-normal" src="file:///android_asset/go-icons/share.png"> <span id="total-shares-' + post_id + '">' + abbrNum(total_shares, 1) + '</span></button>';
      p+='</div>';  
   
   }
       p+='</div>';
       p+='</div>';
      
       p+='</div>';
    result+=p; 
    });
   return result;

  }

function no_post(can_post){
  $('#gnp').remove();
var data='<div id="gnp" class="go-no-post">';
  
  if( ( can_post=="1" && goAdmin( username) )
     || ( can_post=="2" && userVerified( username) )
     || can_post=="3"){
    data+='<img onclick="goOpenGallery(this, \'image\');" src="file:///android_asset/go-icons/camera.png">';
  }
    data+='No posts yet!';
   data+='<div class="mt-2"><small>You may follow one or more suggested accounts and refresh</small></div>';
   data+='<div class="text-center mt-2 text-primary" onclick="home();">Refresh</div>';
    data+='</div>';
 return data;
}


var toast_once=false, lpFails=0;
var loadCount=0;
var lpostAjax,lpostTimeout;

function loadPosts(refresh ){
   clearTimeout( lpostTimeout);

  var pnElem=$('#go-next-page-number');
  var pageNum=pnElem.val();
   
    
 if( refresh ){
    toast_once=false;
    pageNum="";
    displayData('<div class="text-center" style="padding-top: 30px;"><img class="w-40 h-40" style="border:0; border-radius: 4px;" src="file:///android_asset/loading-indicator/loading5-bgwhite.png"></div>',
      { bground: 'rgba(0,0,0,0);', data_class:'.home_refresh', no_cancel: true});
  }
  
  
if( localStorage.getItem('is_fetching_messages') ){
    //If sponsored posts is loading
   setTimeout( function(){
     loadPosts( refresh);
   },2000);
  return;
  }
  
  
  if( !refresh && pageNum=="0"){
   if( !toast_once ){
     toast_once=true;
     toast('That is all for now.', {type: 'info'});
   }
    return;
   }
  loadingPosts=true;
  
  localStorage.setItem('go-social-posts-loading','1');
  
  var loader=$('#post-loading-indicator');
  loader.css('visibility','visible');
  
  connCounts++;
  
  
   WAIT_FOR_ME='load-posts';
  
 lpostTimeout=setTimeout(  function(){
   clearTimeout( lspTimeout); //Load Sponsored posts timeout

  lpostAjax=$.ajax({
    url: config_.domain + '/oc-ajax/go-social/posts.php',
    type:'POST',
   //timeout: 15000,
     dataType: "json",
    data: {
      "username": username,
      "page": pageNum,
      "load_count": loadCount,
      "version": config_.APP_VERSION,
      "token": __TOKEN__,
    }
  }).done(function(result){
  //alert( JSON.stringify(result));
    WAIT_FOR_ME=false;
    
   connCounts--;
   loadCount++;
   lpFails=0;
   
   loadingPosts=false;  
   localStorage.removeItem('go-social-posts-loading');
   
  if( result.ecode ){
 localStorage.setItem('login_required','YES');
 android.activity.showView('login');
  setTimeout( function(){
    android.activity.hideView('go-social');
  },200);
 return;
}else if( result.pymk ){
   pymk_( result.pymk.data);
}
 
 if( result.sidebar_pages){
	 sidebarPages( result.sidebar_pages);
  }  
    
 var settings=result.settings;
 var adm= siteAdmin( username); 
 var logged_in=loggedIn();
    
 localStorage.setItem("server_settings", JSON.stringify( settings) );
    
  if( !adm && settings.enable_chat!="YES"){
    $(".messenger-feature").remove();
   }

  if(  settings.go_enable_follow_btn!="YES"){
    $(".follow-feature").remove();
  }
    
  if( !adm && settings.enable_file_upload!="YES"){
    $(".file-upload-feature").remove();
  }
   
  var ept=settings.enable_post_title||"";
  if( ept=="YES"  ){
  	$("#go-create-post-title").removeClass("d-none");
  } 
   
 localStorage.setItem('sponsored_posts_path', settings.go_spp);
    
 AE( result.server_time);

   loader.css('visibility','hidden');
   
  if( refresh ){
     closeDisplayData('.home_refresh'); 
    }
    
  var can_post=result.can_post||1;

  if( logged_in && ( siteAdmin(username)
   || can_post=="3") ){
 
    $('#go-express-your-mind').css('display','block'); 
   
    }
     
 if( result.no_post){
   $('#go-the-posts').append( no_post(can_post) );
      pnElem.val("0");
   // toast( result.no_post,{type:'info'});
  } 
   else if( result.status=='success' ){
    
    var posts= result.result;
    var nextPage=result.next_page;
    pnElem.val( nextPage );

 if( refresh ){
   $('#go-the-posts').html( display_post( settings, posts) );            
 }else{
   $('#go-the-posts').append( display_post( settings, posts) ); 
 }
}
   else if(result.error){
      toast(result.error );
  }
  else toast('No more post to load.',{type:'info'});
  
   setTimeout( function(){
      $('#go-initializing-container').css('display','none');
    },2000);
    
   if( loadCount==1){  
 lspTimeout=setTimeout( function(){
   sponsoredPosts();
 }, 2000);
  } 
showAds( loadCount); 
    
 }).fail( function(e,txt,xhr){
   WAIT_FOR_ME=false;
    
   loadingPosts=false;
    connCounts--;
   localStorage.removeItem('go-social-posts-loading');
  //loader.css('display','none');
  if(!lpFails && xhr!='timeout') android.toast.show('Check our connection. ' + xhr);
 lpFails=1;
 if( refresh ){
  closeDisplayData('.home_refresh');
  return;
    }
    
    setTimeout(function(){
       loadPosts(); }, 10000);
  });
    
  },1000);
}
  
//SEARCH POSTS

var toast_s_once=false,spTimeout,spAjax;

function goOpenSearchBox(){
  $('#go-search-container').css('display','block');
 }
  

function searchPosts( fresh){
 
  var pnElem=$('#go-search-next-page-number');
  var searchDiv=$('#go-searched-posts');
  
  clearTimeout( spTimeout);
  
  if( spAjax){
    spAjax.abort();
  }
 
  
  if( localStorage.getItem('is_fetching_messages') ){
    //If sponsored posts is loading
    //android.toast.show('Searching...');
   spTimeout=setTimeout( function(){
     
    searchPosts( fresh);
   },2000);
  return;
 }
  
 if( fresh){
    toast_s_once=false;
    pnElem.val("");
    searchDiv.empty();
  }
  
  var pageNum=pnElem.val();
 
 // if( searchingPosts ) return;
  
  if( !fresh && pageNum=="0"){
   if( !toast_s_once){
     toast_s_once=true;
     toast('That is all for now.' ,{type: 'info'});
   } 
    return;
  }
    
  var s=$('#go-search-box');
  var text=$.trim( s.val());
  
  if ( !text ||text.length<3){
  return  toast('Search term too small.',{ type:'info'});
  }
    
  searchingPosts=true
var loader=$('#search-loading-indicator');
  loader.css('display','block');
  
  connCounts++;
 
 localStorage.setItem('go-social-posts-loading','1');
  WAIT_FOR_ME='search-post';
  
 spTimeout=setTimeout( function(){  
    spAjax=$.ajax({
    url: config_.domain + '/oc-ajax/go-social/search-post.php',
    type:'POST',
 //  timeout: 10000,
    dataType: "json",
    data: {
      "username": username,
      "s": text,
      "page": pageNum,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
   //alert(JSON.stringify(result))
      localStorage.removeItem('go-social-posts-loading');
     WAIT_FOR_ME=false;
      connCounts--;
      searchingPosts=false;
      loader.css('display','none');
  
  if( result.no_post ){
   return toast( result.no_post,{type:'info'});
  }
 else if( result.status=='success' ){
   var settings=result.settings;

   
   var nextPage=result.next_page;
   pnElem.val( nextPage);
 
     var posts= result.result;
    searchDiv.append( display_post( settings, posts) );            
  }
   else if(result.error){
      toast(result.error );
  }
   else toast('No more post.',{type:'info'});
      
 
 }).fail(function(e,txt,xhr){
     localStorage.removeItem('go-social-posts-loading');
     WAIT_FOR_ME=false;
     connCounts--;
     searchingPosts=false;
      
     loader.css('display','none');
  //toast('Connection error. ' + xhr, {type:'light',color:'#333'});
    if( $("#go-search-container").is(":visible")){
      spTimeout=setTimeout( function(){
     searchPosts(); },5000);
    }
  });
  },1000); 
  
  
}
 

function sanitizeLink(link, link_title){
 	var link_=new Object();
   link_.link="";
   link_.link_title="";
   
if( link &&  link.indexOf("https://")==0)  {
    link=link.replace(/\s+/g,' ').substr(0,200) .replace(/</g,'&lt;').replace(/"/g,'&quot;');
    link_title=( link_title||link).substr(0,100).replace(/</g,'&lt;').replace(/"/g,'&quot;');
    link_.link=link;
    link_.link_title=link_title;
    return link_;
  }
  else{
     return link_;
  }
 
 }


function sendPost( post_title, post, post_by, fullname, post_bg){
  var is_sending=localStorage.getItem('go_is_sending_post');
  
 if( is_sending ) return;
  localStorage.setItem('go_is_sending_post','TRUE')
 
  var commentable=""; 
  var shareable="";
  var fdload="";
 if( $('#go-post-commentable').is(':checked')){
    commentable="1";
 }  
  if( $('#go-post-shareable').is(':checked')){
    shareable="1";
 }
  if( $('#go-file-downloadable').is(':checked')){
    fdload="1";
 }
  
 var rd= $('#go-repost-data').val();
  if( rd.length ){
    return go_repost( post, post_by, fullname, commentable, shareable, post_bg);
  }
    
  var fpaths=GO_UPLOADED_FILE_PATHS;
   var fpaths_="";
   var post_files="";
   var total_files=fpaths.length;
   var hasFiles=0;
  
  if( total_files){
   post_files= JSON.stringify( fpaths)
   hasFiles=1;
  }
  
 var link=$.trim( $('#go-link-input').val() );
 var linkText=$.trim($('#go-link-title-input').val());
  
  if( link &&  link.indexOf("https://")==0)  {
    link=link.replace(/\s+/g,' ').substr(0,200) .replace(/</g,'&lt;').replace(/"/g,'&quot;');
    linkText=( linkText||link).substr(0,100).replace(/</g,'&lt;').replace(/"/g,'&quot;');
  }
  else{
     link=""; linkText="";
  }
  
  var post_title=$.trim( $("#post-title-box").val()||"");
  
  var post_preview=(post + "").substr(0, 250);
  var post_length=post.length;
  
  
  var meta=new Object();
      meta.pbf=fullname;
      meta.true_author= username;
      meta.plen=post_length;
      meta.shareable=shareable;
      meta.commentable=commentable;
      meta.total_files=total_files;
      meta.has_files=hasFiles;
      meta.post_bg=post_bg;
      meta.link=link;
      meta.link_title=linkText;
      meta.fdload=fdload;
  
 var meta_string=JSON.stringify( meta);
     
  setTimeout( function(){
    
  $.ajax({
    url: config_.domain + '/oc-ajax/go-social/insert-post.php',
    type:'POST',
  // timeout: 45000,
  // dataType: "json",
    data: {
      "username": username,
      "post_by": post_by,
      "fullname": fullname,
      "post_title": post_title,
      "post": post,
      "post_meta": meta_string,
      "post_files": post_files,
      "has_files": hasFiles,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
   //alert(JSON.stringify(result))
  localStorage.removeItem('go_is_sending_post');
   $('#go-send-post-btn').prop('disabled',false);
   
  if( result.status=='success'){
  $('#go-link-input,#go-link-title-input,#post-title-box').val("");
 
   var dfile=new android.File(PUBLIC_FOLDER,'draft.txt');
  
  try{
    dfile.delete();
  }catch(e){}

   var pid=result.id;
   var settings=result.settings;

   var data=build_post( pid, post_title, post, post_by, fullname, post_preview, post_files, meta_string.replace(/</g,'&lt;') );
    $('.go-no-post').remove();
    $('#go-the-posts').prepend( display_post( settings, data) );
   closeComposePage(true);
  toast( result.result,{type:'success'});
 }
  else if(result.error){
    toast( result.error );
  }
   else toast('Unknown error');
  closeDisplayData('.dummy-dummy');
  $('#post-progress').empty();
      
 }).fail(function(e, txt, xhr){
  closeDisplayData('.dummy-dummy');
  $('#post-progress').empty()
   localStorage.removeItem('go_is_sending_post');
 $('#go-send-post-btn').prop('disabled',false);
  android.toast.show("Something went wrong");
  report__('Error "sendPost() in go-social.js"', JSON.stringify(e),true );
 
  
  });
  },1000);
  
}


function go_repost( post, post_by, fullname, commentable, shareable, post_bg){

  var rd= $('#go-repost-data');
var pid=+rd.attr('data-pid');
var spid=+rd.attr('data-spid');
var notify=rd.attr('data-notify');
  
  if(!pid||!spid){
    closeComposePage(true);
   return toast('Id not found');
  }
 
  try{
  var settings= JSON.parse( localStorage.getItem("server_settings") );
  var adm= siteAdmin( username);
  
 }catch(e){ 
  return toast("Loading settings...", { type:"info"});
 }
 
var post_title=$.trim( $("#post-title-box").val());

  if( settings.enable_post_title=="YES"  ){
   
 if(!adm && !post_title ){
   	return toast("Input post title");
    }
   else if( post_title.length>150){
 return toast("Post title exceeded 150 characters");
    }
   }
  
 setTimeout(function(){
    $.ajax({
    url: config_.domain + '/oc-ajax/go-social/repost.php',
    type:'POST',
  // timeout: 20000,
     dataType: "json",
    data: {
      "username": username,
      "post_by": post_by,
      "fullname": fullname,
      "post_title": post_title,
      "post": post,
      "post_id": pid,
      "share_pid": spid,
      "notify": notify,
      "post_bg": post_bg,
      "commentable": commentable,
      "shareable": shareable,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
   //alert( JSON.stringify( result ) );
  $('#go-send-post-btn').prop('disabled',false);
  closeDisplayData('.dummy-dummy');
  $('#post-progress').empty();
 localStorage.removeItem('go_is_sending_post');
      
 if( result.status=='success' ){
   $("#post-title-box").val("");
   var dfile=new android.File(PUBLIC_FOLDER,'draft.txt');
   var settings=result.settings;

  try{
    dfile.delete();
  }catch(e){}

   closeComposePage(true);
   return android.toast.show('You reposted a post.');   
   
 }
    else if( result.error){
    toast( result.error);
  }else{
     toast('Unknown error occured.'); 
 }
  }).
    fail(function(e,txt,xhr){
   closeDisplayData('.dummy-dummy');
  $('#post-progress').empty()
   localStorage.removeItem('go_is_sending_post');
 $('#go-send-post-btn').prop('disabled',false);
  android.toast.show("Something went wrong");     
  report__('Error "go_repost() in go-social.js"', JSON.stringify(e),true );
 
    
    });
    },1000);
      
 }
  


 var ajaxSinglePost,spTimeout;

function fetchSinglePost( pid, cpid, pby, callback){
 // cpid- Current post id: if the post is a shared post, pid is,
  //the shared post id while cpid is the id of current post that shared it
  if( ajaxSinglePost) ajaxSinglePost.abort();
   if( spTimeout) clearTimeout( spTimeout);
 
 spTimeout=setTimeout( function(){
   
   ajaxSinglePost=$.ajax({
    url: config_.domain + '/oc-ajax/go-social/single-post.php',
    type:'POST',
  // timeout: 30000,
     dataType: "json",
    data: {
      "username": username,
      "post_id": pid,
      "cpost_id": (cpid||""),
      "post_by": pby,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
  return callback( result);
 }).fail(function(e,txt,xhr){
   callback(null, true, xhr);
   });
 },1000); 
  
  
}

var deleting_post=false;

function deletePost(pid, post_by, true_author){
 
 if(!pid||!post_by){
   return  toast('Missing parameters');
  }
 else if( deleting_post){
   return android.toast.show('Please wait');
 }

     deleting_post=true;
  delpTimeout=setTimeout( function(){
   
    delpAjax=$.ajax({
    url: config_.domain + '/oc-ajax/go-social/delete-post.php',
    type:'POST',
   timeout: 30000,
     dataType: "json",
    data: {
      "username": username,
      "post_by": post_by,
      "true_author": true_author,
      "post_id": pid,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
  // alert(JSON.stringify(result))
      deleting_post=false;
  if( result.status=='success'){
   $('.go-post-container-' + pid).remove();
 }
  else if(result.error){
      toast( result.error );
  }
   else toast('Unknown error'); 
 }).fail(function(e,txt,xhr){
      deleting_post=false;
 $('#go-send-post-btn').prop('disabled',false);
  android.toast.show("Something went wrong");     
  report__('Error "deletePost()" in go-social.js', JSON.stringify(e),true );
 
    
    });
  },1000); 
  
  
}
 

function build_post(pid, post_title,  post, post_by, fullname,  post_preview, post_files, meta){
  var arr=[];
  var obj=new Object();
   obj.id=pid;
   obj.post_title=post_title||"";
   obj.post=post;
   obj.reactions='{"like":0,"love":0,"laugh":0,"wow":0, "sad":0,"angry":0}';
   obj.post_preview=post_preview;
   obj.post_by=post_by;
   obj.real_name= fullname;
   obj.post_date=moment().unix();
   obj.post_files=post_files;
   obj.post_meta=meta||"";
   
   
  arr.push(obj );
   return arr;
 }

function buildPostOptions( options){
 var data="";
  $.each(options, function(i,v){
 if( !v.display){ }
    else{
  data+='<div id="' + v.id + '" data-pid="' + v.pid + '" data-true-author="' + v.true_author + '" data-post-by="' + v.post_by+ '" data-pbf="' + v.pbf + '" class="container-fluid" style="font-weight: normal; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.16);">';
  data+='<div class="row">';
  data+='<div class="col h-50" style="max-width: 50px; text-align: center;">';
  data+='<img class="icon-medium" src="file:///android_asset/go-icons/' + v.icon + '">';
  data+='</div>';
  data+='<div class="col h-50">' + v.info + '</div>';
  data+='</div></div>';
 }
    });
return data;    
}


function home(){
    loadPosts(true);
}


function closeTopPageList(){
  clearTimeout( tloadingGoPages);
  if( loadingGoPages){
    loadingGoPages.abort();
  }
}


function openPages( reload){
  
  var pdir=new android.File(PUBLIC_FOLDER, username +'/SOCIAL/PAGES');
   if(!pdir.isDirectory() && !pdir.mkdirs() ){
    return toast("Could not create pages dir");
  }
  
function openPages_( result){
  var div='';
 
  $.each( result,  function(i, v){   
    var u=v.username;
    var n=v.fullname;
    
   var cv=checkVerified(u, n);
   var n_= cv.name + " " +  cv.icon;
 
  div+='<div class="container-fluid mt-1">';
  div+='<div class="row">';
  div+='<div class="col" style="padding-left:0; max-width: 60px;">';
  div+= go_user_icon( u, 'go-followers-user-icon');     
  div+='</div>';
  div+='<div class="col" style="padding-left: 0;">';
  div+='<div class="go-pages-lists-item go-open-profile" data-user="' + u + '" data-user-fullname="' + n + '">';
  div+= n_ ;
  div+='</div>';
  div+='</div>';
  div+='</div>';
  div+='</div>';
 
 });
  
return div;
   } 
  
  var data='<div class="center-header">';
      data+='<div class="container-fluid">';
      data+='<div class="row">';
      data+='<div class="col p-0">';
    
  if( goAdmin( username) ){
      data+='<div class="mt-2" style="font-weight: normal; padding-left: 16px; font-family:gidole;">Pages <button id="go-create-page" class="btn btn-sm btn-success" onclick="goOpenCreatePageForm();">+</button></div>';
    }else{
     data+='<div class="mt-2 pl-3">Pages</div>';
    }
  data+='</div>';
  
  data+='<div class="col p-0 text-right">';
  data+='<img id="fetching-page-indicator" class="mt-2 mr-3 w-30 h-30" src="file:///android_asset/loading-indicator/loading2.png">';
  data+='</div>' 
  data+='</div>';
  data+='</div>';
  data+='</div>';
  
      data+='<div class="center_text_div text-left bg-white text-dark" style="border-radius: 5px; width: 100%; font-size: 14px; font-weight: bold; padding: 0 15px 0 15px;">';
      data+='<div id="go-top-pages-lists" class="text-left" style="padding-bottom: 50px;">';
      data+='</div>';
      data+='</div>';
  
 if( !reload) {
   displayData( data,
      { osclose: true, oszindex: 20, data_class:'.top-pages-lists', on_close:'closeTopPageList'});
 }
  
 var elem=$('#go-top-pages-lists');
  
  var pfile=new android.File(pdir, "pages.txt");
 
  try{
   if(pfile.isFile()){
     var pages=JSON.parse( pfile.read())
     var saved_pages=openPages_(pages);
     elem.html(saved_pages);
   }
  }catch(e){}
  
    var ind=$("#fetching-page-indicator");
  
 fetchPages( function(res,error){
   // alert( JSON.stringify(res))
   ind.remove();
  if( error){
    if ( res=='timeout' && $('.top-pages-lists').length){
       openPages( true);
  }else{
     if( res!='abort') android.toast.show('Check your network. ' + res);
    closeDisplayData('.top-pages-lists');
 }
  }else{   
  if( res.no_pages ){
    elem.html('<div class="text-center">No pages yet</div>');
    
 }else if( res.status=='success'){
   var result_=res.result;
   var settings=res.settings;

  var div=openPages_(result_)
      elem.html(div);
 
   try{
     pfile.write( JSON.stringify( result_))
   }catch(e){}
   
    } else if( result.error){
  toast( result.error );
 } 
  else{
   toast('Unknown error')       
    } 
    
   }    
  }, "ignore_static_page");
}


function goOpenCreatePageForm(){
  closeDisplayData('.top-pages-lists');
  $('#go-create-page-form-container').css('display','block');
}


function fetchPages( callback, ignore_static){
  ignore_static=ignore_static||"";
  tloadingGoPages=setTimeout(function(){    
 
  loadingGoPages = $.ajax({
    url: config_.domain + '/oc-ajax/go-social/load-pages.php',   
   type:'POST',
  // timeout: 30000,
    dataType: "json",
    data: {
      "ignore_static_page": ignore_static,
      "username": username,
      "version": config_.APP_VERSION,
      "token": __TOKEN__,
    }
  }).done(function( result){
   if( typeof callback=='function') {
     callback( result);
   }
  }).fail(function(e,txt,xhr){
 
 if( typeof callback=='function') {
   callback( xhr, e);
 }
 
 // android.toast.show("Something went wrong");     
  report__('Error "fetchPages()" in go-social.js', JSON.stringify(e),true );
});
 
  },1000);
}
  
  

function loadMenus(){
  $('.app-label').html(APPLABEL);

 $.ajax({
    url: 'file:///android_asset/go-menu-items.html',
  }).done(function(result){
     $('#go-right-menu-container').html(result);
  loadOthers();

if( goAdmin(username) ){
   $('#admin-panel-btn,#go-open-drafts-btn,#selected-photo-format').css('display','block');
 }
 });
  
  
}


function loadOthers(){
  var fullname=userData('fullname');
  var v=checkVerified( username, fullname );
  var verified=v.icon;
  var fullname_= v.name + " " + verified;
  
  var Veri= verified; //userVerified( username);
 var can_uv=go_config_.upload_video;
 var can_up=go_config_.upload_photo;
  
 
 if(!can_uv && !can_up && !Veri){
  $('.go-upload-post-media-btn').css('display','none');
 }
  else if( !can_uv && !Veri){
  $('#go-up-vtext').css('display','none');
}
else if( !can_up && !Veri){
  $('#go-up-ptext').css('display','none');
}
    
  $('.go-user-fullname').html( fullname_ );  
  $('.go-user-icon-container').html( go_user_icon( username,'my-photo-icon') ); 
  $('.go-user-open-profile').attr('data-user', username)
  .attr('data-user-fullname', fullname)

  var tnn= localStorage.getItem(username + '_total_new_notifications');
  if( tnn){
    tnn=tnn.split('/');
  $('#total-new-notifications').attr('data-total', tnn[0]).text( tnn[1] ).css('display','inline-block');
  }
 var tnm= localStorage.getItem(username + '_total_new_messages');
  if( tnm){
    tnm=tnm.split('/');
  $('#total-new-messages').attr('data-total', tnm[0]).text( tnm[1] ).css('display','inline-block');
  }
  
 
 setTimeout(  function(){
  fetchNotifications();
 } , 20000);
  
 //  custom_pymk(); //DEFAULT PEOPLE YOU MAY KNOW
  
}

  function format_pymk(data, custom){
    custom=custom||"";
    
   var result='<div class="go-people-you-may-know bg-white">';
        result+='<div class="go-pymk-title follow-feature">Follow</div>';
    result+='<div class="go-pymk-container">';
  var pymk_cnt=0;
    
    $.each( data, function(i,v){
    var user=v.username;
    var fullname=v.fullname;
 if( user!=username ){
    pymk_cnt++;
   var v=checkVerified( user, fullname);
   result+='<div class="go-pymk go-pymk-' + user + '">';
   result+='<div class="go-pymk-name-container">';
   result+= fullname;
   result+='</div>';
   result+='<div class="go-pymk-vicon-container">' + v.icon + '</div>';
   result+='<div class="go-pymk-photo-container go-open-profile" data-user="' + user + '" data-user-fullname="' + fullname + '">';
   
 result+=go_user_mphoto(user, "go-pymk-image","pymk2.png");
  
   result+='</div>';
   result+='<div class="go-pymk-follow-btn-container follow-feature">';
   result+='<button class="go-follow-btn go-sugg-follow-btn ' + custom + '" data-pin="' + user +'">Follow</button>';
   result+='</div>';
   result+='</div>';
   
 }
  });
  
  result+='</div>';
  result+='</div>';
    if( pymk_cnt<1 ){
   return "";
    }else
 return result;
  }


function custom_pymk(){
  var x= localStorage.getItem(username + '_custom_pymk');
  if( x) return;
  var data=[
    {"username":"pv_gosports","fullname":"Go Sports"},
    {"username":"pv_golaughs","fullname":"Go Laughs"},
    {"username":"pv_golove","fullname":"Go Love"},
    {"username":"pv_goentertain","fullname":"Go Entertainment"}
    ]
  var result=format_pymk( data, 'custom');
  $('#go-pymk-container').html( result);
}
  
function pymk_( data){
  if( !data ) return;
 var result=format_pymk( data);
 $('#go-pymk-container').html( result);
  
}



function pymk(){
  //Stop if at least one custom pymk is not followed
    if(!localStorage.getItem(username + '_custom_pymk') ) return;
  
  if( loadingPosts ){
   setTimeout(function(){
     pymk();
   },2000);
    return;
  }
  setTimeout(function(){
    $.ajax({
    url: config_.domain + '/oc-ajax/go-social/people-you-may-know.php',
    type:'POST',
   timeout: 10000,
     dataType: "json",
    data: {
      "username": username,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
    // alert( JSON.stringify( result))
      
      if( result.total>0){
      pymk_( result.data);
      }
    }).fail(function(e,txt,xhr){
      //alert( JSON.stringify(e));
 //android.toast.show("Something went wrong");     
  report__('Error "pymk()" in go-social.js', JSON.stringify(e),true );
 
    });
    
  },2000);
  
}

function openRightMenu(){
  $('#go-rmenus-container').removeClass('hide-rmenus');
}


$(function(){
 /*LOAD MENUS*/
  loadMenus()
  loadPosts();
 // pymk();
  
  /*OPEN MENU*/
  
  $('body').on('click','.go-show-follow-form-btn',function(){
  $('#go-follow-container').fadeIn();
               
   });
  
  $("#go-the-posts").on("click",".ext-social-button", function(){
  	var this_=$(this);
   var site=this_.data("site");
   var account=this_.data("account");
 
if( site.match(/whatsapp/i)){
  var href="https://wa.me/" + account;
  }
  else  if( site.match(/telegram/i)){
  var href="https://t.me/" + account;
  }
  else  if( site.match(/tiktok/i)){
  var href="https://tiktok.com/@" + account;
  }
  else  if( site.match(/youtube/i)){
  var href="https://youtube.com/@" + account;
  }
  
  else{
 var href="https://" + site + ".com/" + account;
 }
   var data='<div class="center-header pt-2 ps-3"><small><img class="w-16 h-16" src="file:///android_asset/go-icons/info.png"> Social link</small></div><div class="pt-1 pb-3 ps-3 pe-3 center-text-div">';
  data+='<i class="fa fa-2x text-secondary fa-'+ site + '"></i> <a href="' + href + '" style="font-size: 13px; font-weight: bold;" target="_blank">  ' + href + '</a>';
  data+='</div>';
  
   displayData(data, { width: '80%', max_width:'500px',data_class: '.preview-link-div', osclose:true});
  });
 
  
/*
const ptr = PullToRefresh.init({
  mainElement: '#go-posts-column',
  onRefresh() {
    android.toast.show('fine')
  },
  shouldPullToRefresh(){
  var t=$('#go-posts-column').scrollTop();
    return !t;
}
});
*/
  
 $('#go-posts-column').on('scroll', function() {
   var scr=$(this).scrollTop() + $(this).innerHeight();
  if( !loadingPosts && scr >=  $(this)[0].scrollHeight-500) {
    loadingPosts=true;
    loadPosts();
    }
 });
  
  //SCROLL SEARCH PAGE
  $('#go-search-content').on('scroll', function() {
   var scr=$(this).scrollTop() + $(this).innerHeight();
   if( !searchingPosts && scr >=  $(this)[0].scrollHeight - 500) {
   searchingPosts=true;
     searchPosts();
   }
  });
  
 //SCROLL FOLLOWERS PAGE
 $('#go-followers-container .u-content').on('scroll', function() {
   var scr=$(this).scrollTop() +
 $(this).innerHeight();
   if( !loadingFollowers && scr >=  $(this)[0].scrollHeight-500) {
     loadingFollowers=true;
     loadFollowers();
    }
  }); 
  
   //SCROLL FOLLOWING PAGE
$('#go-following-container .u-content').on('scroll', function() {
   var scr=$(this).scrollTop() + $(this).innerHeight();
   if( !loadingFollowing && scr >=  $(this)[0].scrollHeight-500) {
     loadingFollowing=true;
     loadFollowing();
    }
  }); 
  
   //SCROLL BLOCKED FOLLOWERS PAGE
 $('#go-blocked-followers-container .u-content').on('scroll', function() {
   var scr=$(this).scrollTop() +
 $(this).innerHeight();
   if(!loadingBFollowers && scr >=  $(this)[0].scrollHeight-500) {
    loadingBFollowers=true;
     loadBlockedFollowers();
    }
  });
  
  
  //GO NICE LINK
 
  
  
$('body').on('click','.go-nice-link',function(e){
 
 var this_=$(this);  
 var link=this_.attr('href');
 var repost=this_.data("repost");
 
  if(!link){
    toast("Invalid link");
    return false;
  }
  else if( repost || link.indexOf("https://")<0){
 	return false;
 }
  
});
  
  
$('body').on('click press', '.go-nice-link-info', function(e) {
    var href=$(this).attr("data-link");
   var reg=new RegExp(DOMAIN_,"i");
  var  etype=e.type;
  if(etype=="press"){
 
   android.clipboard.setText(href.replace(/"/g,"") );
    toast("Link copied", {type: "primary"}); 
  
  }else{
   var data='<div class="center-header p-2 pl-3"><small>' + ( href.match(reg)?'':'<img class="w-16 h-16" src="file:///android_asset/go-icons/info.png"> External link') + '</small></div>';
    data+='<div class="pt-1 pb-3 pl-3 pr-3 center-text-div">';
  data+='<div style="font-size: 19px; font-weight: bold;">' + href + '</div>';
  data+='</div>';
  
   displayData(data, { width: '80%', max_width:'500px',data_class: '.preview-link-div', osclose:true});
  
   }
   return false;
});  
  
  
 
  
 //COPY POST CODES 
  
  
$('body').on('click','code',function(e){
 var this_=$(this);
  var target_=$(e.target);
  if(  target_.is("span")
     ||target_.is("a") ) {
    return;
  }
  
  var text_=( this_.html()||"").replace(/<br>/g,"\n");
  var code_=$("<div></div>").html(text_).text()||"";
    if(!code_) {
      return android.toast.show('Nothing to copy');
    }
    android.clipboard.setText( $.trim( code_) );
    toast('Copied', {type:'success'});
  });
  
 $('body').on('input','#compose-post-box',function(){ 
  clearTimeout(composingTimeout);
   var this_=$(this);
   var txt=$.trim( this_.val() );
   var plen=txt.length;
 
 if( plen>100 ) {
   this_.removeClass('go-pbg-1 go-pbg-2 go-pbg-3 go-pbg-4 go-pbg-5 go-pbg-6 go-pbg-7 go-pbg-8 go-pbg-9 go-pbg-10');
   this_.attr("data-bg","");
  $('#go-post-bg-container').css('visibility','hidden');
  }
 else{
   $('#go-post-bg-container').css('visibility','visible');
    } 
   
 composingTimeout= setTimeout( function(){
   var dfile=new android.File( PUBLIC_FOLDER, 'draft.txt'); 
  try{
    dfile.write(txt);
  }catch(e){}

   },1500);
 }); 
  
  
  //SEND POSTS
  
$('body').on('click','#go-send-post-btn',function(){
  var box=$('#compose-post-box');
  var post=$.trim( box.val()||"");
  var plen=( post.length+1)/1024;
  var mpl=go_config_.mpl;
  if( plen> mpl){
   return android.toast.show('Maximum post length exceeded (' + mpl + 'Kb)'); 
  }
  var post_bg=box.attr('data-bg'); //Post background
  var this_=  $(this);
     
 var post_by=username;
 var fullname=userData('fullname');
  
  if( goAdmin( username) ){
  post_by=$.trim( $('#go-post-by-pages').val())
  fullname=$("#go-post-by-pages option:selected").text();
  } 
 
 if(!post_by ){      
  return toast('Select page');
  } 
  
  try{
  var settings= JSON.parse( localStorage.getItem("server_settings") );
  var adm= siteAdmin( username);
  
 }catch(e){ 
  return toast("Loading settings...", { type:"info"});
 }
 
var post_title=$.trim( $("#post-title-box").val()||"");
  
 if( settings.enable_post_title=="YES"  ){
  
  if(!adm && !post_title ){
   	return toast("Input post title");
    }
else
  if( post_title.length>150){
 return toast("Post title exceeded 150 characters");
    }
   }
  
function progress(){
  if( !$('.dummy-dummy').length){
  setTimeout(function(){
  displayData("",{ dummy: true, data_class:'.dummy-dummy',osclose: false,no_cancel:true});
  $('#post-progress').html('<div id="post-progress-slider"></div>');
   },500);
  } 
 }
  
 if( GO_UPLOAD_FILE_PATHS.length>0 ){
   progress();
    this_.prop('disabled',true);  
  return goUploadFiles();
  }
  
  var rp=$('#go-repost-data').val();
   
 if( GO_UPLOADED_FILE_PATHS.length<1 && !post && !rp.length){
     closeDisplayData('.dummy-dummy');
   return toast('Nothing to send');
 }
   this_.prop('disabled',true);  
  progress();
  alert(post_title)
    sendPost( post_title, post, post_by, fullname, post_bg);
 });
   
  
  
  //OPEN SINGLE POST

$('body').on('click','.go-open-single-post',function(){
 var this_= $(this);
  
  if( this_.data("odeleted")){
    return android.toast.show("This content is not available");
  }
  var cpid=this_.data("cpid"); //Current post id,
  //- if the post is shared post, pid is id of the shared post while,
  //cpid is the id of the  post  that shared

  var pid= this_.data('pid');
  var pby= this_.data('post-by');
  
 this_.prop('disabled', true);
  
  var loader=$('#single-post-loading-indicator');
  loader.css('display','block');
 var cont=$('#go-single-post');
  cont.empty();
  var zi=zindex();
  $('#go-single-post-container').css({'display':'block', 'z-index': zi}); //z-index previous: 42
  
 fetchSinglePost( pid, cpid, pby, function( result,error,xhr){
   this_.prop('disabled', false );
   loader.css('display','none');
  // alert( JSON.stringify(result));
 if( error){
   cont.html('<div class="text-center"><button class="btn btn-small btn-secondary go-open-single-post" data-pid="' + pid + '" data-post-by="' + pby + '">Reload</button></div>');
  if( xhr!='timeout' && xhr!='abort') android.toast.show('Check your connection. ' + xhr);
  return;
 }else if( result.status=='success'){
   var settings=result.settings;

    var mf=result.me_following;
  
if( mf=="0"){     
 return  cont.html('<div class="text-center">Post is unavailable</div>');
 }
    cont.html( display_post(settings,result.post, 'full') );
 }
  else if(result.error){
   var err_msg= result.error_message
   if( err_msg ){
      cont.html('<div class="container"><div class="alert alert-warning text-center">' + go_textFormatter( err_msg ) + '</div></div>' );
    }else toast( result.error );
  }
   else toast('Unknown error'); 
  });
  
});
  
   //POST PHOTO FULL
  
 $('body').on('click','.go-post-image',function(){
 var this_=$(this);
   if( this_.hasClass('reposted') ) {
   //This let original post to load first before any image is viewable
     return;
   }
   
  var allow_download=false;
  
  try{
    var settings= JSON.parse( localStorage.getItem("server_settings") );
 if( siteAdmin( username) || settings.go_enable_download=="YES"){
      allow_download=true;
  }
  
 }catch(e){} 
   
   var parent=this_.parents(':eq(1)');
   var photos=parent.find('.go-post-image');
  var total= photos.length;
   
 // var sicont=$('#go-save-img-btn-cont');
 //  sicont.empty();
   var saveable= this_.attr('data-fdload');
  
  function savePhotoBtn(saveable, src, fsize, allow_dl){    
    if( saveable!='1' || !allow_dl) return "";
  return '<button class="d-block btn btn-sm btn-primary" style="margin: 3px auto; border-radius: 20px;" data-src="' + src + '" data-fsize="' + fsize + '"  onclick="go_save_post_picture(this);">' + readableFileSize( fsize, true, 0) + ' Save</button>';
  }
   
   var height=this_.attr("height");
   var width=this_.attr("width");
   var fsize= this_.data("fsize");
   
  var img= this_.attr('src');
  var imgCont=$('#go-full-photo-div');
  var photo='<img onerror="go_postImgError(this);" class="lazy go-full-photo" height="' + height + '" src="file:///android_asset/go-icons/bg/transparent.png" data-src="' + img + '">';
 
   imgCont.html('<div id="go-fpd" class="absolute-center" style="min-width:100%; max-height: 100%; overflow-y: auto;"></div>');
   var imgCont2=$('#go-fpd');
   
   imgCont2.html( photo + savePhotoBtn( saveable, img, fsize, allow_download ));
   
  if(  total>1 ){
    photos.each( function(){
      var img_=this.src;
      if( img_!=img ){
   var height=this.getAttribute("height");
   var width= this.getAttribute("width");
   
    photo='<img onerror="go_postImgError(this);" class="lazy go-full-photo" height="' + height + '" src="file:///android_asset/go-icons/bg/transparent.png" data-src="' + img_ + '">';
    imgCont2.append( photo + savePhotoBtn(saveable,img_, fsize, allow_download) );
      }    
   });
  }
   
   var zi=zindex();
   $("#go-full-photo-container").css({"display":"block","z-index": zi});
   android.webView.enableZoom(true);
   
 });
  
  
 $('body').on('click','.go-post-author-image',function(){
 var this_=$(this);
   
  var img= this_.attr('src');
   $('#go-full-photo-div').html('<img onerror="go_postImgError(this);" class="lazy go-full-photo" src="file:///android_asset/go-icons/bg/transparent.png" data-src="' + img + '">');
   var zi=zindex();
   $('#go-full-photo-container').css({"display":"block","z-index": zi});
 android.webView.enableZoom(true);
   
 });
  
  //POST AUTHOR ICON FULL
  
$('body').on('click','.go-post-author-icon',function(){
   var this_=$(this);
   if( this_.hasClass('reposted') ) {
   //This let original post to load first before any image is viewable
     return;
   }
  var img= this_.attr('src');
   if(!img) return;
   var img   = replaceLast( img,'_small','_full');
   $('#go-full-photo-div').html('<div class="absolute-center" style="min-width: 100%;"><img onerror="go_postImgError(this);" class="lazy go-full-photo" src="file:///android_asset/go-icons/bg/transparent.png" data-src="' + img + '"></div>');
  $('#go-full-photo-container').css('display','block');
 android.webView.enableZoom(true);
});
  
  

//OPEN COMPOSE POST PAGE
  
$('body').on('click', '#open-compose-page-btn',function(){
 var zi=zindex();
 // $('#go-single-post-container') .css({'display':'block', 'z-index': zi}); //z-index previous: 42
  var fullname=userData('fullname');
  $('#compose-post-container').css({'display':'block','z-index': zi});
  var this_=$(this);
 
  try{
    var dfile=new android.File(PUBLIC_FOLDER,'draft.txt'); 
   if( dfile.isFile() ){
     $('#compose-post-box').val( dfile.read());
   }
  }catch(e){}  
  
 if( siteAdmin(  username) ){
  var gpElem=$('#compose-post-container .go-pages');
 
if( !$('#compose-post-container #go-post-by-pages').length){
 var sdata='<div style="position: relative;">';
     sdata+='<div class="mt-1"><strong>Select page </strong></div>';
     sdata+='<select class="form-control mb-1 mt-1" id="go-post-by-pages"><option disabled>--Select a page--</option></select>';
     sdata+='<img id="go-cpage-loader" class="w-20 h-20" style="position: absolute; top: 35px; left: 45%;" src="file:///android_asset/loading-indicator/loading3.png">';
     sdata+='</div>';
    
  gpElem.html( sdata);  
}
    var elem= $('#go-post-by-pages');  
  if( elem.hasClass('go-pages-loaded') ) return;
  
   $('#go-cpage-loader').css('display','block');
  
  if( elem.hasClass('go-pages-loading') ) return;
   elem.addClass('go-pages-loading');
   fetchPages( function(result, error){
       
  if( error ){
  
 setTimeout(function(){
   elem.removeClass('go-pages-loading');
   if( $('#compose-post-container').is(':visible') ){
        this_.click();
     }
 },5000);  
   /*
   $('#go-cpage-loader').css('display','none');
    android.toast.show('Could not load pages. ' + result);
 */
    
 }
     else{
  elem.removeClass('go-pages-loading');
       
 var o="";  
  if( result.no_pages ){
    $('#go-cpage-loader').css('display','none')
  android.toast.show('No pages yet')
   }
    else if( result.status=='success'){
      $('#go-cpage-loader').css('display','none');

      var static_page='<option value="" disabled>Static Pages</option>';
      
 $.each( result.result,  function(i, v){  
 	var puser=v.username;
 
if( goStaticPage( puser) ){
	static_page+='<option value="' + puser + '">' + v.fullname + ' *</option>';
	}else{
		
   o+='<option value="' + puser + '">' + v.fullname + '</option>';
   }
  });
 
  o+=static_page;
      
   elem.addClass('go-pages-loaded').append( o);
  } else if( result.error){
  toast( result.error );
 } 
  else{
   toast('Unknown error')       
    }
  }
   });    
     
 }
 
  });

  //FOLLOW BOX - SUGGESTION
$('body').on('input','#go-follow-box',function(){
    clearTimeout( fsuggestionsTimeout);

  var text=$.trim( $(this).val());
  if(!text||text.length<2) {
  $('#go-follow-suggestions').empty();
    return;
  }
  
  if( fsuggestionsAjax) fsuggestionsAjax.abort();
  
  var loader=$("#follow-suggestion-loader");
  loader.removeClass("d-none");
  
  fsuggestionsTimeout=setTimeout( function(){
  
  fsuggestionsAjax=$.ajax({
    url: config_.domain + '/oc-ajax/go-social/follow-suggestions.php',   
   type:'POST',
   timeout: 15000,
    dataType: "json",
    data: {
      "username": username,
      "pin": text,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
  // alert( JSON.stringify(result) );
     var scont= $('#go-follow-suggestions');
  loader.addClass("d-none")
  if( result.error){
     toast( result.error);
   }
    else if( result.no_record){
     scont.html('<span class="d-block" style="margin-left: 16px;">"' +  result.no_record + '"</span>'); 
    }
    else if( result.status=='success'){
     
      var data='<div class="go-suggestions-container">';
           data+='<ul>';
      $.each(result.suggestions, function(i,v){
        var pin=v.username;
        var fullname=v.fullname;
         data+='<li>';
         data+='<div class="container-fluid"><div class="row go-open-profile" data-user="' + pin + '" data-user-fullname="' + fullname + '">';
         data+='<div class="col p-0" style="max-width: 50px;">';
         data+='<div class="go-follow-sugg-icon-container middle">' + go_user_icon(pin, 'go-follow-sugg-icon') + '</div>';
         data+='</div>';
         data+='<div class="col">';
         data+='<div class="go-follow-suggested-name">' + fullname + '</div>';
         data+='<div class="go-follow-suggested-pin"><span>' + pin + '</span></div>';
         data+='</div>';
         data+='</div></div>';
          data+='</li>';
        });
        data+='</ul>';
        data+='</div>';
   scont.html(data);
      
 }else{
   scont.empty();
 }
      
  }).fail( function(e,txt,xhr){
    loader.addClass("d-none");
    
   android.toast.show("Something went wrong");     
  report__('Error "#go-follow-box" in go-social.js', JSON.stringify(e),true );
 
  });
    
  },1500);
});
  
  
 $('body').on('click','.go-post-bg',function(){
 var this_=$(this);
  var bg=this_.data('bg');
  var box=$('#compose-post-box');
   box.removeClass('go-pbg-1 go-pbg-2 go-pbg-3 go-pbg-4 go-pbg-5 go-pbg-6 go-pbg-7 go-pbg-8 go-pbg-9 go-pbg-10');
  if( bg=='go-pbg-1') {
   return box.attr("data-bg","");
  }
   box.addClass(bg).attr('data-bg', bg);
 
 });
 
  
  /*POST OPTIONS*/
  
$('body').on('click','.go-post-options-btn', function(){
 var this_=$(this);
 var pid= this_.data('pid');
 var post_by=$.trim( this_.data('post-by'));
 var true_author=$.trim( this_.data('true-author'));
 
 var ptype=this_.data('post-type');
 var pbf=this_.data('pbf');
 var hide_author=this_.data('hide-author');
  
   var show=false;
   var fshow=true;
   var ashow=true; //Always show

  if( username==strtolower(true_author) ||
    (goPage(username) && post_by==username) ){
    show=true; //Show if it's my post
    fshow=false; //Dont show if it's my post
  }
  
  if(ptype=='sponsored'){
    ashow=false;
    show=false;
  }
  
  var options=[
     {id:"go-show-edit-post-form-btn",icon:"edit.png",pid:pid,info:"Edit post", true_author: true_author, post_by: post_by, pbf: pbf, display: show }
    ,{id:"go-delete-post-btn",icon:"delete2.png",pid:pid, info:"Delete post", post_by: post_by, true_author: true_author,  pbf: pbf, display: show }
    ,{id:"go-report-post", icon:"report.png",pid:pid, info: "Report post", post_by: post_by, true_author: true_author,  pbf: pbf, display: fshow }
    //,{id:"go-copy-post-btn", icon:"copy-b.png",pid:pid, info:"Copy post", post_by: post_by, true_author: true_author, pbf: pbf, display: ashow }
   ];
  
 if( hide_author=="NO"){
   options.unshift({ id:"go-save-post-btn",icon:"save.png",pid:pid,info:"Save post", post_by: post_by, true_author: true_author, pbf:pbf, display: ashow })
  }
 
  
  var data='<div class="center_text_div" style="width:100%; margin-top: 0; padding: 10px;">';
      data+=buildPostOptions( options);  
      data+='</div>';
  
  displayData(data, { width: '100%', max_width:'500px', oszindex:200,pos:'100',data_class: '.post-options-div', osclose:true});
 });
  
  
  
  //OPEN EDIT POST FORM
  
  $('body').on('click','#go-show-edit-post-form-btn', function(){
 var this_=  $(this);
 var pid= this_.data('pid');
 var post_by= this_.data('post-by');
 var true_author= this_.data('true-author');
  
 closeDisplayData('.post-options-div'); 
  
  var data='<div class="center-header">';
      data+='<div class="container-fluid"><div class="row">';
      data+='<div class="col p-0">';
      data+='<div style="width: 100%; overflow-x: auto;"><button class="btn btn-sm btn-warning"  onclick="switchPostEditLayer(this);" data-layer="edit-post-text-div">Text</button> ';
      
      data+='<button class="btn btn-sm btn-warning" onclick="switchPostEditLayer(this);" data-layer="edit-post-files-div">Media</button> ';
     data+='<button class="btn btn-sm btn-warning" onclick="switchPostEditLayer(this);" data-layer="edit-post-links-div">Link</button>'; 
      
data+='</div></div>';
data+='<div class="col-4 p-0 text-right" style="max-width: 140px;"><img class="w-16 h-16" id="go-edit-post-loader" style="margin-right: 16px;" src="file:///android_asset/loading-indicator/loading2.png"> ';
data+='<button id="go-edit-post-btn" class="btn btn-sm btn-info" data-pid="' + pid + '" data-post-by="' + post_by + '" data-true-author="' + true_author + '" style="border-radius: 0; width: 60px;" disabled="disabled">Save</button>';
data+=' <button class="btn btn-sm btn-danger" onclick="closeDisplayData(\'.post-edit-div\');" style="border-radius: 0; width: 40px;">X</button> ';
data+='</div>';

data+='</div></div></div>';
  
      data+='<div id="edit-post-container" class="center-text-div bg-white" style="min-height: 220px; width:100%; margin-top: 0; padding: 10px;">';
     data+='<div class="post-edit-layer"  style="height: 200px; overflow: auto; display: none; position: relative;" id="edit-post-files-div"></div>';

     data+='<div class="post-edit-layer" style="height: 200px; overflow-x: auto; display: none; position:  relative;" id="edit-post-links-div">'
     
  data+='<div class="input-group mb-2"> <div class="input-group-prepend">  <span class="input-group-text bg-light text-center">Link</span></div> <input class="form-control" type="text" id="edit-post-link-box"> </div>';
  
  data+='<div class="input-group mb-2"> <div class="input-group-prepend">  <span class="input-group-text bg-light text-center">Title</span></div> <input class="form-control" type="text" id="edit-post-link-title-box"> </div>';
  
data+='</div>';

 data+='<div class="post-edit-layer" style="position: relative;" id="edit-post-text-div"><textarea id="go-post-edit-box" style="height: 200px; padding-bottom: 70px;" class="form-control" disabled="disabled"></textarea></div>';
 
 data+='<div class="post-edit-layer" style="height: 200px; overflow-x: auto; display: none; position:  relative;" id="edit-post-title-div">'    
  data+='<div class="input-group mb-2"><div class="input-group-prepend">  <span class="input-group-text bg-light text-center">Title</span></div> <input class="form-control" type="text" id="go-post-title-edit-box"> </div>';   
 data+='</div>'; 
    
 data+='</div>';
      
  displayData(data,{ width: '100%', max_width: '500px', oszindex:200, pos: '100', data_class:'.post-edit-div', osclose: false});

  var loader=$('#go-edit-post-loader');
  loader.css('display','inline-block');
  
  setTimeout( function(){
    
  fetchFullPost( pid, post_by, true_author, function(s,e,xhr){
     loader.css('display','none');
 if (e){
   closeDisplayData('.post-edit-div');
  toast('Check your connection. ' + xhr);
 }else if( s && s.status=='success'){
  
   var box=$('#go-post-edit-box');
   var title_box=$('#go-post-title-edit-box');
 
   box.prop('disabled', false);
   $("#go-edit-post-btn").prop("disabled", false);
  var post= $('<div/>').html( s.post).text();
      box.val( post); 
     title_box.val( s.post_title);
   
 POST_FILES_EDIT=new Object();
      
 try{
  var post_files=s.post_files;
  var meta_= s.post_meta;

if(post_files){
  post_files= JSON.parse( post_files);
 
  var files="";
  
  $.each( post_files,function(i,v){
 var ext=v.ext;
var path=v.path;
var poster=v.poster;

var fid=randomString(7);
if( ext=="jpg"){

	POST_FILES_EDIT[fid]=v;
	files+='<div class="d-inline-block mt-1 deep-edit-post-file" style="position: relative; margin-right: 5px; height: 100px; width: 100px;" data-fid="' + fid + '" onclick="goEditPostFile(this);"><img style="width: 100%; height: 100%; object-fit: cover; object-position: 50% 50%;  border: 0; border-radius: 5px;" alt="" src="' + path + '"></div>';
	
} else if( ext=="mp4" && poster){
	POST_FILES_EDIT[fid]=v;
	
    files+='<div class="d-inline-block mt-1 deep-edit-post-file" style="position: relative; margin-right: 5px; height: 100px; width: 100px;" data-fid="' + fid + '" onclick="goEditPostFile(this);"><img style="width: 100%; height: 100%; object-fit: cover; object-position: 50% 50%;  border: 0; border-radius: 5px;" alt="" src="' + poster + '"><img src="file:///android_asset/go-icons/video.png" class="w-30" style="position: absolute; bottom: 0; left: 0; z-index: 10;"></div>';
  }
	
  });
 
$("#edit-post-files-div").html( files );
  
}       
         meta= JSON.parse( meta_);
  var smeta=JSON.stringify( meta);

  if( meta.repost ){
 $("#edit-post-files-div,#edit-post-links-div").addClass("d-none");
 }

  $("#edit-post-link-box").val( meta.link||"");
  $("#edit-post-link-title-box").val( meta.link_title||"");
  
var mdiv='<div class="bg-white" style="white-space: nowrap; border: 1px solid #f2f2f2; padding: 5px 10px; position: absolute; bottom: 0; width: 100%; overflow-x: auto;">';
    mdiv+='<div class="text-left" style="font-size: 11px; font-weight: bold;">Enable/disable buttons</div>';
   mdiv+='<textarea class="d-none" id="edit-post-meta-datas">' + smeta + '</textarea>';
   
   postEditMeta=smeta.replace(/&amp;/g, "&");
   
   var meta_editable={
     "commentable":"Comment",
     "shareable":"Share",
     "fdload":"File download"
   };
   
 $.each(meta,function(i,v){
   
   if(i in meta_editable){
     mdiv+='<div class="d-inline-block w-100 text-center">';   
     
     mdiv+='<div class="custom-control custom-checkbox" style="margin: 6px 12px;">';
     mdiv+='<input type="checkbox" class="custom-control-input go-edit-post-meta" id="go-edit-post-meta-' + i + '" data-key="' + i + '"' + ( v?' checked="checked"':'') + '">';
     mdiv+='<label class="custom-control-label" for="go-edit-post-meta-' + i + '">';
     mdiv+='<span class="d-block" style="font-weight: bold; font-size: 12px;">' + meta_editable[i] + '</span></label>';
     mdiv+='</div>';
     
     mdiv+='</div>';
     }   
  });
   
 mdiv+='</div>';
  $("#go-post-edit-box").after( mdiv);
 
 }catch(e){}
   
 }
  else if( s.error){
     toast(s.error);
    closeDisplayData('.post-edit-div');
 }else {
   closeDisplayData('.post-edit-div');
   toast('Unknown error occured.');
 }
    
  });
  },1000);
});
  

    //EDIT POST
  
$('body').on('click','#go-edit-post-btn',function(){
 var this_=  $(this);
 var pid= this_.data('pid');
 var post_by=this_.data('post-by');
 var true_author=this_.data('true-author');
  
  if( !pid ||!post_by){
    return toast('Missing parameters.');
  }
  
 try{
  var settings= JSON.parse( localStorage.getItem("server_settings") );
  var adm= siteAdmin( username);
  
 }catch(e){ 
  return toast("Loading settings...", { type:"info"});
 }
 
 var box= $('#go-post-edit-box');
  
  var text=$.trim( box.val());
  var plen=text.length;
  
  var post_title=$.trim( $("#go-post-title-edit-box").val()||"");
  
  if( settings.enable_post_title=="YES"){
    
if(!adm && !post_title ){
   return toast("Input post title");
 }
else if( post_title.length>150){
 return toast("Post title exceed 150 characters");
  }
}
  
 var  meta=(postEditMeta||"{}");
  
  try{
    meta= JSON.parse(meta);

var has_files=meta.has_files;
var melem= $("#edit-post-container .go-edit-post-meta"); 
   
    melem.each( function(){
     var this_=$(this);
     var key=this_.data("key");
     meta[key]=this_.is(':checked')?1:0;
   });
    
  var link=$.trim( $("#edit-post-link-box").val()||"");
  var link_title=$.trim( $("#edit-post-link-title-box").val()||link );
  
  var link_=sanitizeLink(link, link_title);
  link=link_.link;
  link_title=link_.link_title;
 
   meta["link"]= link
   meta["link_title"]=link_title;
   meta["plen"]=plen ;
 
  }catch(e){
    return toast("Could not edit");
  }
  
  if( !plen && !has_files){
    return toast('Enter text')
  }
  
  var loader=$('#go-edit-post-loader');
  loader.css('display','inline-block');
  
  this_.prop('disabled',true);
  var fullname=userData('fullname');
  box.prop('disabled', true);
  
var total_files=0;
var post_files=[];
  
if( !POST_FILES_EDIT.length ){
    
  $.each( POST_FILES_EDIT, function(key,value_){
	post_files.push( value_);
  });
 total_files=post_files.length;
  
  post_files=JSON.stringify( post_files);
  
}else{
   post_files="";
}
  

meta["total_files"]=total_files;
  
     var meta_string= JSON.stringify(meta);
   
  
  setTimeout(function(){
    $.ajax({
    url: config_.domain + '/oc-ajax/go-social/edit-post.php',
    type:'POST',
  // timeout: 10000,
   dataType: "json",
   data: {
      "username": username,
      "post_by": post_by,
      "true_author": true_author,
      "post_id": pid,
      "post_title": post_title,
      "post": text,
      "post_files": post_files,
      "post_meta": meta_string,
      "fullname": fullname,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
  //  alert(JSON.stringify(result))
 loader.css('display','none')
 this_.prop('disabled',false);
   box.prop('disabled', false);
  if( result.status=='success' ){

 var settings=result.settings;
 var post_preview=result.post_preview;

 closeDisplayData('.post-edit-div');

 var fullname=meta.pbf;

 var data=build_post( pid, post_title, "" , post_by, fullname, post_preview,  post_files, meta_string.replace(/</g,'&lt;') );
 
    $('.go-post-container-' + pid ).html( display_post( settings , data)  );   
 
 
 }
   else if(result.error){
      toast(result.error );
  }
   else{
    toast('Unknown error occured.', {type:'info'});
  }
 }).fail(function(e,txt,xhr){
   loader.css('display','none');
  this_.prop('disabled', false);
   box.prop('disabled', false);
  android.toast.show("Something went wrong");     
  report__('Error "go-edit-post-btn" in go-social.js', JSON.stringify(e),true );
 
    });
    
  },1000);
  
 });
  
 $("body").on("press",".deep-edit-post-file",function(){
 
    if(!siteAdmin(username)) return;
   
   var this_=$(this);
   var fid=this_.data("fid");
 
 if(!fid) return;
   
   var file_data=POST_FILES_EDIT[fid];
   
 var data='<div class="center-text-div bg-white" style="width:100%; margin-top: 0; padding: 10px;">';
 
  $.each( file_data, function(key,v){
    data+='<div class="mb-2">' + key + '<textarea class="deep-edit-post-file-input form-control" data-key="' + key + '">' + v + '</textarea></div>';
   });
   
   data+='</div><div class="center-footer"><div class="mt-2" style="padding-left: 20px;"> <button data-fid="' + fid + '" id="save-deep-edit-post-file" class="btn btn-sm btn-primary">Done</button></div></div>';
  
 displayData(data,{ width: '100%', max_width: '500px', oszindex:250, pos: '100', data_class:'.deep-post-edit-div', osclose: true});

});
  
  
$('body').on('click','#save-deep-edit-post-file', function(){
  var this_=$(this);
  var fid=this_.data("fid");
 var obj=new Object(); 
 
  $(".deep-edit-post-file-input").each(function(){
   var v=$(this).val();
   var key=$(this).data("key");
   obj[key]=v;
 });
  
  POST_FILES_EDIT[fid]=obj
 
 toast("Done", {type:"success"});
 closeDisplayData(".deep-post-edit-div");
});
  
  
  //DELETE POST
  
$('body').on('click','#go-delete-post-btn',function(){
 var this_=  $(this);
 var pid= this_.data('pid');
 var post_by=this_.data('post-by');
 var true_author=this_.data('true-author');
  
 closeDisplayData('.post-options-div');
  if( !confirm('Delete now') ) return;
   deletePost(pid ,post_by, true_author );  
 });
  
    
$('body').on('click','.go-remove-upload-preview',function(){
   var this_=$(this);
   var fpath= this_.data('fpath');
   var contId=this_.data('cid');
   var findex= +this_.data('findex');
  
  GO_UPLOAD_FILE_PATHS =$.grep( GO_UPLOAD_FILE_PATHS, function(value) {
   return value != fpath;
 });
   
try{  
 var file=new android.File( fpath);
 
 if( file.isFile()){
    file.delete();
 }
 }catch(e){}
   
   $("#" + contId).remove();
   
  });
  
 
  //LOAD FULL POST
  
  $('body').on('click','.go-load-full-post', function(e){
  var this_=$(this);
  var pid=this_.data("pid");
  var post_by=this_.data("post_by");
  var true_author=this_.data("true_author");
    
    if( loadingFullPost) {
      return android.toast.show("Please wait");
    }
 
   var target_=$(e.target);
    
   if(  target_.is("code")
      || target_.is("span")
      || target_.is("a") ){
     return; 
   }
 
  if( this_.hasClass("full-loaded") ) {
   
    var hdata= removebbCode( this_.html() );
    this_.html( go_textFormatter( hdata.substring(0, 200) ) + '<span class="go-post-more-link">...More</span>');
    this_.removeClass("full-loaded");
    return;
  }
    this_.prop('disabled',true);
  
    loadingFullPost=true;
   this_.addClass('go-load-full-post-loading');
    
 setTimeout( function(){
   
    fetchFullPost( pid, post_by, true_author, function(s,e,xhr){
    this_.prop('disabled', false);
      loadingFullPost=false;
      this_.removeClass('go-load-full-post-loading')
 if (e){
  if(xhr!='timeout'){
    android.toast.show('Check your connection');
  }
 android.toast.show("Something went wrong");     
  report__('Error ".go_load-full_post" in go-social.js', JSON.stringify(e),true );
   
   
 }else if( s && s.status=='success' ){
    this_.html( go_textFormatter(s.post) );
    this_.addClass('full-loaded');
  }
   else if(s.error){
      toast(result.error );
  }
   else toast('Unknown error occured.');
   });
},1000);
 
  });
  
  
  //SHARE POST or REPOST
  
  $('body').on('click','.go-share-post-btn',function(){
  var this_=$(this);
  var pid=+this_.data('pid');
  var spid=+this_.data('share-pid')||0;
  var notify=this_.data('notify');
  var pbn=this_.data('pbn')||"";
  var spbn=this_.data('spbn')||"";
 
    var hl='<img src="file:///android_asset/go-icons/share.png" style="height: 20px; width: 20px; margin-right: 10px;">';
   
   if( spbn ){
     hl+="Repost " + pbn.toUpperCase() + "'s shared post";
   }
    else{
    hl+="Repost " + pbn.toUpperCase() + "'s post";  
   }
    
 if(  !pid ) return toast('Not an id.');
   
  var rdiv=$('#go-repost-highlight').html('<strong>' + hl + '</strong>') 
    $('#grh-container').css('display','block');
 
  $('#go-repost-data').attr('data-pid', pid)
   .attr('data-spid', spid).
   attr('data-notify', notify)
   .val('1');
    
  
 $('#compose-post-container .go-repost-hide').css('display','none');
// $('#compose-post-container').fadeIn();
  $('#open-compose-page-btn').click();
 
});
  
  //LIKE POST
  
$('body').on('click','.go-like-post-btn',function(){
 var isRunning=$("#is-running");
  
 if( isRunning.hasClass("liking-post") ){
   return android.toast.show('Please wait');
 }
  
  
  var this_=$(this);
  var pid=+this_.data('pid');
  var post_by=this_.data('post-by');
  var reacted_icons= $(".reacted-icons-container-" + pid);
  var rbc=$(".reactions-box-container-" + pid);

  rbc.empty();
  
  if( this_.hasClass("close")){
    return;
  }
             
  var reaction=this_.data("reaction")||"like";
  this_.prop('disabled',true);

  likePost(pid, post_by, reaction, function(result,error){
    this_.prop('disabled', false);
    
 if( error){
   return toast( error );
 }else if (result.status && result.status=='success'){
    reacted_icons.attr('data-reactions', JSON.stringify( result.result ) );
  }
   rbc.empty();
  });
});
  
$("body").on("click",".reacted-icons-container", function(){
  var data=$(this).attr("data-reactions");
  try{
 var json= JSON.parse( data);
  }catch(e){
   return  android.toast.show("Not available");  
  }
  
    var div="";
 $.each( json, function(i,count_){
  if(count_){
    div+='<div class="container-fluid mt-2 ml-2 mr-2 mb-2">';
    div+='<div class="row">';
    div+='<div class="col-3"><strong>' + i.toUpperCase() + '</strong></div>';
    div+='<div class="col-5 text-center">';
    div+='<img class="w-18" src="file:///android_asset/chat-icons/reactions/' + i + '.png">';
    div+='<img class="w-18" src="file:///android_asset/chat-icons/reactions/' + i + '.png">';
    div+='<img class="w-18" src="file:///android_asset/chat-icons/reactions/' + i + '.png">';
    div+='</div>';
    div+='<div class="col-4 text-center"><strong>' + abbrNum( (+count_), 1) + '</strong></div>';
    div+='</div>';
    div+='</div>';
  }
});
  
  
  displayData( div,{ max_width:'300', data_class:'.view-reactions-div', osclose: true});
  
});
  
  $("body").on('press', '.go-like-post-btn', function(e) {
    //finger.js
    var this_=$(this);
  var pid=+this_.data('pid');
  var post_by=this_.data('post-by');
  var btn=$(".go-like-post-btn-" + pid);
  $(".reactions-box-container-" + pid).html( reactionsBox(pid, post_by) );
  
  });
      
//PROFILE
  
$('body').on('click','.go-profile-cover-photo',function(){
 //View full cover photo
    var this_=$(this);
  if( !this_.hasClass('img-loaded')) return;

  var img= this_.attr('src');
  var cont=$('#go-full-cover-photo-container');
  var bg=this_.attr('data-bg')||"rgba(0,0,0);";
 cont.attr("style","background-color:" + bg); 

  var rid=randomString(3);
 cont.html('<img id="' + rid + '" class="absolute-center w-30 h-30" src="file:///android_asset/loading-indicator/loading3.png" data-src="' + img + '">')
   .css('display','block');

  goFetchPhoto(img, function(idata,error){
    $('#' + rid).remove();
    if( idata) cont.html('<div style="min-width: 100%;" class="absolute-center"><img class="go-full-photo" src="' + idata + '"></div>');
 });
  
  android.webView.enableZoom(true);
});
  
  
$('body').on('click','.go-open-profile, .go-user-open-profile', function(){
   var this_=$(this );
   var post_by=this_.data('user');
   var fullname=this_.attr('data-user-fullname');
   var hide_author=this_.data('hide-author');
  
  if( hide_author==="YES") return;
  
 $('#go-current-opened-profile').val( post_by).attr('data-fullname', fullname);

  var zi=zindex();
  
setTimeout( function(){
  
  $('#go-profile-container').css({'display':'block','z-index': zi}); //44
  $('#go-comment-container').css('z-index', zi-10);
  $('#go-rcomment-container').css('z-index', zi-5);
 
  //stackOrder('#go-profile-container');
 },200);
 
  $('#go-single-post-container').css('z-index', zi-15 );
 closeDisplayData('.top-pages-lists');
  
  if( $('#go-profile-page-' + post_by).length ){
 var ucont= $('#go-profile-page-' + post_by);

    go_profile(ucont,  post_by, fullname, 'no-load');   
   goLoadProfilePhoto(ucont, post_by)
   
      return;
    }
  
   this_.prop('disabled',true);
  
   $.ajax({
      url:'file:///android_asset/go-profile.html'
 }).done(function(result ){
     
   var ppage=$('<div class="go-profile-page go-profile-child-container" id="go-profile-page-' + post_by + '" data-t-once="0"></div>')
           .append( result);
   $('#go-profile-container')
     .append('<div class="u-shadow" onclick="goCloseProfile();"></div>')
     .append( ppage);
  
   var ucont= $('#go-profile-page-' + post_by);
      go_profile( ucont, post_by, fullname, 'load-once');
   goLoadProfilePhoto(ucont, post_by)
      this_.addClass('loaded');
      this_.prop('disabled', false);
try{
    var settings= JSON.parse( localStorage.getItem("server_settings") );
    var sa=siteAdmin( username)
  
 if(  !sa && settings.go_enable_follow_btn=="NO"){
      ucont.find(".follow-feature").remove();
    }
 if( !sa && settings.enable_chat=="NO"){
    ucont.find(".messenger-feature").remove();
  }
if( !sa && settings.enable_send_chat=="NO" && !siteAdmin( post_by ) ){
   ucont.find(".messenger-feature").remove();  
  }
  
 }catch(e){}
     
  }).fail(function(e){
     this_.prop('disabled', false);
     toast( JSON.stringify(e) );
   });
    
  }); 
  

$('body').on('click','.post-chat-user,.group-chat-from', function(){
  //Check bbcode.js, displayMessage(group chat_from)
  var this_=$(this);
  var fuser= this_.data('fuser');
 if(!fuser) return;
      fuser=strtolower(fuser.replace('~','') );
  var fullname=fuser;

var pc= go_config_.page_contact;
  if( goPage( fuser) && pc){
    fuser= pc;
    fullname='Official';
  }
  
 
  if( fuser==strtolower( username) ){
     return android.toast.show("This is your account");
  }
  this_.prop("disabled", true);
  
  android.activity.loadUrl("main","javascript: createDynamicStadium('" + fuser + "','" + fullname + "','" + fuser + "');");
   setTimeout( function(){
    openMessage();
   this_.prop('disabled', false);
 },500);
  
});
  

$('body').on('click','.go-profile-message-btn',function(){
 var this_=$(this);
  var elem=$('#go-current-opened-profile');
  var curr_user=elem.val();
  var fullname=elem.attr('data-fullname');
  
     
  if(!curr_user) {
     return toast('Account not found.');
   }
/* else if( go_config_.can_message=='v' && !userVerified( curr_user) && !goAdmin(username) ){
    return toast('Not allowed');
  }
  */
  
 var fuser= strtolower( curr_user);
  
  var pc= go_config_.page_contact;
  if( goPage( fuser) && pc){
    fuser= pc;
    fullname='Official';
  }  
  
  if( fuser==strtolower( username) ){
     return android.toast.show('This is your account.');
  }
  this_.prop('disabled', true);
  
  android.activity.loadUrl("main","javascript: createDynamicStadium('" + fuser + "','" + fullname + "','" + curr_user + "');");
   setTimeout( function(){
    openMessage();
   this_.prop('disabled', false);
 },500);
  
  });
  
  
  
//REPORT POST
  
  $('body').on('click','#go-report-post',function(){
 var this_=  $(this);
 var pid= this_.data('pid');
   
  var data='<div class="center-header">Why are you reporting this?</div>';
      data+='<div class="center_text_div bg-white" style="width:100%; padding: 10px;">';
      data+='<div class="form-text">E.g Fraud, Terrorism, False infomation, Spam, Impersonation, Nudity, Violence, Harassment, Hate speech e.t.c.</div>';
      data+='<div><textarea id="go-report-post-box" style="height: 100px;" class="form-control" placeholder="Tell us why it\'s inappropriate..."></textarea></div>';
      data+='<div class="mt-3 text-right">';
    //  data+='<img class="w-20 h-20" id="go-edit-post-loader" style="margin-right: 16px;" src="file:///android_asset/loading-indicator/loading2.png">';
      data+='<button id="go-report-post-btn" class="btn btn-sm btn-info" data-rid="' + pid + '" data-section="post">Report</button></div>';
      data+='</div>';
  closeDisplayData('.post-options-div');
  displayData(data,{ width: '100%', max_width:'500px', oszindex:200, data_class:'.report-post-div', osclose: false});  
});
   
  
  //SEND REPORT
  
$('body').on('click','#go-report-post-btn',function(){
 var this_=$(this);
  
  var fullname=userData('fullname')||username;
  var box=$('#go-report-post-box');
  var rid=this_.data('rid');
  var section=this_.data('section');
  var report=$.trim(box.val())
  if( report.length<2){
   return toast('Report not concise enough.');
  }
  report=report.replace(/[\r\n]{2,}/g," ");
 var total_words= report.split(' ');
  
  if( total_words.length > 15||report.length>150){
   return toast('Report too long. At most 15 words or 150 characters.');
  }
    
  this_.prop('disabled', true);
  box.prop('disabled', true);
  
  buttonSpinner(this_);
  
  setTimeout(function(){
    $.ajax({
    url: config_.domain + '/oc-ajax/report.php',
    type:'POST',
   timeout: 40000,
     dataType: "json",
    data: {
      "username": username,
      "message": report,
      "report_id": rid,
      "section": section,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
  //  alert(JSON.stringify(result))
 buttonSpinner(this_, true);
 this_.prop('disabled',false);
 box.prop('disabled', false);
  if( result.status=='success' ){
  android.toast.show( result.result);
 closeDisplayData('.report-post-div');
 }
   else if(result.error){
      toast(result.error );
  }
   else{
    toast('Unknown error occured.', {type:'info'});
  }
 }).fail(function(e,txt,xhr){
   buttonSpinner(this_, true);
  this_.prop('disabled', false);
   box.prop('disabled', false);
  android.toast.show("Something went wrong");     
  report__('Error "go_report_post_btn" in go-social.js', JSON.stringify(e),true );
 
    
  });
    
  },1000);
  
 }); 
  
  
  //FOLLOW
  
  $('body').on('click','.go-follow-btn',function(){
 var this_=$(this);
  var pin= $.trim( this_.attr('data-pin'));
  if(!pin){
    return toast('Pin not found.');
  }
   
    else if( go_config_.can_follow=='v' && !userVerified( pin)){
    return toast('Not allowed');
  }
    
    buttonSpinner(this_);
 this_.prop('disabled', true);
    
    setTimeout(function(){
    $.ajax({
    url: config_.domain + '/oc-ajax/go-social/follow.php',
    type:'POST',
   timeout: 40000,
     dataType: "json",
    data: {
      "username": username,
      "pin": pin,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
    //alert(JSON.stringify(result))
 buttonSpinner(this_, true);
 this_.prop('disabled',false);

  if( result.status=='success' ){
  android.toast.show( result.result);
$('.go-follow-btn-' + pin)
   .removeClass('go-follow-btn')
   .addClass('go-unfollow-btn')
   .text('Following');
  $('.go-pymk-' + pin).remove();
  if( this_.hasClass('custom')){
    localStorage.setItem( username + '_custom_pymk','true')
  }
 }
   else if(result.error){
      toast(result.error );
  }
   else{
    toast('Unknown error occured.', {type:'info'});
  }
 }).fail(function(e,txt,xhr){
   buttonSpinner(this_, true);
  this_.prop('disabled', false);
 // android.toast.show('Check your connection. ' + xhr);
  android.toast.show("Something went wrong");     
  report__('Error ".go-follow-btn" in go-social.js', JSON.stringify(e),true );
 
    });
      
    },1500);
    
  });
  
  //UNFOLLOW
  
$('body').on('click','.go-unfollow-btn',function(){
  var this_=$(this);
  var pin= $.trim( this_.attr('data-pin'));
  
  if(!pin){
    return toast('Pin not found.');
  }
    
    buttonSpinner(this_);
 this_.prop('disabled', true);
    
    setTimeout(function(){
    $.ajax({
    url: config_.domain + '/oc-ajax/go-social/unfollow.php',
    type:'POST',
   timeout: 40000,
     dataType: "json",
    data: {
      "username": username,
      "pin": pin,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
  //  alert(JSON.stringify(result))
 buttonSpinner(this_, true);
 this_.prop('disabled',false);

  if( result.status=='success' ){
  android.toast.show( result.result);
 this_
   .removeClass('go-unfollow-btn')
   .addClass('go-follow-btn')
   .text('Follow');
 }
   else if(result.error){
      toast(result.error );
  }
   else{
    android.toast.show('Unknown error occured.');
  }
 }).fail(function(e,txt,xhr){
   buttonSpinner(this_, true);
  this_.prop('disabled', false);
  android.toast.show("Something went wrong");     
  report__('Error ".go-unfollow-btn" in go-social.js', JSON.stringify(e),true );
 
    });
      
    },1500);
   });
 
 $('body').on('change','#go-page-post-order', function(){
  var uElem= $('#go-current-opened-profile');
   var user=uElem.val();
   var fullname=uElem.attr('data-fullname');
   
  var ucont= $('#go-profile-page-' + user);
   var pnElem=ucont.find('.go-profile-next-page-number');
  var pageNum=pnElem.val("");
      ucont.find('.go-profile-posts').empty();
   
  go_profile( ucont, user, fullname, 'load');
  });
  
 

//Save Post
  
  $("body").on("click","#go-save-post-btn", function(){
    
   goSavePost(this); 
    
  });
  
  
  
});


function switchPostEditLayer(t){
	var layer=$(t).data("layer");
	$("#edit-post-container .post-edit-layer").css("display","none");
 $("#" + layer).css("display","block");
}

function goEditPostFile(t){
	var this_=$(t);
	var fid=this_.data("fid");
	if(!fid)  return toast("File id not found");
	if(!confirm("Remove file?")) return;
	
 delete POST_FILES_EDIT[fid];
	this_.remove();
}


function likePost(pid, post_by, reaction, callback){
  
  if(!pid ) {
    return callback("", "Not an id.");
  }
  
  var isRunning=$("#is-running");
  
 if( isRunning.hasClass("liking-post") ){
   return android.toast.show('Please wait.');
 }
  
 /*var ldir=new android.File(PUBLIC_FOLDER, username +'/GO-POSTS-LIKES');

 if( !ldir.isDirectory() && !ldir.mkdirs()){
   return callback("", "Could not create LiDir.");
 }
 */
  
 var likes=$('.total-likes-' + pid);
 var likes2=$('.top-total-likes-' + pid);
  
 var curr_likes=+likes.attr('data-total-reactions');
 var curr_icon_= $('.go-like-post-icon-' + pid);
 
var curr_icon=curr_icon_.attr('src');
      
  var type=1;
  var clikes=curr_likes+1;
  var reaction_="";
  
 /*
 var plfile=new android.File(ldir,pid + '.txt');

  if(  plfile.isFile() ){
  */
  
  var pliked=postLiked( pid);
  
  if(pliked){
    //If file exists, then post is previously liked 
    type=2;
    reaction_=pliked; //plfile.read()||"";
 
 if( reaction_ ==reaction){ 
  var clikes=curr_likes-1;
  curr_icon_.attr("src", "file:///android_asset/chat-icons/reactions/like-empty.png");
   //curr_icon.replace('liked.png','like.png'));
 }else{
   type=1;
   clikes=curr_likes;
   curr_icon_.attr('src', 'file:///android_asset/chat-icons/reactions/' + reaction + '.png');
  } 
}
else{
   curr_icon_.attr('src', 'file:///android_asset/chat-icons/reactions/' + reaction + '.png');
 //curr_icon.replace('like.png','liked.png') ) 
}
  
  likes.text( abbrNum(clikes, 1) );
  likes.attr("data-total-reactions", clikes);
    
  var fullname=userData("fullname");
  isRunning.addClass("liking-post");
  
  setTimeout(function(){
    $.ajax({
    url: config_.domain + '/oc-ajax/go-social/like-post.php',
    type:'POST',
  // timeout: 40000,
     dataType: "json",
    data: {
      "username": username,
      "fullname": fullname,
      "post_id": pid,
      "post_by": post_by,
      "preaction": reaction_,
      "reaction": reaction,
      "type": type,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
 // alert(JSON.stringify(result))
      isRunning.removeClass("liking-post");
     
     callback( result, result.error);     
 
 if( result.status=='success' ){
    
   if( type==2){
   //   plfile.delete();
     removePostLike(pid);
    
   $(".go-like-post-btn-" + pid).removeClass("go-post-liked");
   }else{
     storePostLike(pid, reaction); 
  //plfile.write( reaction);
  $(".go-like-post-btn-" + pid).addClass("go-post-liked");
    
   }
 }
   else if(result.error){
    //clikes=clikes-1;
  likes.text( abbrNum( curr_likes, 1) );
  likes.attr("data-total-reactions", curr_likes)
  curr_icon_.attr("src", curr_icon);
      
  }
   else{
    curr_icon_.attr('src', curr_icon);
     toast('Unknown error occured.',{type:'info'});
   }
 }).fail(function(e,txt,xhr){
   isRunning.removeClass("liking-post");

  callback("", true);
  // clikes=clikes-1;
  likes.text( abbrNum(curr_likes, 1) );
  likes.attr('data-total-reactions', curr_likes);
  curr_icon_.attr('src', curr_icon);
           
 // android.toast.show("Something went wrong");     
  report__('Error "likePost()" in go-social.js', JSON.stringify(e),true );
 
  });
    
  },1000);
  
  
}


function reactionsBox(pid, post_by){
  var reactions=["like","love","wow","laugh","sad","angry"];
  $(".reactions-box").remove();
  var data='<div class="container reactions-box">';
  data+='<div class="row">';
  data+='<div class="col go-like-post-btn close" data-pid="' + pid + '"><img class="h-20 w-20" src="file:///android_asset/chat-icons/reactions/hide.png"></div>';
  $.each( reactions, function(i,v){
  data+='<div class="col go-like-post-btn" data-reaction="' + v + '" data-pid="' + pid + '" data-post-by="' + post_by + '">';
  data+='<img class="w-20 h-20" src="file:///android_asset/chat-icons/reactions/' + v + '.png">';
  data+='</div>';
  });
  data+='</div>';
  data+='</div>';
  
  return data;
}
  

function fetchFullPost( pid, post_by, true_author, callback){
  
    $.ajax({
    url: config_.domain + '/oc-ajax/go-social/open-full-post.php',
    type:'POST',
  // timeout: 40000,
     dataType: "json",
    data: {
      "username": username,
      "post_by": ( post_by||""),
      "true_author": ( true_author||""),
      "post_id": pid,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
 // alert(JSON.stringify(result))
      
   if(callback) callback( result);  
     
 }).fail(function(e,txt,xhr){
    callback(false,true,xhr);
//  android.toast.show("Something went wrong");     
  report__('Error "fetchFullPost()" in go-social.js', JSON.stringify(e),true );
 
  });
}    
  
function viewOriginalPost(){
  var cpi=$('#current-post-id');
  var pid=cpi.val();
    cpi.val("");
 
 if( !pid){ 
    return toast('Post id not found');
 }
  var elem=$('<div/>').addClass('go-open-single-post')
      .attr('data-pid', pid);
    elem.appendTo('body').click();
 goCloseCommentReply();
}



function goChangePageType(t){
	var this_=$(t);
	var selected=this_.val();
$('#create-page-selected-type').text( selected);
$('.page-type-info').css('display','none');
$('#' + selected + 'info').css('display','block');
	
}


//Create page

function goCreatePage(t){   
    var this_=$(t);
 try{
  var type= $('#go-create-page-type').val();
if( type.length<3) {
	return toast('Select page type');
	}
   
   var cppin= $.trim($('#cp-pin').val()||"" );
  var cpemail= randomString( 15) + '@gmail.com';

 var cpfullname= $.trim( $('#cp-fullname').val());
var cpbio= $.trim($('#cp-bio').val() );

var cpphone=$.trim( $('#cp-phone').val() );
var cppassword=$.trim($('#cp-password').val() );
     
  if( !cppin || cppin.length<4 || cppin.length>20) {
    return toast('Page pin too long or short. Max: 20');

   }else if( !validUsername(cppin) ) {
   return toast('Invalid pin. Alphanumerics, an underscore supported and must start with a letter.');
   }

else if(!cpfullname || cpfullname.length<2 || cpfullname.length>60) {
     return toast('Enter a valid display name or title.');
   }
else if( !validName(cpfullname) ){
     return toast('Enter a good display name or title. Must start and end with a letter.');    
    }
else if( !cpbio ){
     return toast('About page should not be empty.');    
    }

  else if( !cpemail || cpemail.length<5 ) {
     return toast('Enter a valid email address.');    
   }
   
else if( cpphone && !cpphone.match(/^[0-9+() -]{4,50}$/) ) {
     return toast('Enter a valid phone number.');    
  }

  else if(!cppassword ||cppassword.length<6) {
   return toast('Password should contain at least 6 characters.');    

  }
    else if(cppassword.length>50) {
    return toast('Password too long. Max: 50.');    
    }    
    else if( !validPassword(cppassword) ){
     return toast('Passwords can only contain the following characters: a-z 0-9 ~@#%_+*?-');
    }
    $('input,button').prop('disabled',true);
   buttonSpinner(this_);
 var elem=$('#go-create-page-form input,#cp-bio');

    $.ajax({
      'url': config_.domain + '/oc-ajax/go-social/add-new-page.php',
    type:'POST',
   dataType: 'json',
      'data':
      {
       "username": username,
       "type": type,
       "pin": cppin,
       "email": cpemail,
       "fullname": cpfullname,
       "bio": cpbio,
       "phone": cpphone,
       "password": cppassword,
       "token": __TOKEN__,
      },
      type:'POST'
    }).done(function(result){
 // alert(result)
   buttonSpinner( this_, true);
   $('input,button').prop('disabled', false);
      
  if(result.error){

 toast(result.error);
}
 else if( result.status ){
  elem.val('');
 $('#go-post-by-pages').removeClass('go-pages-loaded');
 $('#compose-post-container .go-pages').empty();
   
   toast( result.result ,{type:'success'});
 
   } else{
    toast('Unknown error occured.');
      }
            
    }).fail(function(e, txt, xhr){
      $('input,button').prop('disabled',false);
      buttonSpinner(this_,true);   
    android.toast.show("Something went wrong");     
  report__('Error "goCreatePage()" in go-social.js', JSON.stringify(e),true );
 
    });
}catch(e){ toast(e); }
  
}


function goLoadProfilePhoto(ucont, user){
var ptoken=localStorage.getItem('go_photo_token')||1;
  //Photo token changes when user photo is uploaded

var pimg_path=config_.users_path + '/' + strtolower( user[0] + '/' +user[1] +'/' + user[2] + '/' + user )+ '/profile_picture_full.jpg?i=' + ptoken;
 
  var coverImg=ucont.find('.go-profile-cover-photo');
  var coverImgCont=ucont.find('.go-profile-cover-photo-container');
  var img=ucont.find('.go-profile-photo');
 
 if(!img.hasClass('img-loading') && !img.hasClass('loaded') ){  
  var imgCont=ucont.find('.go-profile-photo-container');
      imgCont.attr('data-user', user);
    
 img.on('load', function(){
   var rgb=getAverageRGB( this);
   $(this).addClass('img-loaded').removeClass('img-loading');  
   coverImg.attr('data-bg', rgb);
   coverImgCont.attr('style','background-color: ' + rgb);
 }).on('error', function(){
   $(this).removeClass('img-loading');
 });
 
 img.addClass('img-loading');
 img.attr('src', pimg_path.replace('_full.jpg','_small.jpg') )
}
    
 if( !coverImg.hasClass('img-loading') && !coverImg.hasClass('img-loaded')){
     coverImg.addClass('img-loading');
   var rid=randomString(3);
   coverImgCont.append('<img id="' + rid + '" class="absolute-center w-30 h-30" src="file:///android_asset/loading-indicator/loading3.png">');

 setTimeout(function(){
  
 goFetchPhoto( pimg_path, function(idata,e){
    $('#' + rid).remove();
    coverImg.removeClass('img-loading');
   if( idata){
     coverImg.attr('src', idata).addClass('img-loaded');  
  return;
   }
var reloadBtn=$('<button id="go-pphoto-reload-btn-' + user + '" class="btn btn-sm absolute-center" style="background: none;"><img src="file:///android_asset/go-icons/refresh2.png" class="w-30 h-30"></button>')
  .on('click', function(){
   localStorage.setItem('go_photo_token', rid);
  
     goLoadProfilePhoto(ucont, user);
     $(this).remove();
   });
    
 coverImgCont.append(reloadBtn);
    
   });
  },2000);
 
 }
}


var gpAjax,gpTimeout;

function go_profile(ucont,  user, fullname, type){
  clearTimeout( gpTimeout);

 fullname=fullname||user;
 
  $(".go-profile-page").css("display","none");
  var toast_p_once= +ucont.attr("data-t-once");

  var veri=checkVerified(user, fullname);
  var verified=veri.icon;
     fullname= veri.name;
  var fullname_=fullname + " " + verified;
  
 var nameCont=ucont.find(".go-profile-fullname");
  nameCont.html( fullname_ ).attr("data-name", fullname);
  
 ucont.find(".go-profile-user-pin").text( user);
 ucont.find(".go-profile-follow-btn")
   .addClass("go-follow-btn-" + user).attr("data-pin", user);
  
  var me=false;
  
 if( user==username){
    me=true;
    ucont.find(".go-profile-camera-icon").css("display","block");
  }
 else if( goAdmin(username) && goPage(user)) {
   ucont.find(".go-profile-camera-icon").css("display","block")
 }
  
  var static_page=goStaticPage( user);
  
  if( static_page){
  	ucont.find(".followership-info").remove();
  }

   
  var uformBtn=ucont.find('.go-profile-update-form-btn');
  var fmCont=ucont.find('.go-profile-message-follow-btn-container');
  
  var emailElem=ucont.find('.go-profile-email');
  var countryElem=ucont.find('.go-profile-country');
  var bioElem= ucont.find('.go-profile-bio');
  var joinedElem=ucont.find('.go-profile-joined' );
  var phoneElem=ucont.find('.go-profile-phone');
  var birthElem=ucont.find('.go-profile-birth');  
 
  var totalFgElem=ucont.find('.go-total-following');  
  var totalFwElem=ucont.find('.go-total-followers');  
  
/*
try{
   var pfile=new android.File( MAIN_FOLDER, username + '/USERS-PROFILES/' + user + '.txt');

  if( pfile.isFile()){
  var p=JSON.parse( pfile.read() );
  var email=p.email||"";
  var country=p.country||"";
  var bio=p.bio||"";
  var phone=p.phone||"";
  var joined=p.joined||"";
  var birth= p.birth||"";
    
if(email  ){
  emailElem.text( email);
}
  
 if(country ){
   countryElem.text( country).css('display','block');
 }
 
 if(bio ) {
   bioElem.html( bio).css('display','block');
}
 

if( phone ){
  phoneElem.text( phone).css('display','block');
}
   

if( joined ) {
   joinedElem.attr('data-joined', joined).text( ( new Date(joined) ).format('mmmm yyyy') );
  if( !goPage(user) ){
    joinedElem.css('display','block');
  }
 }

 if( birth ){
   birthElem.attr('data-birth', birth).text( (  new Date( birth) ).format('mmmm dd')).css('display','block');
   }
  }
 }catch(e){ toast(e); }
  */
  
 if( me || (goAdmin(username) && goPage( user) ) ){
    uformBtn.css('display','inline-block');
 }
    
   ucont.css('display','block');
  
  var pnElem=ucont.find('.go-profile-next-page-number');
  var pageNum=pnElem.val();

/*  
  if( loadingProfilePosts ) {
    return;
  }
*/
  
  if( pageNum=="0"){
     if(!toast_p_once){
  ucont.attr('data-t-once','1');
 //  toast('No more posts!',{type: 'info'});
 }
   return;
  }
  
   
 if ( type=='load'||
     type=='load-once'||
    type=='load-failed-reload'||
    pageNum==""){

   loadingProfilePosts=true;
 
    WAIT_FOR_ME='profile';
   
 var loader=ucont.find('.profile-posts-loading-indicator');
  loader.css('display','block');
   
   if( gpAjax){
     gpAjax.abort();
   }
 
  var post_order=$('#go-page-post-order').val();
   
   gpTimeout=setTimeout( function(){  
  gpAjax= $.ajax({
    url: config_.domain + '/oc-ajax/go-social/profile.php',
    type:'POST',
  // timeout: 40000,
     dataType: "json",
    data: {
      "username": username,
      "user": user,
      "page": pageNum,
      "post_order": post_order,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
  // alert(JSON.stringify(result)) 
 loadingProfilePosts= false;
 WAIT_FOR_ME=false;
   loader.css('display','none');
   
 if( result.not_found ){
      pnElem.val("0");
   return toast( result.not_found, {type:'info'});
  }
    else if( result.no_post ){
   pnElem.val("0");
  
  if( me){
    uformBtn.prop('disabled', false);
}    
      
   return toast( result.no_post, {type:'info'});   
    
    }
 else if( result.status=='success' ){
   var settings=result.settings;

   var real_name=result.real_name||"";
   var country=result.country||"";
   var birth= result.birth||"";
   var bio=result.bio||"";
   var email=result.email||"";
   var phone=result.phone||"";
   var joined=result.joined_on||"";
   
 save_user_profile( user, real_name, email, phone, country ,bio, birth, joined);
    
  if( country){
    countryElem.text( country ).css('display','block');
  }
 
if( email){
   emailElem.text( email );
  }  
   
 if( bio){
   bioElem.html( bio ).css('display','block');
 }
   
   
 if( joined){
   var date=new Date( joined);
  joinedElem.attr('data-joined', joined).text( date.format("mmmm yyyy") );
   if(!goPage(user) ){
     joinedElem.css('display','block');
   }
 }
 
  if( phone) {
    phoneElem.text(  phone).css('display','block');
  }
   
   if( birth){
    var birth_=new Date( birth);
   birthElem.attr('data-birth', birth).text(  birth_.format("mmmm dd") ).css('display','block');
   }
   
   
 totalFgElem.html('<strong>' + abbrNum( +result.total_following,1) + '</strong><small> following</small>');
 totalFwElem.html('<strong>' + abbrNum( +result.total_followers,1) + '</strong><small> followers</small>');
  
   var following=result.me_following;
  
 if( me){
   uformBtn.prop('disabled', false);
}
 else
 {
  var fbtn=  ucont.find('.go-profile-follow-btn');
 
   if( following=="1"){    
  fbtn.removeClass('go-follow-btn').addClass('go-unfollow-btn').text('Following').prop('disabled',false);
   }else if(following==null ){
  fbtn.removeClass('go-unfollow-btn').addClass('go-follow-btn').text('Follow').prop('disabled',false);
 
  if( goAdmin( user) ||goStaticPage( user) ) {
    fbtn.css('display','none');
  }
   
   }
 
 if( following!="0"){
     //If not blocked
   fmCont.css('display','block');
  }
 
 if( siteAdmin( username) && goPage(user)){
   uformBtn.prop('disabled', false);
  }  
 }
   var posts_stadium=ucont.find('.go-profile-posts');
   
 if( following=="0"){
    posts_stadium.html('<div class="text-center">No post to display</div>');
  ucont.find('.go-profile-message-btn').css('display','none');
     return pnElem.val("0");
 }
 
  var has_post=result.has_post;
  
if( has_post && has_post >0 ){
  
  var nextPage=result.next_page;
   pnElem.val( nextPage);
   var posts= result.result;
     posts_stadium.append( display_post( settings, posts) ); 
   }else{   
   pnElem.val("0");
   return toast('No post yet', {type:'info'});
  }
      
if(type=='load-once' ){
  $('#go-profile-page-' + user).on('scroll', function() {
   var scr=$(this).scrollTop() + $(this).innerHeight();
   if(!loadingProfilePosts &&scr >=  $(this)[0].scrollHeight-500) {
      loadingProfilePosts=true;
    go_profile( ucont, user, fullname, 'load' );
    }
  });
}
 
 }
   else if(result.error){
     android.toast.show(result.error );
  }
   else{
     android.toast.show('No more post.');
   }
      
 
 }).fail(function(e,txt,xhr){
      loadingProfilePosts =false;
    WAIT_FOR_ME=false;
      loader.css('display','none')
  //toast('Connection error. ' + xhr, {type:'light',color:'#333'});
  if( txt!='abort'){
    gpTimeout=setTimeout(function(){
       go_profile( ucont,user, fullname, 'load-failed-reload' );
     }, 4000);
  }
  });
  
 },1500);
  }
 }

function viewProfileUpdateForm(){ 
  var zi=zindex();
 $('#go-profile-update-container').css({'display':'block','z-index': zi}); 
  var user=$('#go-current-opened-profile').val();
  if(!user){
    return android.toast.show('Profile not found');
  }
 var cont=$('#go-profile-page-' + user);
  var bio=$.trim(cont.find('.go-profile-bio').text());
  var location=$.trim( cont.find('.go-profile-country').text());
  var phone=$.trim( cont.find('.go-profile-phone').html() );
  var birthElem= cont.find('.go-profile-birth');
  var birth=birthElem.attr('data-birth');
  var name= $.trim( cont.find('.go-profile-fullname').attr('data-name') );
  //userData('fullname');
  
  if( birth){
    birth=birth.split(' ')[0];
  }
  
  $('#go-update-name-box').val( name );
  $('#go-update-bio-box').val(bio);
  $('#go-update-location-box').val(location);
  $('#go-update-phone-box').val(phone);
  $('#go-update-birth-box').val( birth||"");

}

var upAjax;

function goProfileUpdate(t){
 var this_=$(t);
  var name=$.trim( $('#go-update-name-box').val());
  var bio=$.trim( $('#go-update-bio-box').val());
  var location=$.trim( $('#go-update-location-box').val());
  var phone=$.trim( $('#go-update-phone-box').val());
  var birth=$.trim( $('#go-update-birth-box').val() );
  
 bio= bio.replace(/\s+/g,' '); 
  
  if( !validName( name)){
  return android.toast.show('Enter a good name.');
  }
  else if( bio.length>200){
    return android.toast.show('Bio too long. Max 200 characters.')
  }
  else if(phone.length>0 && !phone.match(/^[\+\d]?(?:[\d-.\s()]*)$/) ){
    return android.toast.show('Invalid phone number.');
 }
  else if( location.length> 100){
  return android.toast.show('Location too long.');  
  }
  else if ( birth.length && !birth.match(/^[0-9\/_-]+$/)){
  return android.toast.show('Invalid date of birth.');                                     
  }
 
  var pin=$.trim( $('#go-current-opened-profile').val());
  
  if(!pin){
    return android.toast.show('Profile not found');
  }
  
 var cont=$('#go-profile-page-' + pin);
  
  buttonSpinner( this_);
  
  upAjax= $.ajax({
    url: config_.domain + '/oc-ajax/go-social/update-profile.php',
    type:'POST',
   //timeout: 40000,
    dataType: "json",
    data: {
      "username": username,
      "pin": pin,
      "name": name,
      "bio": bio,
      "location": location,
      "phone": phone,
      "birth": birth,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
  //alert(JSON.stringify(result))
    buttonSpinner( this_, true);
 
  if( result.status=='success'){
   
  
 var veri=checkVerified( pin, name);
  var verified=veri.icon;
     fullname= veri.name;
  var fullname_=fullname + verified;
      
  cont.find('.go-profile-fullname').attr('data-name', name).html( fullname_ );
  cont.find('.go-profile-bio').text(bio).css('display','block');
  cont.find('.go-profile-country').text(location);
  cont.find('.go-profile-phone').html( phone);
 
 var email=$.trim( cont.find('.go-profile-email').text() );
 var joined=$.trim( cont.find('.go-profile-joined').attr('data-joined') );

    
 if( birth){
   var birth_= ( new Date(birth) ).format("mmmm dd")
   cont.find('.go-profile-birth').attr('data-birth', birth).text( birth_).css('display','block');
 }
    else{
      cont.find('.go-profile-birth').css('display','none');
    }

 $('.go-post-fullname-' + pin).attr('data-user-fullname', name);
 $('.go-puser-fullname-' + pin ).html( fullname_);
 
 if( pin==username){
    localStorage.setItem('fullname', name );
   localStorage.setItem('phone', phone );
   localStorage.setItem('location', location);
    $('.go-user-open-profile').attr('data-user-fullname', fullname);
   $('.go-user-fullname').html( fullname_);
  }
  
   $('#go-post-by-pages').removeClass('go-pages-loaded');
   $('#compose-post-container .go-pages').empty();
   
    
  save_user_profile( pin, name, email, phone, location ,bio, birth, joined);
    
    
  toast('Updated',{type:'success'});
    
 }else if( result.error){
     android.toast.show( result.error); 
    }
    else{
      android.toast.show('could not save')
    }
   }).fail(function(e,txt,xhr){
    //alert(JSON.stringify(e))
    buttonSpinner( this_, true);
    android.toast.show("Something went wrong");     
  report__('Error "goProfileUpdate()" in go-social.js', JSON.stringify(e),true );
 
  });
  
}


function goUploadFiles(){
  var fpaths=GO_UPLOAD_FILE_PATHS;
  
 if( fpaths.length<1) return;
   var v=fpaths[0];
  var ext=file_ext(v);
  var filename= v.substr( (v.lastIndexOf('/') +1) );
      filename=filename.split('.')[0];
  var pElem=$('#vid-poster-' + filename);
 
  var file=new android.File( v);
  var file_size=file.length();
  var base64=file.readBase64();
 
  var pCont=$('#go-up-progress-container-' + filename);
  $('#go-up-progress-' + filename).css({ width: "0%"});
  
  setTimeout(function(){
    
  var poster=pElem.val()||"";
  var pDim=  pElem.data("dim");
    
  $.ajax({
   xhr: function() {
      var xhr = new window.XMLHttpRequest();
    // Upload progress     
    xhr.upload.addEventListener("progress", function(evt){
        if (evt.lengthComputable) {
     var percent= (evt.loaded / evt.total)*100;
  
   $('#go-up-progress-' + filename).css({ width: "" + percent + "%"});
    pCont.css('display','block');
   
  if( percent==100){
    $('#go-up-progress-' + filename).css({width:'100%'});
   }
  }
 }, false); 
       return xhr;
    },
    
    "url": config_.domain + '/oc-ajax/go-social/upload-post-file.php',
    "dataType":"json",
    "data":{
     "username" : username,
     "token": __TOKEN__,
     "version": config_.APP_VERSION,
     "base64": base64,
     "video_poster": poster,
     "video_dimension": pDim,
     "file_ext": ext,
 },
 
 type:'POST'
}).done( function(result){
 //alert( JSON.stringify( resp) )
    $('#go-send-post-btn').prop('disabled',false);
  if( result.status=='success'){
    
  var file_obj=new Object();
    file_obj["path"]=result.file_path;
    file_obj["ext"]=result.ext;
    file_obj["width"]=result.width||500;
    file_obj["height"]=result.height||150;
    file_obj["poster"]=result.poster||"";
    file_obj["size"]=result.file_size||file_size;
    
  // var push_=result.file_path + '|' + result.ext +  (result.poster? '|' + result.poster:'');
  
   GO_UPLOADED_FILE_PATHS.push( file_obj) //.push( push_);
   GO_UPLOAD_FILE_PATHS =$.grep( GO_UPLOAD_FILE_PATHS, function(value) {
   return value != v;
 });
   
  $('#go-send-post-btn').click();
    
  }else if( result.error){
   var ecode=result.ecode;
  
 //if( ecode==="3" || ecode==="2"||ecode==="0"){
   $("#close-upbtn-" + filename).click();
 // }
    toast( result.error);
    closeDisplayData(".dummy-dummy");
    $("#post-progress").empty();
  }
  else{
     toast("Unknown error occured");
    $("#post-progress").empty();
  }
    
  }).fail(function(e,txt,xhr){
     //alert( JSON.stringify(e));
    $("#go-send-post-btn").prop("disabled", false);
     closeDisplayData(".dummy-dummy");
    $("#post-progress").empty();
    android.toast.show("Something went wrong");     
  report__('Error "goUploadFiles()" in go-social.js', JSON.stringify(e),true );
 
  });
  },2000); 
  
}

function togglePostLinkForm(){
 $('#go-post-link-form').toggle();
}


function goOpenVideo(t){
  var this_= $(t);
   var vid=this_.data('vid');
   var fdload=this_.data('fdload');
  var sourceUrl=$.trim(this_.data('source-url'));
  var dUrl=$.trim(this_.data('durl'));
  var fsize=$.trim( this_.data('fsize'));
  
  var poster=this_.data('poster');
 
 var data='<figure style="display: none;" id="' + vid + '-video-container" class="go-video-container" data-chatid="' + vid + '">';
     data+='<video id="' + vid + '-video" class="video-tag" data-chatid="' + vid + '" poster="' + poster + '" controls preload="true" data-fsize="' + fsize + '" data-durl="' + dUrl + '" src="' + sourceUrl + '#t=0.1">';
     data+='</video>';
     data+='</figure>';

 $('.go-video-container').css('display','none');
  
 if( !$('#' + vid + '-video-container').length) {
    $('#go-video-element-container').append(data);
    go_mediaplayer_( $('#' + vid + '-video'), fdload );
  }
    
  $('#' + vid + '-video').trigger('play');
setTimeout(function(){
  $('#go-video-element-container, #' + vid + '-video-container').css('display','block');
 },150);
}

function go_mediaplayer_($elem, fdload){

  $elem.mediaelementplayer({
  defaultVideoWidth: "100%",
  defaultVideoHeight: "100%",
   videoWidth: 250, /*250,*/
  videoHeight: 230, /*230*/
  hideVideoControlsOnLoad: true,
  clickToPlayPause: true,
  controlsTimeoutDefault: 2000,
  features: ["playpause","current", "progress", "duration"],
  enableKeyboard: false,
  stretching: "none",
  pauseOtherPlayers: true,
  ignorePauseOtherPlayersOption: false,
  hideVolumeOnTouchDevices:true,
  
  success: function(media, originalNode, instance) {
   var node=$(originalNode);
   var chatid=node.data("chatid");
     go_enableVideoFullScreen( node, chatid, fdload);
    
 media.addEventListener('loadedmetadata',function(){
  //go_enableVideoFullScreen( node);
 });
    
  media.addEventListener('play',function(e){
    go_enableVideoFullScreen( node, chatid, fdload);
  });  
   
 },
  error: function(){
    go_exitVideoFullScreen(true);
    android.toast.show("Unable to load");
  }
});
}


function go_enableVideoFullScreen(node_,chatid, fdload){ 
  var allow_download=false;
   try{
    var settings= JSON.parse( localStorage.getItem("server_settings") );
  
  if( siteAdmin( username) || settings.go_enable_download=="YES"){
      allow_download=true;
  }
  
 }catch(e){}
  
  if( node_.hasClass('video-tag') ){
    var vsrc=node_.attr('src');
    var durl=node_.attr('data-durl');
    var fsize=node_.attr('data-fsize');
    
    var cont=node_.parent().closest('.mejs__container');
    cont.addClass('mejs__custom-fullscreen go-watching-video watching-video-' + chatid)
  
 if( allow_download && fdload=='1'){
   cont.append('<button class="save-media-btn save-video-btn" data-src="' + durl + '" data-fsize="' + fsize+ '" onclick="go_save_video(this);">' + readableFileSize( fsize, true, 0) + ' <img src="file:///android_asset/go-icons/save-media.png"></button>');
 }
      cont.removeAttr('style');
      cont.attr('data-wvchatid',chatid);
      cont.find('.mejs__overlay,.mejs__layer').css({width:'100%',height:'100%'});
  }  
}


function go_exitVideoFullScreen(remove_){
  $("video").trigger("pause");
  $("#go-video-element-container,.go-video-container").css("display","none");
 
 var fs=$('.mejs__custom-fullscreen');
 var vid=fs.attr('data-wvchatid');  
  /*
  fs.find('.mejs__overlay,.mejs__layer').css({width:340,height:160});
   fs.css({height:160}).removeClass('mejs__custom-fullscreen go-watching-video watching-video-' + vid);
  */
if( remove_){
   $('#' + vid + '-video-container').remove();
 }
  
}


//SAVE POST 
 
function goSavePost(t){

 var this_=  $(t);
 var pid= this_.data('pid');
 var post_by=this_.data('post-by');
 var true_author=this_.data('true-author');
 var pbf=this_.data('pbf');

 closeDisplayData('.post-options-div');
  if( !pid||!post_by){
    return toast('Missing pid parameter.');
  }
 var ptext=$.trim( $('.go-post-preview-'+ pid + ':first').text() ); 
var stime= moment().unix();
    
 var obj=new Object();
 obj.action='open';
 obj.action_id=pid;
 obj.action_type='post';
 obj.post_by=post_by;
 obj.true_author=true_author;
 obj.pbf=pbf; //post by fullname
 obj.preview=( ptext||"").substr(0,60).replace(/</g,"&lt;").replace(/>/g,"&gt;") + '...';
 obj.time= stime;
     
try{
  var sdir=new android.File(PUBLIC_FOLDER, username +'/GO-SAVED-POSTS');
    if( !sdir.isDirectory() && !sdir.mkdirs()){
    return toast('Unable to save');
  }
  

var sfile=new android.File( sdir , pid);  
var sfile_=new android.File( sdir , "saved-post-id.txt");  

if( sfile.isFile() ){
   return android.toast.show("Already saved");
 }
  else if( sfile.write( JSON.stringify(obj)) ){
   sfile_.append( pid + " ");
    toast("Saved",{type:"info"});   
  }
 else{
  toast("Unable to save");
}
  }catch(e){
 logcat('function #go-save-post-btn: go-social.js', e) 
   }
    
}


function openSavedPosts(){
  goCloseComment();
  var cont=$('#go-saved-posts');
 
  $('#go-saved-posts-container').fadeIn();
  
  var ndir=new android.File(PUBLIC_FOLDER, username +'/GO-SAVED-POSTS');
  
  if(!ndir.isDirectory() ){
  return cont.html('<div class="text-center">No saved items</div>');

  }
  
  
  var sfile_=new android.File( ndir , "saved-post-id.txt");  

  if(!sfile_.isFile()){
    return cont.html('<div class="text-center">No saved items</div>')
  }
  
  var files= $.trim( (sfile_.read()||""));
   
  
  
  if( !files ){
   return cont.html('<div class="text-center">No saved items</div>');
  }
  files=files.split(" ");
  
  var total= files.length;
  
   var result='<div class="container-fluid">';
 
  // files=sortNumbers(files, true);
    
  files.reverse();
  
   var d="";
  
  for( var i=0; i<total; i++){   
    var filename=files[i];
    var file=new android.File(ndir, filename);
  
  if( i<100){
    
    var data=$.trim( file.read() );
  
 if( data){
    var meta=JSON.parse( data);
   //var meta= JSON.parse( data.meta);
   
   var author=meta.post_by||"";
   var action=meta.action;
   var type = meta.action_type;
   var aid  = meta.action_id;
   var pbf  = meta.pbf;
   var time_= meta.time;
       
     d+='<div class="row" id="go-saved-' + filename + '">';
     d+='<div class="col p-0 w-60" styl="max-width: 60px;">';
     d+='<div style="margin: 5px auto; width: 45px; height: 45px; overflow: hidden; border:0; border-radius: 100%;">';
     
   d+= go_user_icon( author, "go-saved-post-icon");
    
     d+='</div>';
     d+='</div>';
     d+='<div class="col" onclick="openSavedPost_(this);" data-file="' + filename + '" data-author="' + author + '" data-action="' + action + '" data-action-type="' + type + '" data-action-id="' + aid + '">';
     d+='<div style="text-transform: capitalize;"><strong>' + pbf + '\'s post</strong></div>' + meta.preview;
     d+='<div class="go-notifications-time">' + timeSince( time_) + '</div>';
     d+='</div>';
     d+='<div class="col text-center" onclick="delSavedPost(this);" data-file="' + filename + '" style="max-width: 60px; overflow: hidden;">';
     d+='<img class="icon-normal" src="file:///android_asset/go-icons/delete2.png">';
     d+='</div>';
     d+='</div>';
  }
      }
    else{
  try{
    file.delete();  
  }catch(e){
   
  }
      
    }
    
  }
  result+= d;
  result+='</div>';
    
  cont.html(result);
 
}



function openSavedPost_(t){
  var this_=$(t);
  var action = this_.data('action');  
  var type = this_.data('action-type'); 
  var aid = this_.data('action-id');   
  var file = this_.data('file');   
  
 if( action=="open"){   
  if( type =="post" ){
  var elem=$('<div/>').addClass('go-open-single-post')
      .attr('data-pid', aid);
    elem.appendTo('body').click();

  }
 }
     
  }
 
 function delSavedPost(t){
  var this_=$(t);
  var file = this_.data('file');
 
   try{
     
  var ndir= new android.File( PUBLIC_FOLDER, username + '/GO-SAVED-POSTS');
  var nfile=new android.File(ndir, file);
 
   var sfile_=new android.File( ndir , "saved-post-id.txt");  

  if( !sfile_.isFile() ){
    return toast("Saved datas not found");
 }
  
  var data= sfile_.read();
   data=data.replace( file + " ","");
   sfile_.write( data);
   
   var elem=$('#go-saved-' + file);

    nfile.delete();
    elem.remove();
  }catch(e){
  logcat('function delSavedPost() go-social.js', e);
 }

}
  

function notifications_(results_) {  
   var total_results= results_.length;
     if( !total_results  ) return;
   
  var ndir=new android.File( MAIN_FOLDER, username +'/GO-NOTIFICATIONS');

 if( !ndir.isDirectory() && !ndir.mkdirs()){
   return toast('Could not create notiDir.');
 }
    $.each( results_,function(i,v){
     var mt=+v.message_time;
     var nid=v.id;
      localStorage.setItem( SITE_UNIQUE__ + "_" + username + '_last_notification_check_id', nid);
     var nfile=new android.File( ndir, mt);
   nfile.write( JSON.stringify(v) );
   
  });
  
  var elem=$('#total-new-notifications');
  var curr=+elem.attr('data-total');

   var total= total_results+curr;
   var tt=total;
    if( tt>99){
      tt='99+'; }
  localStorage.setItem( username + '_total_new_notifications', total + '/' + tt);
  elem.attr('data-total', total).text( tt ).css('display','inline-block');
}


function fetchNotifications(){
  
  if( localStorage.getItem("is_fetching_messages")
     ||localStorage.getItem("is_sending_messages")
     ||loadingPosts
     ||searchingPosts){
    setTimeout( function(){
      fetchNotifications();
    },5000);
  return;
  }
  
  var check_freq=go_config_.notif_check_freq;
       
  var last_check=localStorage.getItem(SITE_UNIQUE__ + "_" +username + "_last_notification_check_id")||"fresh";
   loadingNotificationsPosts=true;
  
  loadingNotificationAjax = $.ajax({
    url: config_.domain + '/oc-ajax/go-social/notifications.php',
    type:'POST',
   timeout: 15000,
    dataType: "json",
    data: {
      "username": username,
      "last_check_nid": last_check,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
//  alert(JSON.stringify(result))  
    loadingNotificationsPosts= false;
   var st= result.server_time||moment().unix();
  
  
  if( result.last_nid  ){

  localStorage.setItem( SITE_UNIQUE__ + "_" + username + "_last_notification_check_id",  result.last_nid );
   }
  else  if( result.status=='success' && result.result ){
   notifications_( result.result);
   }
  
 setTimeout(function(){
     fetchNotifications();
  }, check_freq );
    
  }).fail(function(e,txt,xhr){
   // alert( JSON.stringify(e));
    loadingNotificationsPosts= false;
   setTimeout(function(){
     fetchNotifications()
   }, 20000);
  });
  
}

function openNotifications(){
  goCloseComment();
  $('#total-new-notifications').attr('data-total',0).text(0).css('display','none');
  $('#go-notifications-container').fadeIn();
  localStorage.removeItem(username + '_total_new_notifications');
  var ndir=new android.File(MAIN_FOLDER, username +'/GO-NOTIFICATIONS');
  var cont=$('#go-notifications');
 
  if(!ndir.isDirectory() ){
    return cont.html('<div class="text-center">No notification</div>');
  }
  
  var files=ndir.list();
  var total=files.length;
 
  
  if( !total ){
   return cont.html('<div class="text-center">No notification</div>');
  }
  
   var result='<div class="container-fluid">';
       files=sortNumbers(files, true);
    
   var d="";
  for( var i=0; i<total; i++){
    
    var filename=files[i];
    var file=new android.File(ndir, filename);
  if( i<100){
    
    var data=$.trim( file.read() );
  
    if( data){
      data=JSON.parse( data);
   var meta= JSON.parse( data.meta);
   var author=meta.author||"";
   var action= meta.action;
   var type= meta.action_type;
   var aid= meta.action_id;
   var aid2=meta.action_id_2||"";
   var post_by=meta.post_by||"";
    
   var status=meta.status;
     
     d+='<div class="row go-un-' + filename + ' ' + (status?'go-unread-notification':'') + '">';
     d+='<div class="col" style="max-width: 60px;">';
     d+= go_user_icon( author,'go-notifications-user-icon' );
     d+='</div>';
     d+='<div class="col go-open-notification" onclick="openNotification_(this);" data-post-by="' + post_by + '" data-file="' + filename + '" data-author="' + author + '" data-action="' + action + '" data-action-type="' + type + '" data-action-id="' + aid + '" data-action-id-2="' + aid2 + '">';
     d+= data.message.replace(/\B@([\w- ]+)@/gi,'<span class="go-notification-names">$1</span>');
     d+='<div class="go-notifications-time">' + timeSince( data.message_time) + '</div>';
     d+='</div>';
     d+='<div class="col go-delete-notification text-center" data-file="' + filename + '" style="max-width: 60px;" onclick="delNotification(this);">';
     d+='<img class="icon-normal" src="file:///android_asset/go-icons/delete2.png">';
     d+='</div>';
     d+='</div>';
   }
      }
    else{
  try{
    file.delete();  
  }catch(e){}
      
    }
    
  }
  result+= d;
  result+='</div>';
    
  cont.html(result);
 }


function openNotification_(t){
  var this_=$(t);
  var action = this_.data('action');  
  var type = this_.data('action-type'); 
  var aid = this_.data('action-id');
  var aid2 = this_.data('action-id-2'); //comment reply
  var post_by = this_.data('post-by'); //comment reply

  var file = this_.data('file');   
  
 if( action=="open" ){   
  
 if( type =="post" ){
  var elem=$('<div/>').addClass('go-open-single-post')
      .attr('data-pid', aid);
    elem.appendTo('body').click();
    
  }else if( type=="follow"){
   //data+='<span class="highlight comment-author go-open-profile friend-' + author_ + '" data-user-fullname="' + author + '" data-user="' + author_ + '">' + strtolower( fullname) + ' ' + icon + '</span>' ;
  var elem=$("<div/>").addClass("go-open-profile")
  .attr("data-user-fullname", aid )
  .attr("data-user", aid);
    
   elem.appendTo('body').click();
  }
   else if( type=="comment-reply" && aid2 && post_by){
    $('#current-post-id').val(aid);
    $('#current-post-by').val(post_by )
   $('#go-view-orig-post').css('display','block');
    
  var elem=$('<div/>').attr('data-parent-id', aid2)
  .on('click',function(){
    replyComment(this);
  });
   elem.appendTo('body').click();
   
  }
   
 }
   
 var elem=$('.go-un-' + file);
   if( elem.hasClass('go-unread-notification')){
  var nfile=new android.File(MAIN_FOLDER, username +'/GO-NOTIFICATIONS/' + file);
    try{
      var data=$.trim( nfile.read()  ).replace('??','');
   nfile.write( data);
   }catch(e){}
     elem.removeClass('go-unread-notification'); 
  }
}
 
 function delNotification(delBtn){
  var this_=$(delBtn);
  var file = this_.data('file');   
  var nfile=new android.File(MAIN_FOLDER, username +'/GO-NOTIFICATIONS/' + file);
  var elem=$('.go-un-' + file);
  try{
    nfile.delete();
    elem.remove();
  }catch(e){
  logcat('function delNotification() go-social.js', e);
  }
 }
  


//VIEW FOLLOWERS
var lfAjax,lfTimeout,loadingFollowers,toast_f_once;
  
function viewFollowers( refresh){
  $('#go-followers-container').fadeIn();
  loadFollowers();
  }

function loadFollowers_( data){
   var d='<div class="container-fluid">';
  
  $.each(data,function(i,v){
     var user=v.follower||"";
     var fullname=v.real_name||user;
  
  var veri=checkVerified(user, fullname);
  var verified=veri.icon;
      fullname= veri.name;
  var fullname_=fullname + verified;
    
    
     var status=v.status;
     var bio=v.bio||"";
    if( bio.length>60 ){
      bio=bio.substr(0,80) + '...';
    }
    var type='block';
    var btext='Block';
    if( status=='0'){
      type='unblock';
      btext='Unblock';
    }
    
    d+='<div class="row">';
     d+='<div class="col" style="max-width: 60px;">';
     d+= go_user_icon( user,'go-followers-user-icon' );
     d+='</div>';
     d+='<div class="col go-open-profile" data-user="' + user+ '" data-user-fullname="' + fullname + '">';
     d+='<div class="go-followers-name">' +  fullname_ + '</div>';
     d+='<div class="go-followers-bio">' +  bio + '</div>';
     d+='</div>';
     d+='<div class="col" style="max-width: 120px; text-align: center;">';
     d+='<button onclick="blockUnblockFollower(this);" class="go-followers-block-btn go-bf-btn-' + user + '" data-type="' + type + '" data-pin="' + user + '">' + btext + '</button>';
     d+='</div>';
     d+='</div>';
  });
    d+='</div>';
  
 $('#go-followers').append( d);
}


function loadFollowers( refresh){
  goCloseComment();

  var pnElem=$('#go-followers-next-page-number');
  var pageNum=pnElem.val();
   
/*
if( loadingFollowers ){
    return;
  } else  
*/
    if( refresh ){
    toast_f_once=false;
    pageNum="";
    displayData('<div class="text-center" style="padding-top: 30px;"><img class="w-40 h-40" src="file:///android_asset/loading-indicator/loading2.png"></div>',{ data_class:'.home_refresh', no_cancel: true});
  }
  
  
  if( !refresh && pageNum=="0"){
   if( !toast_f_once ){
     toast_f_once=true;
   //  toast('That is all for now.',{type: 'info'});
   }
    return;
   }
  
  loadingFollowers=true;
 
  var loader=$('#go-followers-loading-indicator');
  loader.css('visibility','visible');
  
 lfTimeout=setTimeout(  function(){
  lfAjax=$.ajax({
    url: config_.domain + '/oc-ajax/go-social/view-followers.php',
    type:'POST',
  // timeout: 30000,
     dataType: "json",
    data: {
      "username": username,
      "page": pageNum,
      "version": config_.APP_VERSION,
      "token": __TOKEN__,
    }
  }).done(function(result){
   //alert(JSON.stringify(result));
      loadingFollowers=false;  
      loader.css('visibility','hidden');
    if( refresh ){
     closeDisplayData('.home_refresh'); 
    }
    $('#nfw__').remove();
 if( result.no_follower){
   $('#go-followers').html('<div id="nfw__" class="text-center">' + result.no_follower +'</div>' );
  // return toast( result.no_follower,{type:'info'});
  } 
    else  
  if( result.status=='success' ){
    var posts= result.result;
    var nextPage=result.next_page;
    pnElem.val( nextPage );
  loadFollowers_( result.result);
 
 }
   else if(result.error){
toast(result.error );
  }
   else toast('No more followers.',{type:'info'});
 
 }).fail(function(e,txt,xhr){
   loadingFollowers=false;
  //  loader.css('display','none');
  //toast('Connection error. ' + xhr, {type:'light',color:'#333'});
  if( refresh ){
     closeDisplayData('.home_refresh');
    return;
    }
    
    lfTimeout=setTimeout(function(){
       loadFollowers(); },4000);
  });
    
  },1000);
}


//FOLLOWING
var lfgAjax,lfgTimeout,loadingFollowing,toast_fg_once;
  
function viewFollowing(refresh){
  $('#go-following-container').fadeIn();
  loadFollowing(refresh);
  }


function loadFollowing_( data){
   var d='<div class="container-fluid">';
  
  $.each(data,function(i,v){
     var user=v.following||"";
    var fullname=v.real_name||user;
     var bio=v.bio||"";
    if( bio.length>60 ){
      bio=bio.substr(0,80) + '...';
    }
  var veri=checkVerified(user, fullname);
  var verified=veri.icon;
      fullname= veri.name;
  var fullname_=fullname + verified;
    
    d+='<div class="row">';
     d+='<div class="col" style="max-width: 60px;">';
     d+= go_user_icon( user,'go-followers-user-icon' );
     d+='</div>';
     d+='<div class="col go-open-profile" data-user="' + user+ '" data-user-fullname="' + fullname + '">';
     d+='<div class="go-followers-name">' +  fullname_ + '</div>';
     d+='<div class="go-followers-bio">' +  bio + '</div>';
     d+='</div>';
     d+='<div class="col" style="max-width: 120px; text-align: center;">';
     d+='<button class="go-unfollow-btn go-follow-btn-' + user + '" data-pin="' + user + '">Following</button>';
     d+='</div>';
     d+='</div>';
  });
    d+='</div>';
  
 $('#go-following').append( d);
}



function loadFollowing( refresh){
  //People you follow
  goCloseComment();

  var pnElem=$('#go-following-next-page-number');
  var pageNum=pnElem.val();
   
/*
if( loadingFollowing ){
    return;
  } else  
  */
  if( refresh ){
    toast_fg_once=false;
    pageNum="";
    displayData('<div class="text-center" style="padding-top: 30px;"><img class="w-20 h-20" src="file:///android_asset/loading-indicator/loading2.png"></div>',{ data_class:'.home_refresh', no_cancel: true});
  }
  
  
  if( !refresh && pageNum=="0"){
   if( !toast_fg_once ){
     toast_fg_once=true;
   //  toast('That is all!.',{type: 'info'});
   }
    return;
   }
  
  loadingFollowing=true;
 
  var loader=$('#go-following-loading-indicator');
  loader.css('visibility','visible');
  
lfgTimeout=setTimeout(  function(){
  lfgAjax=$.ajax({
    url: config_.domain + '/oc-ajax/go-social/view-following.php',
    type:'POST',
 //  timeout: 30000,
     dataType: "json",
    data: {
      "username": username,
      "page": pageNum,
      "version": config_.APP_VERSION,
      "token": __TOKEN__,
    }
  }).done(function(result){
   //alert(JSON.stringify(result));
      loadingFollowing=false;  
      loader.css('visibility','hidden');
   $('#nf__').remove();
 if( result.no_following){
   $('#go-following').html( '<div id="nf__" class="text-center">' + result.no_following +'</div>' );
  // return toast( result.no_follower,{type:'info'});
  } 
    else  
  if( result.status=='success' ){
    var posts= result.result;
    var nextPage=result.next_page;
    pnElem.val( nextPage );
  loadFollowing_( result.result);
 
 }
   else if(result.error){
toast(result.error );
  }
   else toast('That is all!',{type:'info'});
 
 }).fail(function(e,txt,xhr){
   loadingFollowing=false;
  //  loader.css('display','none');
 // android.toast.show('Something happened! Please try again. ' + xhr );
  
  lfgTimeout=setTimeout(function(){
       loadFollowing(); },6000);
  });
    
  },1000);
}


//BLOCKED FOLLOWERS
var lbfAjax,lbfTimeout,loadingBFollowers,toast_bf_once;
  
function viewBlockedFollowers(refresh){
  $('#go-blocked-followers-container').fadeIn();
  loadBlockedFollowers(refresh);
  }


function loadBlockedFollowers_( data){
   var d='<div class="container-fluid">';
  
  $.each(data,function(i,v){
     var user=v.follower||"";
    var fullname=v.real_name||user;
     var bio=v.bio||"";
    if( bio.length>60 ){
      bio=bio.substr(0,80) + '...';
    }
 var veri=checkVerified(user, fullname);
  var verified=veri.icon;
      fullname= veri.name;
  var fullname_=fullname + verified;
    
    d+='<div class="row">';
     d+='<div class="col" style="max-width: 60px;">';
     d+= go_user_icon( user,'go-followers-user-icon' );
     d+='</div>';
     d+='<div class="col go-open-profile" data-user="' + user+ '" data-user-fullname="' + fullname + '">';
     d+='<div class="go-followers-name">' +  fullname_ + '</div>';
     d+='<div class="go-followers-bio">' +  bio + '</div>';
     d+='</div>';
     d+='<div class="col" style="max-width: 120px; text-align: center;">';
     d+='<button onclick="blockUnblockFollower(this);" class="go-followers-block-btn go-bf-btn-' + user + '" data-type="unblock" data-pin="' + user + '">Unblock</button>';    
     d+='</div>';
     d+='</div>';
  });
    d+='</div>';
  
 $('#go-blocked-followers').append( d);
}


function loadBlockedFollowers( refresh){
  goCloseComment();

  var pnElem=$('#go-blocked-followers-next-page-number');
  var pageNum=pnElem.val();
   
/*
if( loadingBFollowers ){
    return;
  } else  
  */
    if( refresh ){
    toast_bf_once=false;
    pageNum="";
    displayData('<div class="text-center" style="padding-top: 30px;"><img class="w-20 h-20" src="file:///android_asset/loading-indicator/loading2.png"></div>',{ data_class:'.home_refresh', no_cancel: true});
  }
  
  if( !refresh && pageNum=="0"){
   if( !toast_bf_once ){
     toast_bf_once=true;
   //  toast('That is all!.',{type: 'info'});
   }
    return;
   }
  
  loadingBFollowers=true;
 
  var loader=$('#go-blocked-followers-loading-indicator');
  loader.css('visibility','visible');
 
lbfTimeout=setTimeout(  function(){
  lfgAjax=$.ajax({
    url: config_.domain + '/oc-ajax/go-social/view-blocked-followers.php',
    type:'POST',
  // timeout: 30000,
     dataType: "json",
    data: {
      "username": username,
      "page": pageNum,
      "version": config_.APP_VERSION,
      "token": __TOKEN__,
    }
}).done(function(result){
   //alert(JSON.stringify(result));
      loadingBFollowers=false;  
      loader.css('visibility','hidden');
  $('#nb__').remove();
 if( result.no_blocked){
   $('#go-blocked-followers').html( '<div id="nb__" class="text-center">' + result.no_blocked + '</div>');
    } 
    else  
  if( result.status=='success' ){
    var posts= result.result;
    var nextPage=result.next_page;
    pnElem.val( nextPage );
  loadBlockedFollowers_( result.result);
 
 }
   else if(result.error){
toast(result.error );
  }
   else toast('That is all!',{type:'info'});
 
 }).fail(function(e,txt,xhr){
   loadingBFollowers=false;
  //  loader.css('display','none');
 // android.toast.show('Something happened! Please try again. ' + xhr );
  
  lbfTimeout=setTimeout(function(){
       loadBlockedFollowers(); },6000);
  });
    
  },1000);
}


var bfTimeout, bfAjax,b_u_block;

function blockUnblockFollower(t){
  if( b_u_block){
   return android.toast.show('Please be patient');
 }
  
  var this_=$(t);
  var pin=this_.data('pin');
  var type=this_.attr('data-type');
 
  this_.prop('disabled', true);
  buttonSpinner(this_);
  
   b_u_block=true;
  
 bfTimeout=setTimeout(  function(){
  bfAjax=$.ajax({
    url: config_.domain + '/oc-ajax/go-social/block-follower.php',
    type:'POST',
  // timeout: 30000,
     dataType: "json",
    data: {
      "username": username,
      "pin": pin,
      "type": type,
      "version": config_.APP_VERSION,
      "token": __TOKEN__,
    }
  }).done(function(result){
   //alert(JSON.stringify(result));
   this_.prop('disabled', false);
  buttonSpinner(this_,true);
  b_u_block=false;
  if( result.status=='success' ){
    var elem=$('.go-bf-btn-' + pin );
    elem.text( result.result);
    if( type=='block'){
     elem.attr('data-type', 'unblock');
    }else{
     elem.attr('data-type', 'block'); 
    }
 }
   else if(result.error){
toast( result.error );
  }
   else{
     android.toast.show('Something went wrong. Try again.');
   }
    
  }).fail(function(e,txt,xhr){
    this_.prop('disabled', false);
    b_u_block=false;
    buttonSpinner(this_,true);
  android.toast.show("Something went wrong");     
  report__('Error "blockUnblockFollowers()" in go-social.js', JSON.stringify(e),true );
 
  });
 },1000);
    
}


function closeComposePage( noconfirm){
  var info='Dispose post?\n\n If you dispose now, you will lose this post or better still copy your text.';
  
 if( !noconfirm && GO_UPLOAD_FILE_PATHS.length ){
   if( !confirm('If you dispose now, you will lose appended files') ) return;
  }
  var tb=$('#compose-post-box');
  var text=$.trim(tb.val());
  
if(!noconfirm && text.length){
  //if( !confirm(info) ) return;
 }
 
  GO_UPLOAD_FILE_PATHS=[];
  GO_UPLOADED_FILE_PATHS=[];
  
  tb.val('');
  sessionStorage.removeItem('go_is_sending_post');
  $('#go-repost-data').val("");
  $('#go-upload-preview-container,#go-repost-highlight').empty();
  $('#compose-post-container').css('display','none');
  $('#compose-post-container .go-repost-hide').css('display','block');
}


function closeNotifications(){
  $('#go-notifications-container').css('display','none');  
}

function closeSavedPosts(){
  if( $('#go-single-post-container').is(':visible')){
   return closeSinglePost(); 
 }
  $('#go-saved-posts-container').css('display','none');  
}

function closeViewFollowers(){
  $('#go-followers-container').css('display','none');  
clearTimeout( lfTimeout);
  if(lfAjax) lfAjax.abort();
}

function closeViewFollowing(){
  $('#go-following-container').css('display','none');  
clearTimeout(lfgTimeout);
  if(lfgAjax) lfgAjax.abort();
}

function closeViewBlockedFollowers(){
  $('#go-blocked-followers-container').css('display','none');  

  clearTimeout(lbfTimeout);
  if(lbfAjax) lbfAjax.abort();
}

function goCloseProfile(){
 clearTimeout( gpTimeout);
 if(gpAjax) gpAjax.abort();
  loadingProfilePosts=false;
  var pcont=$('#go-profile-container');
  var pIndex=+pcont.css('z-index');
  var spcont=$('#go-single-post-container');
  var spIndex=spcont.css('z-index');            
    
 if( spcont.is(':visible') ){
// return  $('#go-single-post-container').css('z-index','45');
  if( spIndex>pIndex){
   return closeSinglePost(); 
  }
 }
  var user=$('#go-current-opened-profile').val();
  var ucont=$('#go-profile-page-' + user);
  var loader=ucont.find('.profile-posts-loading-indicator');
  loader.css('display','none');
  return  pcont.css('display','none');
}

function closeMenus(){
  toggleLeftSidebar();
 //$('#go-menus-container').addClass('hide-menus');
}

function closeRightMenus(){
  toggleRightSidebar();
 //$('#go-rmenus-container').addClass('hide-rmenus');
}


function closeSinglePost(){
  $('#go-single-post-container').css('display','none');
  $('#go-single-post').empty();
}

function closeFollowForm(){
  $('#go-follow-container').css('display','none');
}

function closeProfileUpdateForm(){
  $('#go-profile-update-container').css('display','none');
}

function closeFullPhoto(){
  $('meta[name=viewport]').remove();
  $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0">');
  $('#go-full-photo-div').empty();
  $('#go-full-photo-container').css('display','none');
  
setTimeout(function(){
  $('meta[name=viewport]').remove();
  $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2.0">'); 
 },1000);
  
   android.webView.enableZoom(false);
}

function closeFullCoverPhoto(){
  $('meta[name=viewport]').remove();
  $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0">');
  $('#go-full-cover-photo-container').empty().css('display','none');

 setTimeout(function(){
  $('meta[name=viewport]').remove();
  $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2.0">'); 
 },1000);
  
   android.webView.enableZoom(false);
}


function closeSearch(){
  $('#go-search-container').css('display','none');
 // $('#go-searched-posts').empty();
  clearTimeout(spTimeout);
  if(spAjax) spAjax.abort();
}

function closeGoSocial(){
  localStorage.removeItem('go_social_opened');
  android.activity.finish();
}

function closeCreatePageForm(){
  $('#go-create-page-form-container').css('display','none')
}



function closeRequestApp(){
  $('#go-request-app-container').css('display','none');  
}



function removeFromUploadList(val_, vid){
  GO_UPLOAD_FILE_PATHS = jQuery.grep( GO_UPLOAD_FILE_PATHS, function(value) {
  return value != val_;
});
}


function go_captureVideoPoster(video, dimensions,divide){
 video.pause();
  
  divide=divide||1
  var canvas = document.createElement("canvas");
// scale the canvas accordingly
  var oriWidth= dimensions[0]; //video.videoWidth;
  var oriHeight=dimensions[1]; //video.videoHeight;
  
 var width=oriWidth/divide;
 var perc=(width*100)/oriWidth;
 var height=(perc/100)*oriHeight;
 
var dur=video.duration;
  
  if( dur<1 ){
    return '';
  }
 
  canvas.width = width; 
  canvas.height =height; 
// draw the video at that frame
  var ctx=canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
// convert it to a usable data URL
 var dataURL = canvas.toDataURL("image/jpeg",0.8);
  var data=dataURL.split(',');
  if( data.length>0 ) data=data[1];
  else data=data[0];
  
 if( data){
   return [data,[width,height],];
 }
}


document.addEventListener("goImportPostFilesCompleted", function(evt){
  //Profile picture Coming From Gallery  
  var fpaths=evt.detail.file_paths;
 // var path=evt.detail.path;
  
   var allow_vid=false;
   
 try{
  var settings= JSON.parse( localStorage.getItem("server_settings") );
  var adm= siteAdmin( username);
   if( !adm && settings.enable_file_upload!="YES"  ){
   return toast("Upload disabled");
  } 
 if( adm || settings.enable_vid_doc=="YES"  ){
   allow_vid=true;
  } 
  
 var max_file_size=+settings.max_upload_size||1;
  
 }catch(e){ 
  return toast("Loading settings...", { type:"info"});
 }
  
  if( fpaths.length<1){
    return toast('Check file size.');
  }
  fpaths=fpaths.reverse();
  
  GO_UPLOAD_FILE_PATHS=[];
 
  var cont=$('#go-upload-preview-container');
  
   $.each( fpaths,function( i, v){
     if( i<go_config_.max_files){
       
   var ext=strtolower( file_ext( v)||"");
   var filename= v.substr( (v.lastIndexOf('/') +1) );
       filename=filename.split('.')[0];
     var cid= filename; //randomString(5);
     var data="";
       
   var file=new android.File(v);
   var file_size=file.length()||1;
   var size=file_size/1048576;
   
       if( ext=='jpg'){
      
    if( size< max_file_size ) {
      
     GO_UPLOAD_FILE_PATHS.push(v);
         data='<div id="uppc-' + cid + '" data-swid="' + i + '" onclick="swapIt(this)" data-fpath="' + v + '" class="go-upload-photo-preview-container">';
         data+='<img class="go-upload-photo-preview" src="' + v + '?i=' + randomString(3) + '">';
         data+='<span data-findex="' + i + '" data-fpath="' + v + '" data-cid="uppc-' + cid + '" class="go-remove-upload-preview" id="close-upbtn-' + cid + '">x</span>';
         data+='<span id="go-up-progress-container-' + filename + '" class="go-up-progress-container">';
         data+='<span id="go-up-progress-' + filename + '" class="go-up-progress"></span>';
         data+='</span>';
         data+='</div>';
     cont.append( data);
    }else{
      
    toast('One or more photos are too large.');
      
    }
      
  }else if( allow_vid && ext=="mp4"){
    
    if( size< max_file_size ) {
    GO_UPLOAD_FILE_PATHS.push(v);
    var poster="file:///android_asset/go-icons/bg/black.png";
  
         data='<div id="uppc-' + cid + '" data-swid="' + i + '" data-fpath="' + v + '" class="go-upload-video-preview-container">';
         data+='<div id="uppc-cover-' + cid + '" class="go-video-preview-cover"><img class="w-16 h-16" src="file:///android_asset/loading-indicator/loading2.png"></div>';
         data+='<div class="go-video-preview-child-cont" id="vid-child-cont-' + cid + '">';
         data+='<img src="file:///android_asset/go-icons/video.png" class="w-30" style="position: absolute; bottom: 0; left: 0; z-index: 10;">';
         data+='<video id="vid-' + cid + '" data-cid="' + cid + '" data-src="' + v + '" class="go-upload-video-preview" preload="auto"';
         data+=' src="' + v + '?i=' + randomString(4) + '#3" oncanplay="goVideoPreviewLoaded(this);" onerror="goVideoPreviewError(this);" autoplay muted>';
         data+='</video>';
         data+='</div>';
         data+='<span data-findex="' + i + '" data-fpath="' + v + '" data-cid="uppc-' + cid + '" class="go-remove-upload-preview" id="close-upbtn-' + cid + '">x</span>';
         data+='<span id="go-up-progress-container-' + filename + '" class="go-up-progress-container">';
         data+='<span id="go-up-progress-' + filename + '" class="go-up-progress"></span>';
         data+='</span>';
         data+='<input type="hidden" id="vid-poster-' + cid + '" />';
         data+='</div>';
         cont.append( data);
      var vid= document.getElementById("vid-" + cid);
       
    }else{ 
      toast('One or more videos too large');
         }
    }
       
 }    

});
  
  $('#open-compose-page-btn').click();
});

function goVideoPreviewLoaded(video){
  
  var cid=video.getAttribute("data-cid");
  var src=video.getAttribute("data-src");
  var cid= video.getAttribute("data-cid");
  
  var dur=video.duration;
 
   if(!dur|| dur<5){
       removeFromUploadList(src );
    $('#uppc-' + cid ).remove();
       toast('Video too short')
       return;
     }
  
 var dimensions = [video.videoWidth, video.videoHeight];   

 setTimeout(function(){
   var res= go_captureVideoPoster(video, dimensions); 
   if( res ){
     var elem=$('#vid-poster-' + cid);
     var poster=res[0]||"";
   elem.val(poster );
   elem.attr('data-dim', res[1].toString() );
   $('#vid-child-cont-' + cid).prepend('<img src="data:image/jpeg;base64,' + poster +'" class="go-video-upload-preview-poster">');
  }
  else{ 
  $('#vid-child-cont-' + cid).prepend('<img src="file:///android_asset/go-icons/bg/black-bg.png" class="go-video-upload-preview-poster">');
  }
   
 $('#uppc-cover-' + cid).remove();
 },100);
}

function goVideoPreviewError(t){
 
  var this_=$(t);
  var src=this_.data("src");
  var cid=this_.data("cid");
    removeFromUploadList(src )
    $("#uppc-" + cid ).remove();
   toast('Some files rejected');
 }


function arrayMove(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice( new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};


function swapIt(t){
  var this_=$(t);
  var swid=+this_.data('swid');
  arrayMove( GO_UPLOAD_FILE_PATHS, swid, 0);
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
  localStorage.removeItem("logged_in");
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




var exitTime__=false;

function go_onBackPressed(){
  if( localStorage.getItem('message_opened')){
    return;
 } else if( $('.display--data').length ){
   var elem=$('.display--data:last');
  if(!elem.hasClass('no-cancel') ){
   closeDisplayData( elem.data('class') );
  closeTopPageList(); //this just cancel ajax
 }
  return;
}
else if($('.console-log').is(':visible')){
  $('.console-log').css('display','none');
    return;
  }
  
 else if( $('#go-full-photo-container').is(':visible')){
   closeFullPhoto();
   return;
 }
  else if( $('#go-full-cover-photo-container').is(':visible')){
  closeFullCoverPhoto();
    return;
  }
  else if( $("#go-video-element-container").is(":visible") ){
  return go_exitVideoFullScreen();
 }
  else if( $('#compose-post-container').is(':visible')){
  return closeComposePage();  
 }
  else if( $('#go-profile-update-container').is(':visible')){
  return closeProfileUpdateForm();
  }  
  else if( $('#go-rcomment-container').is(':visible')){
    return  goCloseCommentReply();
 }  
  else if( $('#go-comment-container').is(':visible')){
   return  goCloseComment();
 }
  
  else if( $('#go-profile-container').is(':visible')){
  return goCloseProfile();
  }
  
  else if($('#go-followers-container').is(':visible') ){
  return closeViewFollowers(); 
  }
  else if($('#go-following-container').is(':visible') ){
  return closeViewFollowing(); 
  }
  else if($('#go-blocked-followers-container').is(':visible') ){
  return closeViewBlockedFollowers(); 
  }
  else if( $('#go-follow-container').is(':visible') ){
    clearTimeout(fsuggestionsTimeout);
    if( fsuggestionsAjax) fsuggestionsAjax.abort()
  return closeFollowForm(); 
  }
  
 else if($('#go-saved-posts-container').is(':visible') ){
  return closeSavedPosts(); 
  }
 
  else if( $('#go-single-post-container').is(':visible') ){
  return closeSinglePost();
 }
  
 else if($('#go-notifications-container').is(':visible') ){
  return closeNotifications(); 
  }
   
 else if($('#go-search-container').is(':visible')){
   return closeSearch(); 
 }  
  else if( $('#go-request-app-container').is(':visible')){
   closeRequestApp();
   return;
 }
  else if( $('#go-create-page-form-container').is(':visible') ){
    closeCreatePageForm(); 
  } 
  else if( $('#go-downloads-container').is(':visible') ){
   return closeDownloadsPage(); 
  } 
  
  else if ( !$('.right-side-bar-container').hasClass("hide-right-sidebar")
        && $("#IS-MOBILE").is(":visible") ){
 return closeRightMenus();
}
  
else if ( !$('.side-bar-container').hasClass("hide-left-sidebar") 
        && $("#IS-MOBILE").is(":visible") ){
 
   closeMenus();
  
   return;
 } else if( $(".reactions-box").length){
   $(".reactions-box").remove();
   return;
 }
 else{
   if( exitTime__ ){
    closeGoSocial();
     return;
   }
  android.toast.show('Press again to exit.');
    exitTime__=true;
  setTimeout( function(){
    exitTime__=false; },1500);
 }
 
}

function newMessageNotify( total_messages){

  var elem=$('#total-new-messages');
  var curr=+elem.attr('data-total');
  if( total_messages){
    total_messages= +total_messages.split('-')[0];
   var total= total_messages+curr;
   var tt=total;
    if( tt>99){
      tt='99+';  }
    localStorage.setItem(username + '_total_new_messages', total + '/' + tt);
    elem.attr('data-total', total).text( tt ).css('display','inline-block');
  }
}

function reload(){
  location.reload();
}


function contactUs(){
  android.activity.loadUrl("main","javascript: createDynamicStadium('" + go_config_.contact_us + "','Contact us');");
   setTimeout( function(){
    openMessage();
   this_.prop('disabled', false);
 },600);
    
}



//document.addEventListener("backButtonPressed

document.addEventListener("onBackPressed", function(){
  go_onBackPressed();
});

