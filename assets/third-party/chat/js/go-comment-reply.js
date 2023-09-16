var fetchingRComment=false;
var commentRAjax;
var commentRTimeout=0;

function goCloseCommentReply(){
  var ccont=$('#go-rcomment-container')
  var pcont=$('#go-profile-container');
  var pIndex=+pcont.css('z-index');
  var cIndex=+ccont.css('z-index');
 
if( $('#go-profile-container').is(':visible')){
   if( pIndex > cIndex ) {
     return goCloseProfile();
   }
 }
  fetchingRComment=false;
  if(commentRAjax) commentRAjax.abort();
  clearTimeout( commentRTimeout);
 
   $('#go-rcomment-box').prop('disabled',false);
   $('#go-rcomment-container, #go-view-orig-post').css('display','none');
  $('#comment-parent-id').val("");
  goRemoveCommentTagged();
  
}



$(function(){
 
$('body').on('click','#rcomment-refresh-btn',function(){
 if( fetchingRComment){
   return android.toast.show('Please be patient.');
 }   
  $('#my-rcomments-container,#post-rcomments').empty();
   $('#prev-rcomments,#next-rcomments').css('display','none');
   fetch_rcomments("");   
 });
  
$('body').on('click','#prev-rcomments',function(){
 if( fetchingRComment){
   return android.toast.show('Please be patient.');
 }
  var page=$(this).attr('data-value');
  if(!page) return android.toast.show('No more comments.');
  
   fetch_rcomments("", page);   
 });
});
  
function deleteRComment(t){
  var this_=$(t);
  var cid=this_.attr('data-cid');
  var post_id=this_.attr('data-pid');
  var author=this_.attr('cauthor');
  
  if( !confirm('Delete selected comment?') ) return false;

 if(!cid){
    return toast('Comment id not found.');
  }
 
 var tb=$('#go-rcomment-box');
     tb.prop('disabled', true); 
      
    $('#post-rcomment-sending-cont').append('<span id="rcomment-sending-icon"><img class="w-20 h-20" src="file:///android_asset/loading-indicator/loading2.png"></span>');
  var loader=$('#rcomment-loader-container');
  loader.css('display','block');
 
  setTimeout(function(){
    $.ajax({
    url: config_.domain + '/oc-ajax/go-social/delete-comment.php',
    type:'POST',
  // timeout: 8000,
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
   $('#rcomment-sending-icon').remove();
   tb.prop('disabled', false); 
  if( result.status){
   $('#post-rcomments-container #ccc-' + cid).remove();
  }
   else if(result.error){
      toast(result.error );
  }
   else toast('Unknown error');
    loader.css('display','none');
 }).fail( function(e,txt,xhr){
   loader.css('display','none');
  $('#rcomment-sending-icon').remove();
  android.toast.show('Something went wrong');
  tb.prop('disabled', false);
  report__('Error "deleteRComment() in go-reply-comment.js"', JSON.stringify(e),true );
 
  });
    
  },1000);
}



