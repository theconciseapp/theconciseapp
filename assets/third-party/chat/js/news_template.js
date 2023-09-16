$(function(){
  
  $('#stadiums').on('click','.load-comment',function(){
   var this_=$(this);
   var news_id=this_.data('id');
  var cdiv= $('#stadiums #comment-container-' + news_id);
 if( cdiv.length){
   cdiv.show();
   return;
 }
   var news='';
   var mt=$('#message-text-' + news_id);
   if( !mt.hasClass('message-file') ){
     news= mt.text().substr(0,100);
   }
     alert(news)
   
   var fuser=chatOpened('s');
    $('#stadiums .comment-container').remove();
   var data=commentLayout(news_id);
    $('#stadium-content-' + fuser).append( data);
   
    
 $.ajax({
   url: config_.domain + '/oc-ajax/news-comments.php',
   type: 'POST',
   data:{
     username: username,
     news_id: news_id,
     version: config_.APP_VERSION,
     token: __TOKEN__
   }
   
 }).done(function(result){
   listComment(result );
 }).fail(function(e, txt, xhr){
   toast('Check your internet connection. ' +xhr);
 });
      
  });
});

function postReply(commentId) {
   $('#commentId').val(commentId);
    $("#name").focus();
     }

function listComment( data) {
     // $.post("comment-list.php", function (data) {
    var data = JSON.parse(data);
    var comments = "";
    var replies = "";
    var item = "";
    var parent = -1;
    var results = new Array();

  var list = $("<ul class='outer-comment'>");
 var item = $("<li>").html(comments);

  for (var i = 0; (i < data.length); i++){
  var commentId = data[i]['comment_id'];
   parent = data[i]['parent_comment_id'];

     if (parent == "0"){
                                    comments = "<div class='comment-row'>"+
                                    "<div class='comment-info'><span class='commet-row-label'>from</span> <span class='posted-by'>" + data[i]['comment_sender_name'] + " </span> <span class='commet-row-label'>at</span> <span class='posted-at'>" + data[i]['date'] + "</span></div>" + 
  "<div class='comment-text'>" + data[i]['comment'] + "</div>"+
                                    "<div><a class='btn-reply' onClick='postReply(" + commentId + ")'>Reply</a></div>"+
                                    "</div>";

  var item = $("<li>").html(comments);
                                    list.append(item);
  var reply_list = $('<ul>');
     item.append(reply_list);
                                    listReplies(commentId, data, reply_list);
        }
    }
  $("#output").html(list);
     //});
 }

  function listReplies(commentId, data, list) {
   for (var i = 0; (i < data.length); i++){
  if (commentId == data[i].parent_comment_id){
  var comments = "<div class='comment-row'>"+ " <div class='comment-info'><span class='commet-row-label'>from</span> <span class='posted-by'>" + data[i]['comment_sender_name'] + " </span> <span class='commet-row-label'>at</span> <span class='posted-at'>" + data[i]['date'] + "</span></div>" + 
 "<div class='comment-text'>" + data[i]['comment'] + "</div>"+
   "<div><a class='btn-reply' onClick='postReply(" + data[i]['comment_id'] + ")'>Reply</a></div>"+
                        "</div>";
                        var item = $("<li>").html(comments);
   var reply_list = $('<ul>');
     list.append(item);
     item.append(reply_list);
    listReplies(data[i].comment_id, data, reply_list);
          }
        }
    }

function commentLayout(news_id){
  var data='<div class="comment-container" id="comment-container-' + news_id + '">';
      data+='<input type="hidden" id="current-news-id" value="' + news_id + '">';
  data+='<div class="comment-title">Title</div>';
     data+='<div class="comment-text" id="output">';
    data+='Loading Comments';
   data+='</div></div>';
  return data;
}

function sendComment(){
  var name=localStorage.getItem('display_name');
  var tb=$('#text-box');
  var message=$.trim( tb.val() );
  if( ( message.length/1024)>config_.max_text_size ){
    return toast('Message too long.');
  }
 
 if( $('.lsx-emojipicker-container').is(':visible') ){
      $('#emoji-container').click();
   }
  if(!message){  return false; }
  var news_id=$.trim($('#current-news-id').val());
  if(!news_id){
    return toast('News id not found.');
}
  $.ajax({
    url: config_.domain + '/oc-ajax/add-comment.php',
    type: 'POST',
    data: {
      username: username,
      display_name: name,
      message: message,
      news_id: news_id,
      version: config_.APP_VERSION,
      token: __TOKEN__
    }
  }).done(function(result){
    alert(result)
  tb.val('');
   $('#send-message-btn').hide();
   $('#voice-message-btn').fadeIn();
   tb.autoHeight();
  }).fail(function(e,txt,xhr){
    toast('Check your network connection. ' + xhr);
  });
  
  
}



