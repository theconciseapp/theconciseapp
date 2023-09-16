var GO_COMMENT_UPLOAD_FILE_PATHS=[]; 
var GO_COMMENT_UPLOADED_FILE_PATHS=[];


var sendBtn=$('#send-message-btn');
var voiceBtn= $('#voice-message-btn');
var attachBtn= $('#attachment-btn-container');

var fetchingComment=false;
var commentAjax;
var commentTimeout=0;

function storedCommentsLikes_(){
	var sl=localStorage.getItem("COMMENTS_SAVED_LIKES")||"";
	var len=sl.length;
if( len> 3000){
	localStorage.removeItem("COMMENTS_SAVED_LIKES");
	sl=null;
}
  return sl?JSON.parse(sl):{}
}

var COMMENTS_SAVED_LIKES= storedCommentsLikes_();

function commentLiked(lid){
	return COMMENTS_SAVED_LIKES[lid];
}
	
function storeCommentLike(lid){
 COMMENTS_SAVED_LIKES[lid]=1;
 localStorage.setItem("COMMENTS_SAVED_LIKES", JSON.stringify( COMMENTS_SAVED_LIKES));
}

function removeCommentLike( lid){
   delete COMMENTS_SAVED_LIKES[lid];
 localStorage.setItem("COMMENTS_SAVED_LIKES", JSON.stringify( COMMENTS_SAVED_LIKES));
 }



function bbcode_comment(data){
  var reg=/@\[::(.*?)::(.*?)::\]/gi;
    data=data.replace(reg, function(m,tagged,tagged_name){
   return '<span class="go-comment-tagged-pin go-open-profile" data-user="' + tagged + '" data-user-fullname="' + tagged_name + '">' + tagged_name + '</span>';
    });
  return data;
}


function commentAuthorPicture(fuser, class_, verified){
  class_=class_||'friend-picture';
  var real_path=config_.users_path + '/' + strtolower( fuser[0]+'/' + fuser[1] + '/' + fuser[2] + '/' + fuser ) + '/profile_picture_small.jpg';
  var local_path='file:///android_asset/chat-icons/no_profile_picture.jpg';
 return '<img class="lazy ' + class_ + '" alt="" onerror="imgError(this);" src="' + local_path + '" data-src="' + real_path + '" data-verified="' + (verified?'1':'') + '" data-id="' + strtolower(fuser ) + '">';
}

function imgError(image) {
  var src="file:///android_asset/chat-icons/no_profile_picture.png";
    image.src = src;
}