function fetch_rcomments( parent_id, page_number){
  var cpi=$('#current-post-id');
  var post_by=$('#current-post-by').val();
  var post_id=$.trim(cpi.val() );
  parent_id=$.trim( $('#comment-parent-id').val() )||parent_id;
 
  page_number=page_number?'?page=' + page_number:'';
    
  var tb=$('#go-rcomment-box');
      tb.prop('disabled', true);
 
  var loader=$('#rcomment-loader-container');
  loader.css('display','block');
  var npBtn=$('#prev-rcomments,#next-rcomments');
  npBtn.prop('disabled',true);
    
  fetchingRComment=true;
  //var containerId=randomString(5);
   rcommentTimeout=setTimeout(function(){
     
  rcommentAjax=$.ajax({
    url: config_.domain + '/oc-ajax/go-social/fetch_comments-replies.php' + page_number,
    type:'POST',
   //timeout: 30000,
     dataType: "json",
    data: {
      "username": username,
      "parent_id": parent_id,
      "post_by": post_by,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function( result){
 // if( cpi.val()!=cpiv) return;
    fetchingRComment=false;
   npBtn.prop('disabled',false)
 //alert(JSON.stringify(result))
    var nextPage=result.next_page;
    var prevPage=result.prev_page;
    
  if(result.no_comment){
    
  $('#post-rcomments').html('<div class="text-center no-comment-container" id="no-rcomment-cont-' + parent_id + '">' + result.no_comment + '</div>');
  }
 else if( result.result){
    var rdata=result.result;
    var ipp=+result.item_per_page;
    var total=rdata.length;
 
 try{
   
   var likes_data="";
  
 /*
 var ldir=new android.File( MAIN_FOLDER, username + '/GO-COMMENTS-LIKES/' + post_id);
    var clfile=new android.File(ldir, 'likes.txt');
  if(clfile.isFile() ){
   //  clfile.createNewFile();
  var likes_data=$.trim( clfile.read()||"");
 }
   */
   
  $.each( rdata, function(i,v){
  
    var cid= v["id"];
    var likes=v["likes"];
    var cauthor=v["comment_author"];
    var comment=v["message"];
    var cfullname=v["fullname"];
    var has_replies=v["has_replies"];
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
    
    display_rcomment('prepend', cid, comment, post_files, meta, cauthor, cfullname, has_replies, false, nextPage,likes,liked);
  
  })
 }catch(e){
  toast(e); 
}
   
   npBtn.css('display','none');
 if( prevPage ){
   // $('#next-comments').attr('data-value', prevPage).css('display','block');  
 }
  if( nextPage ){
    $('#prev-rcomments').attr('data-value', nextPage).css('display','block');
 }
   
  }
   else if(result.error){
    toast(result.error,{type:'light',color:'#333'});  
  }
    loader.css('display','none');
    tb.prop('disabled', false);
   // sendBtn.prop('disabled', false)
  }).fail(function(e,txt,xhr){
  
  if( $('#go-rcomment-container').is(':visible') ){

   setTimeout( function(){
     fetch_rcomments( parent_id, page_number);
   },5000);

}
   else{ 
    fetchingRComment=false;
    npBtn.prop('disabled',false)
    loader.css('display','none');
 //  android.toast.show('Something went wrong');
    tb.prop('disabled', false);
   report__('Error "fetch_rcomment()"', JSON.stringify(e),true );
 
   }
 });
   },1000);
}


function display_rcomment( type, cid, comment, post_files, meta, author_, fullname, has_replies, me, paging,likes,liked){
   type=type||'append';
   
 if(me){   
   var mccont= $('#my-rcomments-container');
 }
else{
  var mccont=$('#post-rcomments');
}
 
  //var com_files=meta.com_files||"";
  var has_files=meta.has_files||"";
  var post_id= meta.post_id||"";
  
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
if(!isMe ){
  data+='<span class="d-inline-block go-comment-author-icon-container" style="margin-right: 5px; margin-left: 5px;">' + commentAuthorPicture( author_ ,'go-comment-author-icon nosave' ) + '</span>';
}
  
 data+='<div class="comment-bubble" id="' + cid + '">';
 data+='<span class="highlight comment-author go-open-profile" data-user-fullname="' + author + '" data-user="' + author_ + '">' + fullname + ' ' + icon + '</span>' ;
  
 data+='<div class="comment-message">' + bbcode_comment( comment) + '</div>';
 data+='<div class="go-comment-files-container">';
  
 data+= go_formatFiles( post_files, null,null,null, true );
 
  data+='</div></div>';
  
 if(isMe ){
  data+='<span class="d-inline-block go-comment-author-icon-container" style="margin-right: 5px; margin-left: 5px;">' + commentAuthorPicture( author_ ,'go-comment-author-icon nosave' ) + '</span>';
}
  
  data+='</div>';
 
  data+='<div class="comment-footer">';
  
 if(isMe || goAdmin(username) ){
   data+='<span class="mr-3" id="delc-' + cid + '" data-pid="'+ post_id + '" data-cid="' + cid + '" onclick="deleteRComment(this);" cauthor="' + author_ + '"><img class="w-16 h-16" src="file:///android_asset/chat-icons/delete.png"></span>';
 }
  likes=likes||0
  data+='<span class="comment-date">' + cdate + '</span>';
  data+='<span class="like-comment" id="like-comment-' + cid + '" data-cby="' + author_ + '" data-cid="' + cid + '" data-total-likes="' + likes + '" onclick="like_comment(this);">';
  data+='<span class="' + ( liked?'text-info':'text-secondary' ) + '"><strong>Like</strong></span>';
  data+='</span>';
  data+='<span id="reply-btn-' + cid + '" class="reply-comment text-secondary ml-3" onclick="replyComment(this);" data-parent-id="' + cid + '" data-tag="' + author_ + '" data-fullname="' + fullname + '"><strong>Reply</strong></span>';
  data+='<img id="like-img-' + cid + '" class="ml-3 w-16 h-16" src="file:///android_asset/chat-icons/' + ( liked?'liked':'like' ) + '.png"> <span class="likes" id="likes-' + cid + '">' + abbrNum( +likes, 1 ) + '</span>';
  
 if( has_replies ){
    //data+='<div class="text-dark mt-1 mb-2 text-center" onclick="replyComment(this);" data-cid="' + cid + '"><strong>View replies</div></div>';
  }
  data+='</div>';
  data+='</div>';
  
  if( type=='append'){
  mccont.append(data)
  } else{
  mccont.prepend(data);
  }
}


function format_comment(gpin, post_id, has_files, clen){
 var currentTime=moment().unix();
   var obj_=new Object();
  obj_.post_id="" +  post_id;
  obj_.cf="" +   username;
  obj_.fullname=userData('fullname');
  obj_.has_files=has_files||0;
  obj_.size="" + clen; //txt size or file size 
  obj_.time="" + currentTime;
  obj_.ver="" + config_.APP_VERSION;
  return obj_;
  }



function add_rcomment( fuser, comment, mlen){
   var fpaths=GO_COMMENT_UPLOADED_FILE_PATHS;
   var fpaths_="";
   var com_files="";
   var total_files=fpaths.length;
   var hasFiles=0;
  
  if( total_files){
    com_files= JSON.stringify( fpaths);
   hasFiles=1;
  }
  
 
   if( mlen> go_config_.mcl ){
    return toast('Comment too long.');  
  }
  var rcid=randomString(5);
  
  
  var tb=$('#go-rcomment-box');
      tb.prop('disabled', true);
   
  var cpi=$('#current-post-id');
  var cpiv=$.trim(cpi.val());
  var post_by= $.trim( $('#current-post-by').val() )
  var parent_id=$('#comment-parent-id').val();
 
/*
if( !$('#post-rcomment-sending-cont #rcomment-sending-icon').length){
    $('#post-rcomment-sending-cont').append('<span id="rcomment-sending-icon"><img class="w-20 h-20" src="file:///android_asset/loading-indicator/loading2.png"></span>');
  }
  */
  
 var sb=$('#post-rcomments-container');
     sb.scrollTop( sb.prop("scrollHeight") );
 
  var fullname=userData('fullname');
  
  var meta=format_comment(fuser, cpiv, hasFiles, mlen);
   
 var btn= $('#go-send-rcomment-btn');
    btn.prop('disabled',true);
  
  var displayComment=sanitizeLocalText( comment);
  var comment=sanitizeMessage( comment );
  
 
 var tagged="";
 var tagged_name="";
  
 var taggedDiv=$("#go-comment-tagged");

  if( taggedDiv.length){
   
  tagged=taggedDiv.attr("data-tagged")||"";
  tagged_name=taggedDiv.text()||"";
    
  comment="@[::" + tagged + "::" + tagged_name + "::] " + comment;
  displayComment="@[::" + tagged + "::" + tagged_name + "::] " + displayComment;
 
  }
  
  display_rcomment('append', rcid, displayComment, com_files, meta, username, fullname, 0, true);
  
 var cdiv=$('#my-rcomments-container #ccc-' + rcid);
 var delBtn= $('#my-rcomments-container #delc-' + rcid);
 var likeBtnCont=$('#my-rcomments-container #like-comment-' + rcid);
 var replyBtn=$('#my-rcomments-container #reply-btn-' + rcid);
 var likeIcon=$('#my-rcomments-container #like-img-' + rcid);
 
  delBtn.css('display','none');
  likeBtnCont.css('display','none');
  replyBtn.css('display','none');
  
  
  meta=JSON.stringify( meta);
  
  var loader=$('#rcomment-loader-container');
  loader.css('display','block');
 
  
  setTimeout(function(){
    $.ajax({
    url: config_.domain + '/oc-ajax/go-social/add-comment-reply.php',
    type:'POST',
 //  timeout: 30000,
     dataType: "json",
    data: {
      "username": username,
      "fullname": fullname,
      "message": comment,
      "meta": meta,
      "post_files": com_files,
      "has_files": hasFiles,
      "post_id": cpiv,
      "parent_id": parent_id,
      "post_by": post_by,
      "tagged": tagged,
      "tagged_name": tagged_name,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
  //alert(JSON.stringify(result) );
  //$('#rcomment-sending-icon').remove();
   
  loader.css('display','none');
 
   btn.prop('disabled', false);
   tb.prop('disabled', false);
      
 if( result.status=='success'){
   goRemoveCommentTagged();
   
   sessionStorage.removeItem('temp-com-text-' + fuser);
   GO_COMMENT_UPLOADED_FILE_PATHS=[];
   $('#go-rcomment-upload-preview-container').empty()
   $('#post-rcomments #no-rcomment-cont-' + parent_id).remove();
   var id= result.result;
 
if(id){
  delBtn.attr('data-cid', id).attr('data-pid', cpiv).css('display','inline-block');
  cdiv.attr('id', 'ccc-' + id);
  $('#likes-' + rcid).attr('id', 'likes-' + id);
  likeBtnCont.attr('data-cid', id).attr('id', 'like-comment-' + id).css('display','inline-block');
  likeIcon.attr('id','like-img-' + id);
  replyBtn.attr('data-parent-id', parent_id).attr('id','reply-btn-' + id).css('display','inline-block');
}
   tb.val("");
   tb.autoHeight();
  return;
 }else if(result.error){
    toast( result.error);
   $('#post-rcomments-container #ccc-' + rcid ).remove();
 }

 }).fail(function(e,txt,xhr){
    //$('#rcomment-sending-icon, #post-comments-container #ccc-' + rcid ).remove();
  
   loader.css('display','none');
 
   android.toast.show('Something went wrong');
   tb.prop('disabled', false);
   btn.prop('disabled', false);
  report__('Error "add_rcomnent()"', JSON.stringify(e),true );
 
  });
    
  },1000);
}


function replyComment(t, parent_cauthor){
  var this_=$(t);
  
  var cfullname=this_.data('fullname')||"";
  
  var tag=this_.data('tag');
  if( tag){
   if( tag!=username){
     $('#go-comment-tagged-cont').html('<span id="go-comment-tagged" data-tagged="' + tag + '">' + cfullname + '</span> <span onclick="goRemoveCommentTagged();" class="text-danger">X</span>');
   }
    return;
  }
  else if ( parent_cauthor){
    if( parent_cauthor!=username){
     $('#go-comment-tagged-cont').html('<span id="go-comment-tagged" data-tagged="' + parent_cauthor + '">' + cfullname + '</span> <span onclick="goRemoveCommentTagged();" class="text-danger">X</span>');
   }
  }
  
  var cid=this_.data('parent-id');
  $('#comment-parent-id').val(cid);
  
 //var ccont=$('#ccc-' + cid);
  
  var ccont= $('#go-rcomment-container');
  
  ccont.css({'display':'block','z-index': 47});

  var cpi=$('#current-post-id');
  
  var cpiv=$.trim( cpi.val() );
  var post_by= $('#current-post-by').val();

 
 var mccont= $('#my-rcomments-container')
  
 var pc=$('#post-rcomments');  
 
  $('#prev-rcomments').css('display','none');
   mccont.empty();
   pc.empty();
 if(commentRAjax) commentRAjax.abort();
   clearTimeout( commentRTimeout);
  fetch_rcomments(cid);
  
  var zi=zindex();

   ccont.css({'display':'block','z-index': zi }); 
}


function goRemoveCommentTagged(){
  $('#go-comment-tagged-cont').empty();
}


$(function(){
  
  $('body').on('click','#go-send-rcomment-btn',function(e){ 
 var textBox=$('#go-rcomment-box'); 
 var msg=$.trim( textBox.val() );
 var fuser=""
 var mlen=( msg.length+1)/1024;
     
  var this_=  $(this);
     
 if( GO_COMMENT_UPLOAD_FILE_PATHS.length>0 ){
    this_.prop('disabled',true);
  return goCommentUploadFiles();
 }
   
 if( GO_COMMENT_UPLOADED_FILE_PATHS.length<1 && !msg){   
   return toast('Post still empty.');
   }
   this_.prop('disabled',true);
    add_rcomment(fuser, msg, mlen );
 });
   
 
$('body').on('click','#go-rcomment-upload-file-btn', function(){
  $('#go-rcomment-upload-preview-container').empty();
   
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
 
});
  