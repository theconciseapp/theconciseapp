var sendBtn=$('#send-message-btn');
var voiceBtn= $('#voice-message-btn');
var attachBtn= $('#attachment-btn-container');
var fetchingComment=false;
var commentAjax;
var commentTimeout=0;

$(function(){
 
$('body').on('click','.post-comment-btn',function(){
  var gpin=chatOpened('s');
  if( !inGroups(username, gpin) ){
    return toast('You are not a member.');
 }
   if($(".message-selected").length ) return;
  
  var this_=$(this);
  var pid= this_.attr('data-chatid');
  if( pid.length<5 ) return toast('Post id not found.');
  
  var highlight=this_.attr('data-highlight')||"";
  highlight=highlight.replace(/(\s|<br>|\?r|\?b|\?g|\?lg|\?sm|`|-|\*|\~|_|\|)/g,' ');
  
  attachBtn.css('visibility','hidden');
  sendBtn.css('display','inline-block');
  voiceBtn.css('display','none');
  
  var ccc=$("#can-comment-container");
  
  if( ccc.css("display")=="block"){
     ccc.attr("data-state","block");
     ccc.css("display","none");
  }else{
    ccc.attr("data-state","none");
  }

  $('#post-comment-title').text(highlight);
  var cpi=$('#current-post-id');
  var cpiv=$.trim(cpi.val() );
      cpi.val( pid);
 var ccont= $('#comment-container')
 var mccont= $('#my-comments-container')
  
 var pc=$('#post-comments');  
 
  //Get comments user already liked
  var ldir=new android.File( MAIN_FOLDER, username+'/COMMENTS-LIKES/' +pid);

 if( !ldir.isDirectory() && !ldir.mkdirs()){
   return toast('Could not create necessary dir',{type:'light',color:'#333'});
 }
  var clfile=new android.File(ldir,'likes.txt');
 if(!clfile.isFile() && !clfile.createNewFile()){
    return toast('Could not create likes file',{type:'light',color:'#333'});
  }
 var likes_data=$.trim( clfile.read());
  sessionStorage.setItem('current_post_comments_likes', likes_data);
  
 if(cpiv!=pid){ 
  $('#prev-comments').css('display','none');
   mccont.empty();
   pc.empty();
 if(commentAjax) commentAjax.abort();
   clearTimeout(commentTimeout);
 fetch_comments(  pid);
 }
   ccont.css('display','block');
  $('#cover-text-box').css('display','none');

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

  if(!confirm('Delete selected comment?') ) return false;

 if(!cid){
    return toast('Comment id not found.');
  }
 
 var tb=$('#text-box');
     tb.prop('disabled', true); 
    
var gpin=chatOpened('s'); 
  
    $('#post-comment-sending-cont').append('<span id="comment-sending-icon">' + msicon('awaiting') + '</span>');
  var loader=$('#comment-loader-container');
  loader.css('display','block');
 
  setTimeout(function(){
    $.ajax({
    url: config_.domain + '/oc-ajax/comment/delete-comment.php',
    type:'POST',
  // timeout: 10000,
     dataType: "json",
    data: {
      "username": username,
      "group_pin": gpin,
      "comment_id": cid,
    //  "post_id": cpiv,
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
      toast( result.error );
  }
   else toast('Unknown error');
    loader.css('display','none');
 }).fail(function(e,txt,xhr){
   loader.css('display','none');
  $('#comment-sending-icon').remove();
  toast('Could not delete. ' + xhr, {type:'light',color:'#333'});
    tb.prop('disabled', false); 
   report__('Error "delete-comment"', JSON.stringify(e), true );
  });
    
  },1000);
});
  
});



function fetch_comments( post_id,page_number){
  var cpi=$('#current-post-id');
  var cpiv=$.trim(cpi.val() );
   post_id=cpiv||post_id;
  page_number=page_number?'?page=' + page_number:'';
  
  var gpin=chatOpened('s');
 
  var tb=$('#text-box');
      tb.prop('disabled', true);
 
  var loader=$('#comment-loader-container');
  loader.css('display','block');
  $('#prev-comments,#next-comments').prop('disabled',true);
    
  fetchingComment=true;
  //var containerId=randomString(5);
   commentTimeout=setTimeout(function(){
     
  commentAjax=$.ajax({
    url: config_.domain + '/oc-ajax/comment/fetch_comments.php' + page_number,
    type:'POST',
  // timeout: 10000,
     dataType: "json",
    data: {
      "username": username,
      "group_pin": gpin,
      "post_id": post_id,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function( result){
  if( cpi.val()!=cpiv) return;
    fetchingComment=false;
    $('#prev-comments, #next-comments').prop('disabled',false)
    // alert(JSON.stringify(result))
    var nextPage=result.next_page;
    var prevPage=result.prev_page;
    
  if( result.no_comment){
    
  $('#post-comments').html('<div class="text-center no-comment-container" id="no-comment-cont-' + post_id + '">No Comment Yet</div>');
   // display_comment(0,"No comments yet.","", moment().unix(),false, "", page_number);
  }
 else if( result.result){
    var rdata=result.result;
    var ipp=+result.item_per_page;
    var total=rdata.length;
  
  var cnt=-1;
 
 try{
    var ldir=new android.File( MAIN_FOLDER, username + '/COMMENTS-LIKES/' + post_id);
  var clfile=new android.File(ldir,'likes.txt');
  if(!clfile.isFile() ) clfile.createNewFile();
  var likes_data=$.trim( clfile.read());
   
  $.each( rdata, function(i,v){
 
    var meta=v["meta"];
    var cid= v["id"];
    var likes=v["likes"];
   var comment=v["message"];
    
   var author=v["comment_author"]
  if( likes_data.search(',' + cid + ',')>-1){
  var liked=true;
  }else {
   var liked=false;
  }    
    display_comment('prepend', cid, comment, author, meta, false, nextPage,likes,liked);
         });
   
  }catch(e){
    //Ignore
  //  toast(e);
    report__('Error "fetch_comment()"', e,true );
 
}
 
    
    $('#next-comments,#prev-comments').css('display','none');
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
  }).fail(function(e,txt,xhr){
    fetchingComment=false;
    $('#prev-comments,#next-comments').prop('disabled',false)
    loader.css('display','none');
    android.toast.show('Something went wrong');
    tb.prop('disabled', false);
    report__('Error "fetch_comment()"', JSON.stringify(e),true );
 
  });
   },1500);  
}



function display_comment( type, cid, msg, author_, meta, me, paging,likes,liked){
  type=type||'append';

 if(me){   
   var mccont= $('#my-comments-container');
 }
else{
  var mccont=$('#post-comments');
}
 
  var meta=JSON.parse( meta);
  
  var fullname=meta.fullname||author_;
  var v=checkVerified( author_, fullname);
  var icon=v.icon;
  var author= v.name;

 var ctime=meta.time||moment().unix();
  var cdate=toDate( ctime ,'comment_date');

 // ret+='<div class="col ' + ( is_admin?'group-user-options':'') + '" data-gpin="' + gpin + '" data-fuser="' + guser + '"> <div class="group-member-name friend friend-' + guser + '" data-fname="' + name + '" data-type="friend" data-friend="' + guser + '">' + name + verified + '</div>';
  var isMe=false;
  
 if( author_==username){ 
    isMe=true;
  }
  
 var data='<div class="comment-child-container ' + (isMe?'my-comment-container':'') + '" id="ccc-' + cid + '">';
  data+='<div class="' + ( isMe?'text-right':'') + '">';
 data+='<span class="d-inline-block friend-picture-bg" style="margin-right: 5px;">' + friendProfilePicture( author_ ,'friend-picture nosave' ) + '</span>';
 data+='<div class="comment-bubble" id="' + cid + '">';
 data+='<span class="highlight comment-author ' + ( PAGISTS__?'':'friend') + ' friend-' + author_ + '" data-fname="' + author + '" data-type="friend" data-friend="' + author_ + '">' + strtolower( author) + '</span> ' + icon ;
 data+='<span class="d-none friend-name-' + author_ + '">' + author + '</span>';
  data+='<div class="comment-message">' + msg + '</div>';
  data+='</div></div>';
 
  data+='<div class="comment-footer">';
  
 if(isMe){
   data+='<span class="delete-comment" id="delc-' + cid + '" data-cid="' + cid + '"><img class="w-16 h-16" src="file:///android_asset/chat-icons/delete.png"></span>';
 }
  data+='<span class="comment-date">' + cdate + '</span>';
  data+='<span class="like-comment" id="like-comment-' + cid + '" data-cid="' + cid + '" onclick="like_comment(this);">';
 if(author_) data+='<img id="like-img-' + cid + '" class="w-16 h-16" src="file:///android_asset/chat-icons/' + ( liked?'liked':'like' ) + '.png"><span class="likes" id="likes-' + cid + '">' + (likes||0) + '</span></span>';
  data+='<span class="d-none unlike-comment" data-cid="' + cid + '"><img class="w-16 h-16" src="file:///android_asset/chat-icons/dislike.png"></span>';
  data+='</div>';
  data+='</div>';
  if(type=='append'){
  mccont.append(data)
  }
  else{
  mccont.prepend(data);
  }
}


function format_comment(gpin, post_id, clen){
 var currentTime=moment().unix();
   var obj_=new Object();
  obj_.pid="" +  post_id;
  obj_.cf="" +   username;
  obj_.ct="" +   gpin;
  obj_.fullname="" + userData('fullname');
  obj_.file=""; //video, image
  obj_.lfpath=""; //local file path
  obj_.sfpath=""; //server file path
  obj_.hl=""; //Highlight (text or file highlight)
  obj_.pt=""; //preview text
  obj_.size="" + clen; //txt size or file size  
  obj_.fx="";
  obj_.time="" + currentTime;
  obj_.ver="" + config_.APP_VERSION;

  return JSON.stringify(obj_); 
  }



function add_comment( fuser, comment, mlen){
 
 if( comment.length<2 ){
    return android.toast.show('Too short.');
   }
  else if( mlen>2){
    return toast('Comment too long.');  
  }
  var rcid=randomString(5);
  
  var displayComment=sanitizeLocalText( comment);
  comment=sanitizeMessage( comment );
  
  var tb=$('#text-box');
      tb.prop('disabled', true);
   
  var cpi=$('#current-post-id');
  var cpiv=$.trim(cpi.val());
 
  if( !$('#post-comment-sending-cont #comment-sending-icon').length){
    $('#post-comment-sending-cont').append('<span id="comment-sending-icon">' + msicon('awaiting') + '</span>');
  }
  
 var sb=$('#post-comments-container');
     sb.scrollTop( sb.prop("scrollHeight") );
  
  var meta= format_comment(fuser, cpiv, mlen);

  display_comment('append', rcid, displayComment, username , meta, true);
  
 var cdiv=$('#my-comments-container #ccc-' + rcid);
 var delBtn= $('#my-comments-container #delc-' + rcid);
 var likeBtnCont=$('#my-comments-container #like-comment-' + rcid);
 var likeBtn=$('#my-comments-container #like-img-' + rcid);
  delBtn.css('display','none');
  likeBtnCont.css('display','none');
  
    sendBtn.prop('disabled',true);
  
  setTimeout(function(){
    $.ajax({
    url: config_.domain + '/oc-ajax/comment/add_comment.php',
    type:'POST',
  // timeout: 10000,
     dataType: "json",
    data: {
      "username": username,
      "group_pin": fuser,
      "message": comment,
      "meta": meta,
      "post_id": cpiv,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
   // alert(JSON.stringify(result) );
  $('#comment-sending-icon').remove();
   sendBtn.prop('disabled', false);
   tb.prop('disabled', false);
 if( result.status){
   sessionStorage.removeItem('temp-text-' + fuser);
   $('#post-comments #no-comment-cont-' + cpiv).remove();
   var id= result.result;
 
if(id){
  
  delBtn.attr('data-cid', id).css('display','inline-block');
  cdiv.attr('id', 'ccc-' + id);
  $('#likes-' + rcid).attr('id','likes-' + id);
  likeBtnCont.attr('data-cid',id).css('display','inline-block');
  likeBtn.attr('id','like-img-' + id);
  
}
  // tb.val('');
   clearTextBox()
   //tb.autoHeight();
  return;
 }else if(result.error){
    toast( result.error);
   $('#post-comments-container #ccc-' + rcid ).remove();
 }

 }).fail(function(e,txt,xhr){
    $('#comment-sending-icon, #post-comments-container #ccc-' + rcid ).remove();
   android.toast.show('Please try again');
    tb.prop('disabled', false);
   sendBtn.prop('disabled', false);
  report__('Error "add_comment()"', JSON.stringify(e),true );
 
  });
    
  },1000);
}


function like_comment(t){
  var this_=$(t);
  var cpi=$('#current-post-id');
  var post_id=$.trim(cpi.val() );
 
  var cid=this_.attr('data-cid');
 
 var ldir=new android.File(MAIN_FOLDER, username +'/COMMENTS-LIKES/' + post_id);
 
 if( !ldir.isDirectory() && !ldir.mkdirs()){
   return toast('Could not create necessary dir.',{type:'light',color:'#333'});
 }
  
var clfile=new android.File(ldir,'likes.txt');
  if(!clfile.isFile() && !clfile.createNewFile()){
    return toast('Could not create likes file.',{type:'light',color:'#333'});
  }
  
 var ldata=$.trim( clfile.read());
  var type=1;
  if( ldata.search(',' + cid + ',')>-1){
  type=2;  
 }
    
  var gpin=chatOpened('s');
 
  var tb=$('#text-box');
      tb.prop('disabled', true);
   this_.prop('disabled',true);
  var loader=$('#comment-loader-container');
  loader.css('display','block');
 
 commentLikeTimeout=setTimeout(function(){
     
  commentAjax=$.ajax({
    url: config_.domain + '/oc-ajax/comment/like-comment.php',
    type:'POST',
  // timeout: 10000,
     dataType: "json",
    data: {
      "username": username,
      "group_pin": gpin,
      "comment_id": cid,
      "post_id": post_id,
      "type": type,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function( result){
  //  alert( JSON.stringify(result))
    loader.css('display','none');
    this_.prop('disabled', false);
    tb.prop('disabled', false);
  if(result.status){
    clfile.append(',' + cid + ',');
   var elem= $('#comment-container #likes-' + cid);
   var curr_likes=+elem.text();
    
   if(type==1){
     elem.text( curr_likes + 1);
   $('#like-img-' + cid).attr('src','file:///android_asset/chat-icons/liked.png');
   }
    else {
      elem.text( curr_likes - 1);
     ldata= ldata.replace(new RegExp(',' + cid + ',','g') , '');
  if(  clfile.write(ldata) ){
   $('#like-img-' + cid).attr('src','file:///android_asset/chat-icons/like.png');
  }
    }
 }else if( result.error){
    toast(result.error );
 }
    
  }).fail(function(e,txt,xhr){
    loader.css('display','none');
    this_.prop('disabled', false);
    tb.prop('disabled', false);
    android.toast.show("Something went wrong")
    report__('Error "like_comment()"', JSON.stringify(e),true );
 
 });

 },2000);
}


function closeComment(){
  var gpin=chatOpened('s');
  var is_admin=is_group_admin(gpin, username);
  var ctb=$('#cover-text-box');
  
  $('#comment-container').css('display','none');
  
  if( isGroupPage(gpin) && !is_admin){
 var glock=new android.File( MAIN_FOLDER, username + '/CHATS/' + gpin + '/lock.md')

if( glock.isFile() ){
  ctb.css('display','block');
    } 
   } 
 
  var ccc=$("#can-comment-container");
  var st=ccc.attr("data-state");
  
  if( st=="block"){
    ccc.css("display","block");
  }
  
 var tb=$("#text-box").val();
  
  if( tb.length<1){
  sendBtn.css('display','none');
  voiceBtn.css('display','block');
  attachBtn.css('visibility','visible');
  }
}