$(function(){
 
$('body').on('click','.go-open-comments-box',function(){
                 
  var this_=$(this);
  var pid= this_.data('pid');
  var post_by= $.trim( this_.data('post-by') );
 if(!post_by){
   return toast('Post author not found.');
 }
  
  if( pid.length<1 ) return toast('Post id not found.');
  
/*
var highlight=this_.attr('data-highlight')||"";
  highlight=highlight.replace(/(\s|<br>|\?r|\?b|\?g|\?lg|\?sm|`|-|\*|\~|_|\|)/g,' ');
  
  $('#post-comment-title').text( highlight);
 */
  
 var cpi=$('#current-post-id');
  var cpiv=$.trim(cpi.val() );
      cpi.val( pid);
  $('#current-post-by').val(post_by);

 var ccont= $('#go-comment-container')
 var mccont= $('#my-comments-container')
  
 var pc=$('#post-comments');  
  
 if(cpiv!=pid){ 
  $('#prev-comments').css('display','none');
   mccont.empty();
   pc.empty();
 if(commentAjax) commentAjax.abort();
   clearTimeout( commentTimeout);
  fetch_comments(  pid);
 }
  
  var zi=zindex();
 
// $('#go-profile-container').css('z-index', (zi-10) );
   ccont.css({'display':'block','z-index': zi }); 
});
  

$('body').on('click','#comment-refresh-btn',function(){
 
  if( fetchingComment){
   return toast('Please be patient.',{type:'light',color:'#333'});
 }   
  $('#my-comments-container,#post-comments').empty();
   $('#prev-comments,#next-comments').css('display','none');
   fetch_comments("");
  
 });
  
$('body').on('click','#prev-comments',function(){
 if( fetchingComment){
   return toast('Please be patient.',{type:'light',color:'#333'});
 }
  var page=$(this).attr('data-value');
  if(!page) return toast('No more comments.',{type:'light',color:'#333'});
 //$('#my-comments-container,#post-comments').empty(); 
   fetch_comments("", page);   
 });
  
  
$('body').on('click','.delete-comment',function(){
  var this_=$(this);
  var cid=this_.attr('data-cid');
  var post_id=this_.attr('data-pid');
  var author=this_.attr('cauthor');
 
  if(!confirm('Delete selected comment?') ) return false;

 if(!cid ){
    return toast('Comment id not found.');
  }
 
 var tb=$('#go-comment-box');
     tb.prop('disabled', true); 
      
    $('#post-comment-sending-cont').append('<span id="comment-sending-icon"><img class="w-20 h-20" src="file:///android_asset/loading-indicator/loading2.png"></span>');
  var loader=$('#comment-loader-container');
  loader.css('display','block');
 
  setTimeout(function(){
    $.ajax({
    url: config_.domain + '/oc-ajax/go-social/delete-comment.php',
    type:'POST',
  // timeout: 10000,
     dataType: "json",
    data: {
      "username": username,
      "cauthor": author,
      "comment_id": cid,
      "post_id": post_id,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
    //alert(JSON.stringify(result))
   $('#comment-sending-icon').remove();
   tb.prop('disabled', false); 
  if( result.status){
   $('#post-comments-container #ccc-' + cid).remove();
  }
   else if(result.error){
      toast(result.error );
  }
   else toast('Unknown error');
    loader.css('display','none');
 }).fail( function(e,txt,xhr){
   loader.css('display','none');
  $('#comment-sending-icon').remove();
  toast('Something went wrong');
  tb.prop('disabled', false);
  report__('Error ".delete-comment"', JSON.stringify(e),true );
 
  });
    
  },1000);
});
  
});



function fetch_comments( post_id, page_number){
  var cpi=$('#current-post-id');
  var pby=$('#current-post-by').val();

  var cpiv=$.trim(cpi.val() );
   post_id=cpiv||post_id;
  page_number=page_number?'?page=' + page_number:'';
    
  var tb=$('#go-comment-box');
      tb.prop('disabled', true);
 
  var loader=$('#comment-loader-container');
  loader.css('display','block');
  var npBtn=$('#prev-comments,#next-comments');
   npBtn.prop('disabled', true);
    
  fetchingComment=true;
  //var containerId=randomString(5);
   commentTimeout=setTimeout(function(){
     
  commentAjax =$.ajax({
    url: config_.domain + '/oc-ajax/go-social/fetch_comments.php' + page_number,
    type:'POST',
  // timeout: 30000,
     dataType: "json",
    data: {
      "username": username,
      "post_id": post_id,
      "post_by": pby,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function( result){
  if( cpi.val()!=cpiv) return;
    fetchingComment=false;
 npBtn.prop('disabled',false);
 //alert(JSON.stringify(result))
    var nextPage=result.next_page;
    var prevPage=result.prev_page;
    
  if(result.no_comment){
    
  $('#post-comments').html('<div class="text-center no-comment-container" id="no-comment-cont-' + post_id + '">No Comment Yet</div>');
  }
 else if( result.result){
    var rdata=result.result;
    var ipp=+result.item_per_page;
    var total=rdata.length;
 
 try{
   
   var likes_data="";
    var ldir=new android.File( MAIN_FOLDER, username + '/GO-COMMENTS-LIKES/' + post_id);
    var clfile=new android.File(ldir,'likes.txt');
  if(clfile.isFile() ){
   //  clfile.createNewFile();
  var likes_data=$.trim( clfile.read()||"");
 }
   
  $.each( rdata, function(i,v){
    
    var following=v["me_following"];
  
  if( following!="0"){
    var cid= v["id"];
    var likes=v["likes"];
    //var fullname=v["fullname"];
    var cauthor=v["comment_author"];
    var comment=v["message"];
    var cfullname=v["fullname"];
    var has_replies=+v["has_replies"];
    var post_files=v["post_files"]||"";
    
    var meta=JSON.parse( v["meta"] );
        meta["post_id"]=post_id;
  
  /*
  if( likes_data.search(',' + cid + ',')>-1){
  var liked=true;
    
  }else {
   var liked=false;   
   }  
  */
    
 if(  commentLiked(cid)  ){
  var liked=true;    
  }else {
   var liked=false;   
  }    
    
    
    display_comment('prepend', cid, comment, post_files, meta, cauthor, cfullname, has_replies, false, nextPage,likes,liked);
  } 
  });
   
 }catch(e){
    toast(e); 
}

    
    npBtn.css('display','none');
   
 if( prevPage ){
   // $('#next-comments').attr('data-value', prevPage).css('display','block');  
 }
  if( nextPage ){
    $('#prev-comments').attr('data-value', nextPage).css('display','block');
 }
   
  }
   else if(result.error){
    toast(result.error,{type:'light',color:'#333'});  
  }
    loader.css('display','none');
    tb.prop('disabled', false);
   // sendBtn.prop('disabled', false)
  }).fail( function(e,txt,xhr){
    
 if( $('#go-comment-container').is(':visible') ){
    commentTimeout=setTimeout(function(){
     fetch_comments( post_id, page_number);
 },5000);
   
 }else{
   fetchingComment=false;
   npBtn.prop('disabled',false)
   loader.css('display','none');    
 }
  //  toast('Check network. ' + xhr,{type:'light',color:'#333'});
   tb.prop('disabled', false);
    report__('Error "fetch_comments()"', JSON.stringify(e),true );
 
    
  });
   }, 1000);  
}



function display_comment( type, cid, comment, post_files, meta, author_, fullname, has_replies, me, paging,likes,liked){
   type=type||'append';
   
 if(me){   
   var mccont= $('#my-comments-container');
 }
else{
  var mccont=$('#post-comments');
}
 
  var com_files=meta.com_files||"";
  var has_files=meta.has_files||"";
  var post_id= meta.post_id||"";
 // var fullname=meta.fullname||author_;
  
  var v=checkVerified( author_, fullname);
  var icon=v.icon;
  var author= v.name;
  var ctime=meta.time||moment().unix();
  
  var cdate=timeSince( ctime);
  
  var isMe=false;
  
 if( author_==username){ 
    isMe=true;
  }
  
 var data='<div class="comment-child-container ' + (isMe?'my-comment-container':'') + '" id="ccc-' + cid + '">';
  data+='<div class="' + ( isMe?'text-right':'') + '">';
  
 if( !isMe) data+='<span class="d-inline-block go-comment-author-icon-container" style="margin-right: 5px; margin-left: 5px;">' + commentAuthorPicture( author_ ,'go-comment-author-icon nosave' ) + '</span>';

 data+='<div class="comment-bubble" id="' + cid + '">';
 data+='<span class="highlight comment-author go-open-profile friend-' + author_ + '" data-user-fullname="' + author + '" data-user="' + author_ + '">' + strtolower( fullname) + ' ' + icon + '</span>' ;

 data+='<div class="comment-message">' + bbcode_comment( comment ) + '</div>';
  //   f+='<div class="go-comment-files-container">' + com_files + '</div>';
   
  // var format= go_formatFiles( f, null, null, null, true );
 data+='<div class="go-comment-files-container">';
 data+= go_formatFiles( post_files, null, null, null, true );
 data+='</div></div>';
  
 if( isMe)  data+='<span class="d-inline-block go-comment-author-icon-container" style="margin-left: 5px; margin-right: 5px;">' + commentAuthorPicture( author_ ,'go-comment-author-icon nosave' ) + '</span>';
 
  data+='</div>';
  

 
  data+='<div class="comment-footer">';
  
 if(isMe || goAdmin(username) ){
   data+='<span class="delete-comment" id="delc-' + cid + '" data-pid="'+ post_id + '" data-cid="' + cid + '" cauthor="' + author_ + '"><img class="w-16 h-16" src="file:///android_asset/chat-icons/delete.png"></span>';
 }
  likes=likes||0;
  data+='<span class="comment-date">' + cdate + '</span>';
  data+='<span class="like-comment" id="like-comment-' + cid + '" data-cby="' + author_ + '" data-cid="' + cid + '" data-total-likes="' + likes + '" onclick="like_comment(this);">';
  data+='<span class="' + ( liked ? 'text-info':'text-secondary' ) + '"><strong>Like</strong></span>';
  data+='</span>';
 
  data+='<span id="reply-btn-' + cid + '" class="reply-comment text-secondary ml-3" data-parent-id="' + cid + '" data-cby="' + author_ + '" data-fullname="' + fullname + '" onclick="replyComment(this,\'' + author_ + '\');"><strong>Reply</strong></span>';
  data+='<img id="like-img-' + cid + '" class="ml-3 w-16 h-16" src="file:///android_asset/chat-icons/' + ( liked?'liked':'like' ) + '.png"> <span class="likes" id="likes-' + cid + '">' + abbrNum( + likes,1 ) + '</span>';
 
 if( has_replies>0){
  data+='<div class="text-dark mt-1 mb-2 text-center" data-parent-id="' + cid + '" data-fullname="' + fullname + '" onclick="replyComment(this);"><strong>View replies</div></div>';
 }
  
  data+='</div>';
  data+='</div>';
  
  if( type=='append'){
  mccont.append(data)
  } else{
  mccont.prepend(data);
  }
}


function format_comment(gpin, post_id,com_files,clen){
 var currentTime=moment().unix();
   var obj_=new Object();
  obj_.post_id="" +  post_id;
  obj_.cf="" +   username;
  obj_.fullname=userData('fullname');
  obj_.com_files="" + com_files; //video, image
  obj_.has_files="" + ( com_files?1:0);
  obj_.size="" + clen; //txt size or file size 
  obj_.time="" + currentTime;
  obj_.ver="" + config_.APP_VERSION;
    return obj_;
}



function add_comment( fuser, comment, mlen){
   var fpaths=GO_COMMENT_UPLOADED_FILE_PATHS;
   var fpaths_="";
   var com_files="";
   var total_files=fpaths.length;
   var hasFiles=0;
  
  if( total_files){
  com_files= JSON.stringify( fpaths)
  hasFiles=1;
  }  
  
   if( mlen > go_config_.mcl){
    return android.toast.show('Comment too long.');  
  }
  var rcid=randomString(5);
  
  var displayComment=sanitizeLocalText(comment );
  var comment=sanitizeMessage( comment);
  
  var tb=$('#go-comment-box');
      tb.prop('disabled', true);
   
  var cpi=$('#current-post-id');
  var cpiv=$.trim(cpi.val());
  var post_by= $.trim( $('#current-post-by').val() )
  
 /*
 if( !$('#post-comment-sending-cont #comment-sending-icon').length){
    $('#post-comment-sending-cont').append('<span id="comment-sending-icon"><img class="w-20 h-20" src="file:///android_asset/loading-indicator/loading2.png"></span>');
  }
 */
  
 var sb=$('#post-comments-container');
     sb.scrollTop( sb.prop("scrollHeight") );
 
  var fullname=userData('fullname');
  
  var meta=format_comment(fuser, cpiv,com_files,mlen);
 
  display_comment('append', rcid, displayComment, com_files, meta, username, fullname, 0, true);
  
 var cdiv=$('#my-comments-container #ccc-' + rcid);
 var delBtn= $('#my-comments-container #delc-' + rcid);
 var likeBtnCont=$('#my-comments-container #like-comment-' + rcid);
 var likeBtn=$('#my-comments-container #like-img-' + rcid );
 var replyBtn=$('#my-comments-container #reply-btn-' + rcid );
 
  delBtn.css('display','none');
  likeBtnCont.css('display','none');
  replyBtn.css('display','none')
   
     meta=JSON.stringify( meta);
  
 var btn= $('#go-send-comment-btn');
    btn.prop('disabled',true);

   var loader=$('#rcomment-loader-container');
  loader.css('display','block');
 
 
  setTimeout(function(){
     $.ajax({
    url: config_.domain + '/oc-ajax/go-social/add_comment.php',
    type:'POST',
  // timeout: 10000,
     dataType: "json",
    data: {
      "username": username,
      "fullname": fullname,
      "message": comment,
      "meta": meta,
      "post_files": com_files,
      "has_files": hasFiles,
      "post_id": cpiv,
      "post_by": post_by,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
   // alert(JSON.stringify(result) );
 // $('#comment-sending-icon').remove();
  loader.css('display','none');
   btn.prop('disabled', false);
   tb.prop('disabled', false);
 if( result.status=='success'){
   sessionStorage.removeItem('temp-com-text-' + fuser);
   GO_COMMENT_UPLOADED_FILE_PATHS=[];
   $('#go-comment-upload-preview-container').empty()
   $('#post-comments #no-comment-cont-' + cpiv).remove();
   var id= result.result;
 
if(id>0){
  
  delBtn.attr('data-cid', id).attr('data-pid', cpiv).css('display','inline-block');
  cdiv.attr('id', 'ccc-' + id);
  $('#likes-' + rcid).attr('id','likes-' + id);
  likeBtnCont.attr('data-cid', id).attr('id','like-comment-' + id).css('display','inline-block');
  likeBtn.attr('id','like-img-' + id);
  replyBtn.attr('data-parent-id',id ).attr('id','reply-btn-' + id).css('display','inline-block');
  
}
   tb.val('');
   tb.autoHeight();
  return;
 }else if(result.error){
    toast( result.error);
   $('#post-comments-container #ccc-' + rcid ).remove();
 }

 }).fail(function(e,txt,xhr){
   loader.css('display','none');
 //$('#comment-sending-icon, #post-comments-container #ccc-' + rcid ).remove();
   android.toast.show('Something went wrong');
   tb.prop('disabled', false);
   btn.prop('disabled', false);
   report__('Error "add_comment()"', JSON.stringify(e),true );
 
  });
    
  },1000);
}


function like_comment(t){
  var this_=$(t);
  var cpi=$('#current-post-id');
  var post_id=$.trim(cpi.val() );
  var post_by=$.trim( $('#current-post-by').val());
  var cid=this_.attr('data-cid');
  var comm_by=this_.attr('data-cby');
  var parent_id=$.trim( $('#comment-parent-id').val())||"";
  
 var ldir=new android.File( MAIN_FOLDER, username +'/GO-COMMENTS-LIKES/' + post_id);
 
 if( !ldir.isDirectory() && !ldir.mkdirs()){
   return toast('Could not create necessary dir.',{type:'light',color:'#333'});
 }
  
var clfile=new android.File(ldir,'likes.txt');
  if(!clfile.isFile() && !clfile.createNewFile()){
    return toast('Could not create likes file.',{type:'light',color:'#333'});
  }
  
 //var ldata=$.trim( clfile.read());
  var type=1;
 
  /*
  if( ldata.search(',' + cid + ',')>-1){
  type=2;  
 }
  */
   
 var type=1;

 if( commentLiked(cid)){
   type=2;
}
  
  var tb=$('#go-comment-box');
      tb.prop('disabled', true);
   this_.prop('disabled',true);
 
  var isReply=$('#go-rcomment-upload-preview-container').is(':visible');
 
  if( isReply){
 var loader=$('#rcomment-loader-container')
  }else{
 var loader=$('#comment-loader-container');
  }
  
  loader.css('display','block');
 
 commentLikeTimeout=setTimeout(function(){
    var fullname=userData('fullname');
   
  commentAjax=$.ajax({
    url: config_.domain + '/oc-ajax/go-social/like-comment.php',
    type:'POST',
  // timeout: 10000,
     dataType: "json",
    data: {
      "username": username,
      "fullname": fullname,
      "comment_id": cid,
      "post_id": post_id,
      "post_by": post_by,
      "parent_id":parent_id,
      "comment_by": comm_by,
      "type": type,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function( result){
  //  alert( JSON.stringify(result))
    loader.css('display','none');
    this_.prop('disabled', false);
    tb.prop('disabled', false);
    
  if( result.status){
    
  //  clfile.append(',' + cid + ',');
   var elem= $('#likes-' + cid);
   var curr_likes=  +this_.attr('data-total-likes'); //+elem.text();
    
   if(type==1){
     curr_likes=curr_likes+1;
     elem.text( abbrNum( curr_likes, 1) );
     this_.attr('data-total-likes', curr_likes)
   $('#like-img-' + cid).attr('src','file:///android_asset/chat-icons/liked.png');
   $('#like-comment-' + cid + ' span').addClass('text-info').removeClass('text-secondary');
   storeCommentLike(cid);   
   
   }
    else {
      curr_likes=curr_likes-1;
      elem.text( abbrNum(curr_likes,1) );
      this_.attr('data-total-likes', curr_likes);
      
  /*  ldata= ldata.replace(new RegExp(',' + cid + ',','g') , '');
  if(  clfile.write(ldata ) ){
    */
   $('#like-img-' + cid).attr('src','file:///android_asset/chat-icons/like.png');
   $('#like-comment-' + cid + ' span').addClass('text-secondary').removeClass('text-info'); 
   
   removeCommentLike( cid);
      
      //  }
    }
 }else if( result.error){
    toast(result.error );
 }
    
  }).fail(function(e,txt,xhr){
    loader.css('display','none');
    this_.prop('disabled', false);
    tb.prop('disabled', false);
  report__('Error "like_comment()"', JSON.stringify(e), true );
 
 });

 },2000);
}




function goCommentUploadFiles(){
  var fpaths=GO_COMMENT_UPLOAD_FILE_PATHS;
  if( fpaths.length<1 ) return;
   var v=fpaths[0];
  var ext=file_ext(v);
  var filename= v.substr( (v.lastIndexOf('/') +1) );
     filename=filename.split('.')[0];
  var pElem=$('#comment-vid-poster-' + filename);
  
  var file=new android.File( v);
  var base64=file.readBase64();
 
  var pCont=$('#go-ucp-progress-container-' + filename);
  var isReply=$('#go-rcomment-upload-preview-container').is(':visible');
  
  setTimeout(function(){
    var poster=pElem.val()||"";
    var pDim=  pElem.data('dim');
    
  $.ajax({
   xhr: function() {
      var xhr = new window.XMLHttpRequest();
    // Upload progress     
    xhr.upload.addEventListener("progress", function(evt){
        if (evt.lengthComputable) {
     var percent= (evt.loaded / evt.total)*100;
  
   $('#go-ucp-progress-' + filename).css({ width: "" + percent + "%"});
    pCont.css('display','block');
   
  if( percent==100){
    $('#go-ucp-progress-' + filename).css({width:'100%'});
   // pCont.css('display','none'); //usc-upload status container @"displayMessage()"
  
  }
   }
 }, false); 
       return xhr;
    },
    "url": config_.domain + '/oc-ajax/go-social/upload-comment-file.php',
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
  $('#go-send-comment-btn,#go-send-rcomment-btn').prop('disabled',false);
  
  if( result.status=="success"){
   
var file_obj=new Object();
    file_obj["path"]=result.file_path;
    file_obj["ext"]=result.ext;
    file_obj["width"]=result.width||500;
    file_obj["height"]=result.height||150;
    file_obj["poster"]=result.poster||"";
    file_obj["size"]=result.file_size||file_size;
   
    
    var push_=result.file_path + '|' + result.ext +  (result.poster? '|' + result.poster:'');
  
   GO_COMMENT_UPLOADED_FILE_PATHS.push( file_obj) //push_);
   GO_COMMENT_UPLOAD_FILE_PATHS =$.grep( GO_COMMENT_UPLOAD_FILE_PATHS, function(value) {
   return value != v;
 });
  
 if( isReply ){
   $('#go-send-rcomment-btn').click()
 }else{
   $('#go-send-comment-btn').click();
 }  
  }else if( result.error){
  // var ecode=result.error;
    $("#ucppc-" + filename).remove();
    toast( result.error);
  }
  else{
     toast('Unknown error occured.');
  }
    
  }).fail(function(e,txt,xhr){
     //alert( JSON.stringify(e));
   $('#go-send-comment-btn,#go-send-rcomment-btn').prop('disabled',false);
    android.toast.show('Something went wrong');
    report__('Error "goCommentUploadFiles()"', JSON.stringify(e),true );
 
  });
  },2000); 
  
}


function goCloseComment(){
  var ccont=$('#go-comment-container')
  var pcont=$('#go-profile-container');
  var pIndex=+pcont.css('z-index');
  var cIndex=+ccont.css('z-index');
 
if( $('#go-profile-container').is(':visible')){
   if( pIndex > cIndex ) {
     return goCloseProfile();
   }
  
  
 }
 
  fetchingComment=false;
  if( commentAjax) commentAjax.abort();
  clearTimeout( commentTimeout);
 $('#comment-loader-container').css('display','none');
 $('#prev-comments,#next-comments').prop('disabled', false);
    
  ccont.css('display','none'); 
}


$(function(){
  
  $('body').on('click','#go-send-comment-btn',function(e){ 
     var textBox=$('#go-comment-box'); 
 var msg=$.trim( textBox.val() );
 var fuser=""
 var mlen=( msg.length+1)/1024;
     
  var this_=  $(this);
     
 if( GO_COMMENT_UPLOAD_FILE_PATHS.length>0 ){
    this_.prop('disabled',true);
  return goCommentUploadFiles();
 }
   
 if( GO_COMMENT_UPLOADED_FILE_PATHS.length<1 && !msg){
    
   return toast('Comment empty');
   }
   this_.prop('disabled',true);
    add_comment(fuser, msg, mlen );
 });
   
 
  $('body').on('click','#go-comment-upload-file-btn',function(){
  $('#go-comment-upload-preview-container').empty();
   
   GO_COMMENT_UPLOAD_FILE_PATHS=[]; //Empty paths
   GO_COMMENT_UPLOADED_FILE_PATHS=[]; //Empty uploaded paths
  
    try{
   var dir=new android.File( PUBLIC_FOLDER, 'go-COMMENT-TEMP-DIR');
    if( dir.isDirectory() ){
      dir.deleteFileOrFolder();
    }
  }catch(e){}
    android.control.execute("goCommentImportFiles()")
  });
 
  $('body').on('click','.go-comment-remove-upload-preview',function(){
  var this_=$(this);
   var fpath= this_.data('fpath');
   var contId=this_.data('cid');
   var findex= +this_.data('findex');
  
  GO_COMMENT_UPLOAD_FILE_PATHS =$.grep( GO_COMMENT_UPLOAD_FILE_PATHS, function(value) {
   return value != fpath;
 });
   
try{  
 var file=new android.File( fpath);
 if( file.isFile()){
    file.delete();
 }
 }catch(e){}
   
   $('#' + contId).remove();
   
  });
  
  //PHOTO FULL- COMMENT AUTHOR
  
$('body').on('click','.go-comment-author-icon',function(){
   var this_=$(this);
  var img= this_.attr('src');
   if(!img) return;
   var img   = replaceLast( img,'_small','_full');
     $('#go-full-photo-div').html('<img class="lazy go-full-photo" src="file:///android_asset/go-icons/bg/transparent.png" data-src="' + img + '">')
  var zi=zindex();
  //$('#go-single-post-container') .css({'display':'block', 'z-index': zi}); //z-index previous: 42
    
  $('#go-full-photo-container').css({'display':'block','z-index': zi});
  });
  
  
  
  
});



document.addEventListener("goCommentImportFilesCompleted", function(evt){
  //Profile picture Coming From Gallery  
  var fpaths=evt.detail.file_paths;
 // var path=evt.detail.path;
  if( fpaths.length<1){
    return toast('File paths error.');
  }
  
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
  
  fpaths=fpaths.reverse();
  
  GO_COMMENT_UPLOAD_FILE_PATHS=[];

  if( $('#go-rcomment-container').is(':visible')){
 var cont=$('#go-rcomment-upload-preview-container');
  }else{
  var cont=$('#go-comment-upload-preview-container');
  }
   $.each( fpaths,function(i,v){
   var ext=strtolower( file_ext( v)||"");
   var filename= v.substr( (v.lastIndexOf('/') +1) );
       filename=filename.split('.')[0];
     var cid= filename; //randomString(5);
     var data="";
    var file=new android.File(v);
    var size=file.length()||0;
        size=size/1000000;
     
    if( ext=='jpg'){
   if( size && size<max_file_size){
      GO_COMMENT_UPLOAD_FILE_PATHS.push(v);
         data='<div id="ucppc-' + cid + '" data-fpath="' + v + '" class="go-upload-photo-preview-container">';
         data+='<img class="go-upload-photo-preview" src="' + v + '">';
         data+='<span data-findex="' + i + '" data-fpath="' + v + '" data-cid="ucppc-' + cid + '" class="go-comment-remove-upload-preview">x</span>';
         data+='<span id="go-ucp-progress-container-' + filename + '" class="go-up-progress-container">';
         data+='<span id="go-ucp-progress-' + filename + '" class="go-up-progress"></span>';
         data+='</span>';
         data+='</div>';
     cont.append( data);
   }else {
     toast("Photo too large"); 
   }
      
  }else if( allow_vid && ext=="mp4"){
    
     if( size && size<max_file_size){
    
       GO_COMMENT_UPLOAD_FILE_PATHS.push(v);
         data='<div id="ucppc-' + cid + '" data-fpath="' + v + '" class="go-upload-video-preview-container">';
         var poster="file:///android_asset/go-icons/bg/black.png";
         data+='<video id="cvid-' + cid + '" data-src="' + v + '" data-cid="' + cid + '" class="go-upload-video-preview" poster="' + poster + '" onloadeddata="goCommentVideoPreviewLoaded(this);" onerror="goCommentVideoPreviewError(this);" preload="auto">';
         data+='<source src="' + v + '#t=0.8">';
         data+='</video>';
         data+='<span data-findex="' + i + '" data-fpath="' + v + '" data-cid="ucppc-' + cid + '" class="go-comment-remove-upload-preview">x</span>';
         data+='<span id="go-ucp-progress-container-' + filename + '" class="go-up-progress-container">';
         data+='<span id="go-ucp-progress-' + filename + '" class="go-up-progress"></span>';
         data+='</span>';
         data+='<input type="hidden" id="comment-vid-poster-' + cid + '" />';
         data+='</div>';
    
       cont.append( data);
      var vid= document.getElementById('cvid-' + cid);
    }
    else{
      toast('Video too large');
}
  }else{
    toast('Some files not allowed');
      }
    
   });
  
/*
var dir=new android.File( PUBLIC_FOLDER, 'go-COMMENT-TEMP-DIR');
   try{
     dir.deleteFileOrFolder()
   }catch(e){}
*/
});

   
function goCommentVideoPreviewLoaded(video){ 
  var cid=video.getAttribute("data-cid");
  var src=video.getAttribute("data-src");
  
  var dur=video.duration;
   if(!dur|| dur<2){
       GO_COMMENT_UPLOAD_FILE_PATHS =$.grep( GO_COMMENT_UPLOAD_FILE_PATHS, function(value) {
   return value != src;
   });   
    $('#ucppc-' + cid ).remove();
       toast('Video too short')
       return;
     }  
  
  var dimensions = [video.videoWidth, video.videoHeight];
  
setTimeout(function(){
  var res= go_captureVideoPoster(video, dimensions, 1);
  
  if( res ){
   var elem=$('#comment-vid-poster-' + cid);
   elem.val( res[0]);
   elem.attr('data-dim', res[1].toString() );
    }else{
    $('#ucppc-' + cid).remove();
   GO_COMMENT_UPLOAD_FILE_PATHS =$.grep( GO_COMMENT_UPLOAD_FILE_PATHS, function(value) {
   return value != src;
   });   
  }
},100);
}

function goCommentVideoPreviewError(video){
    var this_=$(video);
  var src=this_.data("src");
  var cid=this_.data("cid");
    $('#ucppc-' + cid).remove();
   GO_COMMENT_UPLOAD_FILE_PATHS =$.grep( GO_COMMENT_UPLOAD_FILE_PATHS, function(value) {
   return value != src;
   });
   android.toast.show("Some files rejected");
}