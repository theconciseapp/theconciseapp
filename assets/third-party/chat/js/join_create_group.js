var gMembersCount=0;
var gTotalMembers=0;

function is_group_admin( gpin, user_name){
  var gadmins=$.trim( localStorage.getItem( SITE_UNIQUE__ + "_" + gpin + "_" + username + "_group_admins") )||""; 
  if(!gadmins ) return false;
  gadmins=gadmins.split(',');
  if( $.inArray(user_name, gadmins) >-1 ){
    return true;
  }
   else return false;
 }

function remove_from_group_admin(gpin ){
  localStorage.removeItem( SITE_UNIQUE__ + '_' + gpin + '_' + username + '_group_admins');  
}

function add_as_group_admin(gpin){
  localStorage.setItem( SITE_UNIQUE__ + '_' + gpin + '_' + username + '_group_admins', username + ',');  
}
  

function lock_unlock_group(gpin_, status){
  //Status: locked or unlocked
 localStorage.setItem( SITE_UNIQUE__ + '_' + gpin_ + '_' + username + '_lock_status', status);
 try{
   var gldir=new android.File(MAIN_FOLDER, username + '/CHATS/' + gpin_ );

if(!gldir.isDirectory() && !gldir.mkdirs()){
   return toast("Group LS");
}
   
   var glock=new android.File( gldir, '/lock.md');
   if( status=='locked'){
     glock.write('locked');
  }else if(  glock.isFile() ){
    glock.delete();
  }
  }catch(e){
    report__("Error: getMessage: glock_status-", e);
    logcat("function getMessage[glock_status]:main.js", e); 
     
  }
}

function groupLocked( gpin){
   var glock=new android.File( MAIN_FOLDER, username + '/CHATS/' + gpin + '/lock.md');
  if( glock.isFile()) return true;
  else return false;
}




function inGroups( username_, gpin){
  var groups=$.trim(localStorage.getItem( SITE_UNIQUE__ + '_' +  username_ + '_groups')||"");
   if(!groups  ) return false;
  groups=strtolower(groups ).split(' ');
 gpin=strtolower(gpin);

  if( $.inArray( gpin, groups )>-1)
    return true;
  else return false;
}



function showGroups(reload ){
  if(chatOpened() ) {
    closeChat();
   }
 var div=$('#groups-container');
  div.addClass('viewing-groups');
  div.css('display','block');
   
if(!reload ){
  if( div.hasClass('groups-loaded') ){
   //alert('loaded already');
   return;
  }
}
   div.addClass('groups-loaded');    
 
  try{
 
   var groups=loadGroups();
   $('#groups-list').html( groups );
   
  sortElementsById('#groups-list>.contact-container','#groups-list', true);
  //lazyLoadFriendsThumb('#groups-list');
   
}catch(e){ 
  report__('Error "showGroups()"',e); 
     }
  }


function groupProfilePicture(gpin,thumb ){
  var div=$('#group-profile-picture-div');
  //.html('<img data-id="' + strtolower(username ) + '" id="my-profile-picture" src="' + MAIN_FOLDER + '/' + username + '/CHATS/' + gpin + '/profile_picture.jpg?' + randomString(3) + '" onerror="imgError(this);">');
 div.html('<img src="' + MAIN_FOLDER + '/' + username + '/CHATS/' + gpin + '/profile_picture' + (thumb?'_small':'') + '.jpg?i=' + randomString(4) + '" id="group-profile-picture" data-id="' + strtolower( gpin ) + '" onerror="imgError(this);">');    

}

function groupSettings( gpin){   
 var glock=new android.File( MAIN_FOLDER, username + '/CHATS/' + gpin + '/lock.md');
  var div=$('#group-lock-status');
  div.attr('data-gpin',gpin);
  var text="Only admins";
  
  if ( !glock.isFile()  && gpin!=='gv_pofficials'){
     text="All members";
  }
  
 div.text(text);
 
 }


function openContactList(){
//Show this form if page admin 
//can be added by typing user pin  var data='<div class="center_text_div text-center" style="padding: 15px;">';
if( PAGISTS__){
 var data='<div class="center_text_div">';
     data+='<div class="container p-2"><input class="form-control" id="add-page-admin-box" placeholder="Enter user pin">';
     data+='<div class="text-center mt-2 mb-3"><button onclick="manual_adminify();" class="btn btn-sm btn-success">Add</button></div>';
     data+='</div></div>';
 return displayData( data,{  data_class:'.add-page-admin-box-form'});
}
  
 // var cover=$('#chats-list-cover-container');
 var div=$('#recipients-container');
  div.addClass('viewing-recipients').css('display','block');
  //cover.show();
  try{
   
  $('#recipients').html( loadContacts('add-to-page-admin') );
   var fuser=chatOpened('s');
   sortElementsById('#recipients>div','#recipients', true);

}catch(e){ 
  report__('Error "selectRecipients()"',e); 
     }
  }


function manual_adminify(){
  var box=$('#add-page-admin-box');
  var fuser=$.trim( box.val());
  if( !validUsername( fuser) ) {
     toast('Please enter a valid user pin. Min: 4 characters.',{type:'light',color:'#333'});      
    return;
   }
 
  var gpin=chatOpened('s');
  goBack();
  adminify(gpin, fuser,'add-admin');
}


$(function() {
  
  $('#recipients-container').on('click','.add-to-page-admin',function(){
    var this_=$(this );
    var fuser=this_.data('friend');
    var gpin=chatOpened('s');
   goBack();
  $('#recipients').empty();
    adminify(gpin,fuser,'add-admin' );
  });

//  var selector='.highlight';
  $('body').on('touchstart', '.highlight', function(){ 
       $(this).addClass('mouseover');   
    }).on('touchend touchmove click press','.highlight', function(e){ 
    $(this).removeClass('mouseover');
  });
  
  $('body').on('click','#group-profile-username',function(){
   var gpin=$.trim($(this).text());
    android.clipboard.setText(gpin);
    toast('Copied to clipboard.',{type:'info'});
 });
  
  
$('body').on('click','#join-group-form-btn',function(){
  $('#join-group-form').slideToggle();
  $('#join-group-title, #join-group-info').empty();
  $('#join-group-pin').val('');
});
  
 $('body').on('click','#create-group-tip', function(e){
   e.preventDefault();
    var data='<div class="center_text_div text-left;">';
     data+='<div class="container-fluid text-left" style="font-size: 15px; padding: 0 15px 15px 15px;">';
    data+='<strong>Group</strong>';
    data+='<div class="mt-1 pl-2">&bull; Limited number of members</div>';
  //  data+='<div class="pl-2">&bull; Members can post</div>';
  //  data+='<div class="pl-2">&bull; Members can comment on admin posts</div>';
  
   data+='<div class="mt-2">';
   data+='<strong>Page</strong>';
   data+='<div class="mt-1 pl-2">&bull; Unlimited number of followers</div>';
  // data+='<div class="pl-2">&bull; Members can post</div>';
  // data+='<div class="pl-2">&bull; Followers can comment on admin posts</div>';
   
   data+='</div></div></div>';
   
   displayData(data,{ data_class:'.create-group-tips', osclose: true});
  }); 
  
  
  
 $('body').on('click','#group-lock-status-cont', function(){
   var div=$('#group-lock-status');
  var gpin=div.attr('data-gpin');
  var glock=new android.File(MAIN_FOLDER, username + '/CHATS/' + gpin+ '/lock.md');
  var option='Only admins';
    
 if( glock.isFile()  && gpin!=='gv_pofficials' ){
   option='All members';
 }
    var data='<div class="center_text_div text-left;">';
     data+='<div class="container-fluid text-left" style="padding: 15px;">';
    data+='Choose who can send messages to this group';
    data+='<div id="change-group-lock-status" class="bg-light mt-2 p-2" style="font-size: 15px;">' + option;
    data+=' <img style="display: none;" id="cgls-loading" class="w-16" src="file:///android_asset/loading-indicator/loading2.png">';
   data+='</div></div></div>';
   
   displayData(data,{ data_class:'.group-lock-status-change',osclose: true});
});
  
 
$('body').on('click','#change-group-lock-status', function(){
 var div=$('#group-lock-status');
  var gpin=div.attr('data-gpin');
  var glock=new android.File(MAIN_FOLDER, username + '/CHATS/' + gpin+ '/lock.md');
 
  var lock="lock";
  
 if( glock.isFile()  && gpin!=='gv_pofficials'){
   lock="unlock";  
 }
  var loader=$('#cgls-loading');
  loader.css('display','inline-block');
  $.ajax({
    url: config_.domain + '/oc-ajax/group/change-group-lock-status.php',
    type:'POST',
  timeout: 20000,
     dataType: "json",
    data: {
      "username": username,
      "lock_status": lock,
      "group_pin": gpin,
      "version": config_.APP_VERSION,
      'token': __TOKEN__
    }
  }).done(function(res){
   closeDisplayData('.group-lock-status-change');
   if(res.status){
 try{
   if( res.result=='1'){
   glock.write('locked')
 }else{
   glock.delete();
 }   
 }catch(e){ toast(e); }
}
  else if( res.error){
   android.toast.show(res.error);
  }else{
   toast('Unidentified error occured.');
 }
    
 groupSettings( gpin);
  }).fail(function(e,txt,xhr){
    closeDisplayData('.group-lock-status-change');   
  android.toast.show("Something went wrong");     
  
   report__('Error "#change-group-lock-status", fail in join-create-group.js', JSON.stringify(e) );
  });
  
 });
  
  
$('body').on('click','#create-group-form-btn',function(){
  var div=$('#create-group-form-container');
   var this_=$(this);
    if(this_.hasClass('loaded') ){
   div.addClass('viewing-create-group-form');
      div.fadeIn();
      return;
    }
   this_.prop('disabled',true);
    
   $.ajax({
      url: 'file:///android_asset/create-group-form.html'
    }).done(function(result ){
      div.html(result);
      this_.addClass('loaded');
      this_.prop('disabled', false);
     div.addClass('viewing-create-group-form');
     div.fadeIn();
    }).fail(function(e,txt,xhr){
     this_.prop('disabled', false);
     toast( JSON.stringify(e));
   });
    
});
  
  var cgTimeout;
  
$('body').on('input','#join-group-pin',function(){ 
  var this_=$(this);
  clearTimeout(cgTimeout);
   var cont= $("#join-group-info-cont");
  cont.css('display','none');
  cont.find('div').empty();
 
  $('#join-group-btn,#check-group-loading').css('display','none');
  var group_pin=$.trim( this_.val() );
  
  var len=group_pin.length;
  if( len<11 || len>11 ){
    return;
  }
   else if(!validUsername( group_pin) ){
    return toast('Group pin does not exist.',{type:'light',color:'#333'});
  }
  else if ( strtolower(group_pin)=='gv_pofficials') {
    return toast('Group pin does not exist.');
  }
  else if( inGroups( username, group_pin) ){
      return toast('You already joined this group.',{type:'info'});
   }
  $('#check-group-loading').css('display','inline-block');
   cgTimeout=setTimeout(function(){
     checkGroupExists( group_pin);
   },2000);
});
  
  
 $('body').on('click','#join-group-btn', function(){ 
  var this_=$(this);
 
  var group_pin=$.trim( $('#join-group-pin').val() );
  if( group_pin.length<11 ){
    return toast('Group pin not valid.');
  
  }else if(!validUsername( group_pin) ){
    return toast('Group pin not valid.');
  }
  
 else if( inGroups(username,  group_pin) ){ 
   
 // if( CONTACTS__[group_pin]){
    return toast('You already joined this group.',{type:'info'});
  }
   
   toast('Joining...',{type:'info',hide:10000});
   joinGroup(group_pin);
});
  
  
$('body').on('click','#create-group-btn',function(){ 
  var this_=$(this);
    var gtitle=$('#create-group-title');
    var ginfo= $('#create-group-info');
    var cpage=$('#create-page');
    
   var gt= $.trim( gtitle.val() );
   var gi=$.trim( ginfo.val() )
   var gtlen=gt.length;
   var gilen=gi.length;
    
    var type=1;
  if(cpage.is(':checked')){
    type=2;
  }
   
   if(gtlen<1){
   return  toast('Enter group title.');
   }
    else if (gtlen>30 ){
   return toast("Group's title too long. Max: 30 characters.");  
  }
 if(gilen<4){
   return  toast('Group description not descriptive.');
   }
 else if( gilen>500){
   return toast("Group description too long. Max: 500 characters.");
 }
  
  var cgroups=$.trim( localStorage.getItem( SITE_UNIQUE__ + '_' +  username + '_groups') ); 
  if(cgroups){
    var total_g=cgroups.split(' ').length;
  if( total_g>50 ){
   return toast('You have reached the maximum number of groups or pages.');
  } 
 }
    
  buttonSpinner(this_ );
  this_.prop('disabled', true);
     
  $.ajax({
    url: config_.domain + '/oc-ajax/group/create-group.php',
    type:'POST',
     dataType: "json",
    data: {
      "username": username,
      "group_title": gt,
      "group_info":gi,
      "group_type": type,
      "version": config_.APP_VERSION,
      'token': __TOKEN__
    }
  }).done( function(result){
      //alert(JSON.stringify(result) );    
     buttonSpinner(this_,true);
     this_.prop('disabled', false);

   if( result.status=='success' ){
     ginfo.val('');
     gtitle.val('');
     try{
  var CFILE=new android.File( MAIN_FOLDER, username + '/groups.txt');
       
 var data=JSON.stringify( result );
      // alert(data)
 var grouppin=result.username;
 var title= result.fullname;
 var lastmid=result.last_message_id;

 localStorage.setItem( SITE_UNIQUE__ + '_' + grouppin + '_' + username + '_group_admins', result.group_admins);
  
 var gdir=new android.File( MAIN_FOLDER, username + '/CHATS/' + strtolower( grouppin) );
 var dbdir=new android.File( gdir,'DB');   
  
if( !dbdir.isDirectory() && !dbdir.mkdirs() ){
   return toast('Unable to create directory for ' + title);
  }
 
 var ifile=new android.File( gdir, 'group-info.txt');    
   if(  ifile.write( data ) ){
  
        
  delete result["status"];
  delete result["last_message_id"];
  delete result["group_members"];
  delete result["group_admins"];
       
  result["app_version"]=config_.APP_VERSION;
  CONTACTS__[grouppin]=result;
  var cdata= JSON.stringify( CONTACTS__, null,"\t");
      
  if( CONTACTSFILE.write( cdata ) ){  
   var cgroups= localStorage.getItem( SITE_UNIQUE__ + '_' + username + '_groups')||"";
   var set_=cgroups + grouppin + ' ';
  localStorage.setItem( SITE_UNIQUE__ + '_' + username + '_groups', set_);
   GROPS__= set_;
   OGROPS__=set_;

  localStorage.setItem( SITE_UNIQUE__ + '_' + grouppin + '_' + username + '_last_msg_id', lastmid);
 sessionStorage.setItem('new_group_joined','yes');
  
    toast('Created ' + title + ' successfully', {type:'success'});
     showGroups(1); 
  }
else{
   toast("Could not create");  
}
   }else{
    toast("Could not create.");   
   }
       
 }catch(e){ 
   // alert(e)
   toast('Unable to create group. ' + e);
  report__('Error "#create-group-btn"',e);   
  }     
 }else if( result.error){
    toast(result.error);
  }
 else{
   toast('Unable to create group at the moment.');
  }
    
   }).fail(function(e,txt,xhr){
     buttonSpinner(this_,true);
     this_.prop('disabled', false);

  android.toast.show("Something went wrong");
     report__('Error "#create-group-btn", in join-create-group.js', JSON.stringify(e) );
  });
    
  });
  

$("body").on("click","#update-group-info-btn",function(){
  var gelem=$("#group-profile-info");
  if( !gelem.hasClass('editable') ) return;
  var ginfo= $.trim( gelem.text() );
  var data='<div class="center_text_div text-center" style="padding: 15px;">';
  data+='<textarea class="form-control" id="update-group-info-box">' + ginfo + '</textarea>';
  data+='<div class="text-center mt-2"><button id="save-group-info-btn" class="btn btn-sm btn-success">Save</button></div>';
  data+='</div>';
  displayData( data,{  data_class:'.upd-ginfo'});
    //$("#update-group-title-box").val( gtitle );              
 });
  
  
$('body').on('click','#save-group-info-btn',function(){
   var this_=$(this);
  var gelem=$('#update-group-info-box');
  var ginfo= $.trim( gelem.val() );
  var prev_ginfo=$.trim( $("#group-profile-info").text() );

  if( ginfo==prev_ginfo){
 return  closeDisplayData('.upd-ginfo');
 }
 var ilen=ginfo.length;
  
 if( ilen<4){
   return toast('Group description should be descriptive.',{type:'light',color:'#333'});
  }
  else if( ilen>500){
   return toast('Group description length exceeded. Max: 500 characters.',{type:'light',color:'#333'});
  }  
 ginfo=ginfo.replace(/\n/g,':nl::');
  
  var gpin=$.trim( $('#current-group-pin').val() );
 if( !gpin){
   return toast('Group pin not found.', {type:'light',color:'#333'});
 }
  
  buttonSpinner( this_);
  
  setTimeout(function(){
   updateGroupInfos(gpin, ginfo,'group-info',function(res){
   // alert( JSON.stringify( res))
     buttonSpinner( this_, true);
   if( res.status){
   $("#group-profile-info").text(ginfo);
     closeDisplayData('.upd-ginfo');
     toast(res.result,{type:'success'});     
     setTimeout(function(){
      loadGroupInfo(gpin );
    },1500);
       
   }else if(res.error){
     toast(res.error,{type:'light',color:'#333'});
   }
    else{
     toast('Unidentified error occured.', {type:'light', color:'#333'});
   }   
   });
  },2000);
 });


$("body").on("click","#update-group-title-btn",function(){
  var gtelem=$("#group-profile-fullname");
    if(!gtelem.hasClass('editable')) return;
  var gtitle=$.trim( gtelem.text() )
  var data='<div class="center_text_div text-center" style="padding: 15px;">';
  data+='<input type="text" class="form-control" id="update-group-title-box" value="' + gtitle + '" maxlength="30">';
  data+='<div class="text-center mt-2"><button id="save-group-title-btn" class="btn btn-sm btn-success">Save</button></div>';
  data+='</div>';
  displayData( data,{  data_class:'.upd-gtitle'});
    
 //  $("#update-group-title-box").val( gtitle );              
 });
  
  
 $('body').on('click','#save-group-title-btn',function(){
 var this_=$(this);
   
   var gpin=$('#current-group-pin').val();
 if( !gpin){
   return toast('Group pin not found.',{tyep:'light',color:'#333'});
 }
     
   var prev_gtitle=$.trim( $("#group-profile-fullname").text() );
   var gtitle=$.trim($('#update-group-title-box').val() );
 
 if( gtitle==prev_gtitle){
   return closeDisplayData('.upd-gtitle');
 }
   var gtlen=gtitle.length;
    if( gtlen<1){
   return toast('Group title should not be empty.',{type:'light',color:'#333'});
  }
  else if( gtlen>30){
   return toast('Group title length exceeded. Max: 30 characters.',{type:'light',color:'#333'});
  }
   
   buttonSpinner( this_);
  setTimeout(function(){
    updateGroupInfos(gpin, gtitle,'group-title',function(res){
     buttonSpinner( this_,true);
    
   if( res.status){
     toast(res.result,{type:'success'});
    $("#group-profile-fullname").text( gtitle);
     closeDisplayData('.upd-gtitle');
     setTimeout(function(){
      loadGroupInfo(gpin );
    },1500);
   
   }else if( res.error){
     toast(res.error,{type:'light',color:'#333'});
   }
    else{
     toast('Unidentified error occured.', {type:'light', color:'#333'});
   }
   });
  },1500);
   
 });
  
//Join group from message text
  
  $('body').on('click','.join-group-btn-2',function(){
    
  var gpin=$.trim($(this).attr('data-gpin') );
    if(!gpin){
      return toast('Not found.',{type: 'light',color:'#333'});
    }
  else if( inGroups(username,  gpin) ){ 
   //if( CONTACTS__[gpin] ){
   return toast('You already followed.',{type:'info'});
 }
    var data='<div class="text-left" style="white-space: nowrap; overflow-x: hidden; text-overflow: ellipsis; padding: 15px; width: 90%; font-weight: bold; font-size: 15px;">'
   + ( isGroup("gp_" + gpin)?'Joining... ':'Following... ') + '</div>';
      data+'<div class="center_text_div text-left;">';
     data+='<div class="container-fluid text-left" style="padding: 0 15px 15px 15px;">';
    data+='<img class="d-block w-40" src="file:///android_asset/loading-indicator/loading2.png">';
   data+='</div></div>';
   
   displayData(data,{ no_cancel:true, oszindex: 200, data_class:'.big-loading'});
 
 setTimeout(function(){
  join_group_( gpin, function(rtype,result,sErr){
    //  alert(JSON.stringify(result) );
      closeDisplayData('.big-loading');
      if( rtype=='done'){
   
 if( result.status=='success' ){
     saveGroup( result);
 
 }else if( result.error){
  android.toast.show(result.error);
  }
 else{
   toast('Unable to join at the moment.');
  }
}  
 else{
   android.toast.show('Something went wrong. Try again. ' + result);
     report__('Error "joinGroup()", fail', JSON.stringify(sErr) );
 }
      
      
     });
   },2000);
 }); 
  
});

function updateGroupInfos(gpin, info,type,callback){
   
  $.ajax({
    url: config_.domain + '/oc-ajax/group/update-group-infos.php',
    type:'POST',
   //timeout: 10000,
     dataType: "json",
    data: {
      "username": username,
      "group_pin": gpin,
      "type": type,
      "group_info": info,
      "version": config_.APP_VERSION,
      'token': __TOKEN__
    }
  }).done(function(result){
      //alert(JSON.stringify(result) );
      callback(result)
  }).fail(function(e,txt,xhr ){
     callback({"error":"Check your internet connection"});  
  
  //android.toast.show("Something went wrong");     
  report__('Error "updateGroupInfos()" in join-create-group.js', JSON.stringify(e),true );
 
  });
 }
 



function checkGroupExists(group_pin){
  var chkicon=$("#check-group-loading");
  var cont=$("#join-group-info-cont");
   $.ajax({
    url: config_.domain + '/oc-ajax/group/check-group-exists.php',
    type:'POST',
  timeout: 30000,
     dataType: "json",
    data: {
      "username": username,
      "group_pin": group_pin,
      "version": config_.APP_VERSION,
      'token': __TOKEN__
    }
  }).done(function(result){
  chkicon.css('display','none');
    
  if( result.status=='success' ){
    //toast('Group found.',{type:'success'});
    $('#join-group-btn').css('display','inline-block');
    $('#join-group-title').html(result.fullname);
    var cby=result.created_by||" ";
    var con=result.created_on||" ";
    var ginfo=result.group_info||" ";
    $('#join-group-short-info').html( ginfo.substr(0,150) + '-' );
    $('#join-group-created-by').text('Created by ' + cby);
   cont.slideDown();
  }else if( result.error){
    android.toast.show(result.error);
  }
 else{
  
   toast('Check failed.');
  }
     
  }).fail(function(e,txt,xhr){
     chkicon.css('display','none');
  android.toast.show("Something went wrong");
  report__('Error "checkGroupExists()", fail', JSON.stringify(e) );

  });
  
}


function join_group_(gpin, callback, auto_join){
   
  var cgroups= $.trim(localStorage.getItem(SITE_UNIQUE__ + '_' + username + '_groups') );

if( cgroups ){
   var total_g=cgroups.split(' ').length;
  if( !auto_join && total_g>50 ){
  return  callback("done",{"error":"You have reached the maximum number of groups or pages."},"");
  }
}
  
  GROUP_AJAX_ACTIVE=true;
  
 $.ajax({
    url: config_.domain + '/oc-ajax/group/join-group.php',
    type:'POST',
  //timeout: 10000,
     dataType: "json",
    data: {
      "username": username,
      "group_pin": gpin,
      "auto_join": auto_join,
      "version": config_.APP_VERSION,
      "token": __TOKEN__
    }
  }).done(function(result){
   GROUP_AJAX_ACTIVE=false;
   callback('done', result,"");
   
 }).fail(function(e,txt,xhr){
   GROUP_AJAX_ACTIVE=false;
   
     callback('fail',xhr,e);
 //  android.toast.show("Something went wrong");     
  report__('Error "join_group_()" in join-create-group.js', JSON.stringify(e),true );
 
 });
}

function saveGroup( result ,showg, auto){
  
 try{
  var grouppin=result.username;
  var title= result.fullname;
   
  var fdir=new android.File(MAIN_FOLDER, username + '/CHATS/' + strtolower(grouppin) + '/DB');     
 
if(!fdir.isDirectory() && !fdir.mkdirs()){
  return  callback('error','Unable to create ' + fuser + ' Directory');
 }
  
  var lastmid=result.last_message_id;
 localStorage.setItem( SITE_UNIQUE__ + '_' + grouppin + '_' + username + '_group_admins', result.group_admins);

 var gdir=new android.File( MAIN_FOLDER, username + '/CHATS/' + strtolower( grouppin) );
 var dbdir=new android.File( gdir,'DB');   
   
  if( !dbdir.isDirectory() && !dbdir.mkdirs()){
  return  toast('Unable to create directory for ' + title);
  }
  
  var ifile= new android.File(gdir, "group-info.txt");
  var idata= JSON.stringify( result );
   
   if(  ifile.write( idata) ){
   
  delete result["status"];
  delete result["last_message_id"];
  delete result["group_members"];
  delete result["group_admins"];
  delete result["total_members"];
  delete result["lock_status"];
   
  result["app_version"]=config_.APP_VERSION;
  CONTACTS__[grouppin]=result;
   
  if( CONTACTSFILE.write( JSON.stringify( CONTACTS__, null,"\t") ) ){
   
   var cgroups= localStorage.getItem( SITE_UNIQUE__ + '_' +username + '_groups')||"";
   var set_=cgroups + grouppin + ' ';
  localStorage.setItem( SITE_UNIQUE__ + '_' + username + '_groups', set_);
   GROPS__= set_;
   OGROPS__=set_;

  localStorage.setItem(SITE_UNIQUE__ + '_' + grouppin + '_' + username + '_last_msg_id', lastmid);
 sessionStorage.setItem('new_group_joined','yes');
 
  if( !auto)  toast('You joined: ' + result.fullname,{type:"success"});
 
    if( showg) showGroups(1);
   $('#join-group-info-cont').css('display','none');  
  }
    else{
 if(!auto )  toast("Could not join");
  }
 }else{
 if(!auto)  toast("Could not join.");  
  }
   
 }catch(e){ 
   // alert(e)
 if(!auto )  toast('Unable to join group. ' + e);
  report__('Error "saveGroup()"', e);   
  }  
  
  
  
}


function joinGroup(group_pin){
  var btn=$('#join-group-btn');
     btn.css('display','none');
  var chkl=$('#check-group-loading');
     chkl.css('display','inline-block');
   var inp=$('#join-group-pin');
 inp.prop('disabled', true);
 
  join_group_(group_pin, function(rtype, result,sErr){
 // alert(JSON.stringify(result) );
 
    $('#check-group-loading').css('display','none');
    btn.css('display','none');
   inp.prop('disabled', false).val('');
    
  if( rtype=='done'){
   
 if( result.status=='success' ){
   lock_unlock_group( group_pin, result.lock_status);
   
     saveGroup( result, true);
   
 }else if( result.error){
    toast( result.error);
  }
 else{
   toast('Unable to join group at the moment.');
  }
}  
 else{
   android.toast.show("Something went wrong");
     report__('Error "joinGroup()", fail', JSON.stringify(sErr) );
 }
 
  });
}

function auto_join_group(){ 
if( localStorage.getItem("is_fetching_messages")){  
  setTimeout(function(){
      auto_join_group();
    }, 3000);
  return;
}
  
  var ajgroups=$.trim(localStorage.getItem("auto_join_groups")||"");
  var len=ajgroups.length;
  
  if( len<11 ) return;
  
 ajgroups=ajgroups.split("\n");
 var total_g=ajgroups.length;
 
  for(var i=0; i<total_g; i++){
   var gpin=ajgroups[i].split("|")[0];
    
  if(!inGroups( username, gpin) ) {
   var loader= $("#auto-join-group-loader");
       loader.css("display","block");
    
  join_group_( gpin, function(rtype, result){
   loader.css("display","none");
    if( result.status=="success" ){
   lock_unlock_group( gpin, result.lock_status);
    saveGroup(result, false, true);
   }
     
  }, 1);
 
    setTimeout( function(){
      auto_join_group();
    }, 6000);
    
   return false;
   }
 }
  
  
}

function loadGroups( action_){
  var tc=$('#total-groups');
  
  if(!Object.keys( CONTACTS__).length){
    tc.html('<span id="total-group">0</span> pages');
    return '';
  }
   
  var total_groups=0;
  var total_pages=0;
  var data='';
  
    $.each( CONTACTS__,function(fuser, data_){
  
    if( isGroupPage( fuser)){
      var auto_join=data_.auto_join;
      var fname=data_.fullname;
      var verified='';
      var duser=fuser;
      
  var v=checkVerified(fuser, fname);
      verified=v.icon;
  var r_=randomString(4);
      
      var gtext="(group)";
      
   if( isPage(fuser) ){
      gtext="(page)";
     total_pages++;
   }
    else total_groups++;
    
   data+='<div id="' + r_ + ( fname.replace(/[^a-zA-Z0-9]/g,'') )+ '" class="contact-container">';
   data+='<div class="container-fluid">';
   data+='<div class="row">';
   data+='<div class="col">';
   data+='<div class="contact-photo-container">' + friendProfilePicture(fuser,'contact-photo', verified) + '</div>';
   data+='</div>';
   data+='<div class="col">';
   data+='<div class="contact-friend-name-container ' + ( action_ ?action_:'friend') + ' friend-' + fuser + '" data-fname="' + fname + '" data-type="friend" data-friend="' + fuser + '">';
   data+='<div class="contact-friend-name contact-friend-name-' + fuser + ' friend-name-' + fuser + '">' + fname + '</div>';
   data+='<div><span class="contact-friend-username">' + verified + duser + '</span> <i style="color: rgba(0,0,0,0.6); font-size: 11px;">' + gtext + '</i></div>'; 
   data+='</div>';
   data+='</div>';
      
if( !action_){
   data+='<div class="col text-center text-warning w-70">';
   data+='<img class="delete-contact-loading" id="delete-contact-loading-' + fuser +'" src="file:///android_asset/loading-indicator/loading2.png">';
  if(!auto_join) data+='<button class="delete-contact-btn" id="delete-contact-btn-' + fuser +'" data-username="' + fuser + '">&nbsp;</button>';
   else{
     data+='&bull;';
   }
  data+='</div>';
}
  data+='</div></div></div>';
  }
   });
  
  var total_=total_groups + total_pages;
  
 tc.html('<span id="total-groups">' + total_groups + '</span> groups, <span id="total-pages">' + total_pages + ' pages</span>');  
  
 return data;
}

function group_profile(this_ ){ 
     var rand_=randomString(3 );
    var gpin=this_.data('id');
    $('#current-group-pin').val( gpin);
  
  $('#group-profile-page #change-group-profile-photo-cont,#group-lock-status-cont').css('display','none');
  
   $('#group-profile-fullname,#group-profile-username,#group-profile-info').empty();
  var textarea= $('#group-profile-info');
 
   $('#group-profile-fullname').removeClass('editable').addClass('profile-friend-fullname-' + gpin);
    
  $('#group-profile-fullname, #group-profile-username').text( gpin );
  $('#group-profile-message-btn').attr('username', gpin);
    
  //var gfile=new android.File(MAIN_FOLDER, username + '/groups.txt');
  var gfile=new android.File(MAIN_FOLDER, username + '/CHATS/' + gpin + '/group-info.txt');
  var gpp= $('#group-profile-page');
    
  var group_data='';
  
  if( gfile.isFile() ){
    group_data=$.trim( gfile.read()||"" );
  }
 
  var admins='';
 if( group_data ){
  var data=JSON.parse( group_data);
  admins=format_group_info( data, gpin);
  
  }
 
  var mdiv=$('#group-admins-list');
      mdiv.html( admins)
      gpp.fadeIn();
  
 var div=$('#group-profile-picture-div');
 var pictureFile=new android.File(MAIN_FOLDER, username + '/CHATS/' + gpin + '/profile_picture.jpg');
 var thumbnailFile=new android.File(MAIN_FOLDER, username + '/CHATS/' + gpin + '/profile_picture_small.jpg');  
 
  div.html( friendProfilePicture( gpin, 'friend-picture sm-friend-picture') )
    
    loadGroupInfo( gpin, 'old'); 
 }


function format_group_info( data, gpin, type, loadmore){
   var total_members=data.total_members||1;
   var created_by=("" + data.created_by).replace('vf_','');
   var created_on= strtolower( toDate( data.created_on,'chat_date') );
   var gtitle=data.fullname;
   var ginfo=data.group_info;
   var textarea= $('#group-profile-info');
   var gtelem=$('#group-profile-fullname');
   var admins=data.group_admins;
    localStorage.setItem( SITE_UNIQUE__ + '_' +gpin + '_' + username + '_group_admins', admins);
    var is_admin=false;
    textarea.removeClass('editable');
    gtelem.removeClass('editable');
    $('#group-profile-page #change-group-profile-photo-cont, .add-page-admin-btn').css('display','none');
 
 var gld=$('#group-lock-status-cont');
   //  gld.css('display','none');

 var s_admins=$.trim( admins||"").split(',');
  var apab=$('.add-page-admin-btn');
  apab.css('display','none');
  
  if( $.inArray(username, s_admins)>-1 ){  
    textarea.addClass('editable');
      gtelem.addClass('editable');
       is_admin=true;
 $('#group-profile-page #change-group-profile-photo-cont').css('display','block');
  
  if( isGroupPage(gpin ) ){
    gld.css('display','block');
  }
     //else{ 
    if( isPage(gpin)){
      apab.css('display','block');
  }
    groupSettings(gpin );
 }
  
   gtelem.html( gtitle);   
  var dynDiv=$('<div/>');
  ginfo=ginfo.replace(/:nl::/g,'\n');
    ginfo=dynDiv.html(ginfo ).html();
    textarea.html( ginfo );
    dynDiv.remove();
    
   $('#total-followers').html('<strong><i>' +total_members +'</i></strong>');
   $('#total-group-members').html('<i><small>( ' + total_members + ' )</small></i>');
   $('#group-created-by').html('<i>Created by ' + created_by + ' on ' + created_on + '</i>')
 
  var gpp= $('#group-profile-page')
    gpp.attr('data-admins', admins);
   
    var mem='';
    var amem='';

  function structure( gpin, guser,name,is_admin,is_madmin, verified,count){
      
     var ret='<div class="container-fluid highlight" style="border:0; border-radius: 3px; padding: 0; margin-bottom: 10px; overflow-x: hidden;">';
     ret+='<div class="row"><div class="col" style="width: 60px; max-width: 60px;"><span class="sm-friend-picture-bg">' + friendProfilePicture( guser,'friend-picture sm-friend-picture nosave',verified) + '</span></div>'; 
     ret+='<div class="col ' + ( is_admin?'group-user-options':'') + '" data-gpin="' + gpin + '" data-fuser="' + guser + '"><div class="group-member-name friend friend-' + guser + '" data-fname="' + name + '" data-type="friend" data-friend="' + guser + '">' + name + verified + '</div>';
     ret+='<div class="d-none friend-name-' + guser + '">' + name + '</div>';
     ret+='</div>';
     ret+='<div class="col text-right">' + ( is_madmin?'<i class="form-text">(admin)</i>':'') + '</div>';
    
     ret+='</div>';    
     ret+='</div>';
      return ret;
    }
    
  var admins_=admins.split(',');
  var alen=admins_.length;
 if( type!='members'){
   
 $.each( admins_, function(i, adm){
    if(adm){
      var v=checkVerified( adm);
     var verified=v.icon;
     var name=v.name;
   amem+=structure(gpin, adm, name, is_admin, true, verified);
    }
  });
 }
  
 if( type=='members'){
   
   var members=$.trim( data.group_members);
   var list=members.split(' ');
   var total_members=list.length;    
   gTotalMembers=total_members-alen;
     
   var start= loadmore||0;
   var cnt=0;
   
  for(var i=start; i<total_members; i++){
      cnt++;
  if( cnt==30){
    return mem;
 }
    var guser=list[i];
      var v=checkVerified( guser);
     var verified=v.icon;
    var name=v.name;
   var is_madmin=false; //if member is an admin
  
  if( $.inArray( guser,s_admins) >-1 ){}
    else{
   mem+=structure(gpin, guser, name, is_admin, is_madmin,verified,i);
    }
  }
 }
  return ( amem + mem );
}
  
var ginfoTimeout;

function loadGroupInfo( gpin,type){
  var mdiv=$('#group-admins-list');
  var gfile=new android.File( MAIN_FOLDER, username + '/CHATS/' + gpin + '/group-info.txt');

  try{
  if(!gfile.isFile() ){
     gfile.createNewFile();
  }
   }catch(e){
     toast('Unable to load info');
    return logcat('function loadGroupInfo(): joincreategroup.js',e ); 
   } 
    
  var licon=$('#group-admins-loading');
      licon.show();
  
  var cgroups=localStorage.getItem( SITE_UNIQUE__ + '_' + username + '_groups')||"";
  if( cgroups.search( gpin + ' ')< 0 ){
    licon.hide();
   return mdiv.html("");
    }
  
  lgprofileTimeout=setTimeout( function(){
    
  lgprofileAjax=$.ajax({
    url: config_.domain + '/oc-ajax/group/group-info.php',
    type: 'POST',
    timeout: 20000,
    dataType: "json",
    data:{
      'username': username,
      'group_pin': gpin,
      'version': config_.APP_VERSION,
      'token':__TOKEN__,
    }
  }).done(function(result){
      licon.hide();
 // alert(JSON.stringify( result))
 if( result.status && result.full_info ){
 
 if( gfile.write( JSON.stringify( result.full_info) ) ){
 var gfile2=new android.File( MAIN_FOLDER, username + '/groups.txt');

  if(gfile2.isFile() ){
    var groups=$.trim( gfile2.read()||"" ); 
   var getData=groups.replace( new RegExp("^" + gpin + "\\|.*","mi"), result.short_info );
   gfile2.write(getData);
  }
 
   mdiv.html( format_group_info( result.full_info, gpin ) );
 
  var inContact=CONTACTS__[gpin];
    if( inContact){
  // var obj=new Object();
    var finfo=result.full_info;
    delete finfo["id"];
    delete finfo["group_type"];
    delete finfo["group_admins"];
    delete finfo["group_members"];
    delete finfo["group_lock"];
    finfo["created_by"]=finfo["owner"]; 
    delete finfo["owner"];
 
   saveContact( finfo /*obj*/ ,"", function(r){ });
     }
 
 }

 // lazyLoadFriendsThumb('#group-admins-list')  
   
  }
 }).fail(function(e, txt, xhr){
 // alert( JSON.stringify(e))
    licon.hide();
  // toast("Check network connection. " + xhr,{type:'light',color:'#333'});
    report__('Error "loadGroupInfo()"', JSON.stringify(e) );
  });
    
  },2000);
 
}

function showGroupMembers(){
  var gpin=$.trim( $('#group-profile-username').text() ); 
  if( !gpin ) return toast('Group pin not found');

  var gfile=new android.File( MAIN_FOLDER, username + '/CHATS/' + gpin + '/group-info.txt');
  var div= $('#group-members-list');
    div.empty();
 gMembersCount=0;
  var members='';
  if ( !gfile.isFile()  ){
    return toast('Can\'t load yet.');
  }
  var data=$.trim( gfile.read() );
  
 if(data ){
   data=JSON.parse( data);
 members=format_group_info( data, gpin,'members');
    }
  
  div.html( members);
 setTimeout(function(){
   $('#group-members-container').fadeIn();
  // lazyLoadFriendsThumb('#group-members-list');
 },500);  
  
}

function groupMembersScroll(){
 $('#group-members-list').scroll(function(){   
  var div = $(this).get(0);  
    if( ( div.scrollTop + div.clientHeight + 200) >= div.scrollHeight) {
    var gmc=gMembersCount+30;
      var gpin=$.trim( $('#group-profile-username').text() ); 
  if( !gpin ) return toast('Group Pin not found.');
 
  var gfile=new android.File( MAIN_FOLDER, username + '/CHATS/' + gpin + '/group-info.txt');
  var div= $('#group-members-list');
    
  var members='';
  if ( !gfile.isFile()  ){
    return toast('Can\'t load yet.');
  }
  var data=$.trim( gfile.read() );
  
 if(data ){
   data=JSON.parse( data);
 members=format_group_info( data, gpin,'members', gmc);
    }
    
 div.append( members);
      
 if( gmc > gTotalMembers) gmc=gTotalMembers;
   gMembersCount=gmc;
      }
});
 
}
  


function leaveGroup( gpin){
  
 var loader=$('#delete-contact-loading-' + gpin);
 var delBtn=$('#delete-contact-btn-' + gpin);
  delBtn.hide();
  loader.show();
  
  closeDisplayData('.remove-contact-div');
  
  ajaxRequest=$.ajax({
    url: config_.domain + '/oc-ajax/group/leave-group.php',
    type: 'POST',
   // timeout: 30000,
    dataType:"json",
    data: {
      'username': username,
      'group_pin': gpin,
      'version': config_.APP_VERSION,
      'token':__TOKEN__,
    }
  }).done(function(result ){
   //alert(JSON.stringify(result) );
   
      loader.hide();
     delBtn.show();
    if( result.error){
   toast(result.error);
   report__('Error "leaveGroup()"', result.error);
   return;
    }
   
    try{ 
   removeGroup_(gpin );
   showGroups(1);
  report__('Group: ', 'Left group "' + gpin + '" successfully.');
  
 }catch(e){
   toast('Failed to delete. ' + e);
    report__('Error "leaveGroup()"', e);
  }

  }).fail(function(e,txt,xhr){
    loader.hide();
    delBtn.show();
   android.toast.show("Something went wrong");
    report__('Error "leaveGroup()"', JSON.stringify(e) );
  });
 
}


function removeGroup_(gpin){
  if( gpin=="gv_pofficials") return;
  var cgroups_=$.trim(localStorage.getItem( SITE_UNIQUE__ + '_' + username + '_groups') )||"";
  
  if( cgroups_){
     var split_=cgroups_.split(" ");
  split_ = $.grep( split_, function(value) {
  return strtolower(value) != strtolower(gpin);
 });
 var cgroups=split_.join(" ");
  if(!cgroups ) {
    localStorage.removeItem( SITE_UNIQUE__ + "_" + username + "_groups");
    GROPS__="";
    OGROUPS__="";
  }else{
    var set_=cgroups + " ";
    localStorage.setItem( SITE_UNIQUE__ + "_" +username + "_groups", set_);
    GROPS__= set_;
    OGROPS__=set_;
   }
  }
 
  remove_from_group_admin( gpin );
  //Remove group admins since he or she 
  //no longer belong to the group
 delete CONTACTS__[gpin];
  
  if( CONTACTSFILE.write( JSON.stringify( CONTACTS__,null, "\t")) ){
   return true; 
  }
}


function removeGroupx_( gpin){
var groupsFile=new android.File( MAIN_FOLDER, username + '/groups.txt');
 var cgroups_=$.trim(localStorage.getItem(SITE_UNIQUE__ + '_' + username + '_groups') )||"";
  
  if( cgroups_){
     var split_=cgroups_.split(' ');
  split_ = $.grep( split_, function(value) {
  return strtolower(value) != strtolower(gpin);
 });
 var cgroups=split_.join(' ');
  if(!cgroups ) {
    localStorage.removeItem( SITE_UNIQUE__ + '_' +username + '_groups');
    GROPS__="";
    OGROUPS__="";
  }else{
    var set_=cgroups + ' ';
    localStorage.setItem(SITE_UNIQUE__ + '_' +username + '_groups', set_);
    GROPS__= set_;
    OGROPS__=set_;
   }
  }
 
  remove_from_group_admin( gpin );
  //Remove group admins since he or she 
  //no longer belong to the group
  
  var file=new android.File( MAIN_FOLDER, username + '/CHATS/' + strtolower( gpin) + '/group-info.txt');     
     file.delete();
   
  if( !groupsFile.isFile() ){
    report__('Error "leaveGroup()"', groupsFile.toString() + ' not found.');
  return true; 
  }
    
    var groups=$.trim( groupsFile.read() );
  if(!groups ) {
   try{ groupsFile.delete(); }catch(e){}
    return true;
  }
  groups=groups.replace(/[\r\n]{2,}/g, '\n');
  groups=groups.replace( new RegExp("^" + gpin + '\\|.*\n?','gmi'),"");
 
if(!groupsFile.write( $.trim(groups ) ) ) {
     return false;  
   }
}

 function adminify(gpin,fuser,type){
  if( type=='remove-member'){
    var gtitle=$.trim( $('#group-profile-fullname').text() )
   if( !confirm('Remove ' + fuser + ' from "' + gtitle + '" group?') ){
     return;  
   }
  }
   
   var data='<div class="text-left" style="white-space: nowrap; overflow-x: hidden; text-overflow: ellipsis; padding: 15px; width: 90%; font-weight: bold; font-size: 15px;">'
   + ( type=='remove-admin'||type=='remove-member'?'Removing ':'Adding ') + fuser + '</div>';
      data+'<div class="center_text_div text-left;">';
     data+='<div class="container-fluid text-left" style="padding: 0 15px 15px 15px;">';
    data+='<img class="d-block w-40" src="file:///android_asset/loading-indicator/loading2.png">';
   data+='</div></div>';
   
   displayData(data,{ data_class:'.big-loading'});
    $('#group-members-container').css('display','none');
   
   setTimeout(function(){
   ajaxRequest=$.ajax({
    url: config_.domain + '/oc-ajax/group/adminify.php',
    type: 'POST',
   // timeout: 10000,
    dataType:"json",
    data: {
      'username': username,
      'group_pin': gpin,
      'member_user': fuser,
      'type': type,
      'version': config_.APP_VERSION,
      'token':__TOKEN__,
    }
  }).done(function(result){
  // alert( JSON.stringify(result) );  
   setTimeout( function(){
     closeDisplayData('.big-loading');
  if(result.status){
    loadGroupInfo( gpin)
 }else if( result.error){
      toast(result.error, {type:'light',color:'#333'});
      report__('Error "Group adminify()"', result.error);
   return;
    }
     else{
     toast('Unidentified error occured', {type:'light',color:'#333'});
      report__('Error "Group adminify()"', JSON.stringify(result) );
     }
   },2000); 
   }).fail(function(e,txt,xhr){
    closeDisplayData('.big-loading'); 
    android.toast.show("Something went wrong");
    report__('Error "Group adminify()"', JSON.stringify(e) );

   });
   },1000);
    
  }


function changeGroupPicture(){
  var gpin=$.trim( $('#group-profile-username').text() );
 
  if( !gpin ) return toast('Pin Not Found.');
  
 var profileDir=new android.File(MAIN_FOLDER, username + '/CHATS/' + strtolower(gpin) );
  if(!profileDir.isDirectory() && !profileDir.mkdirs() ){
    return toast('Could not create a directory-Grp.');
  }
 var file=new android.File(profileDir, 'profile_picture.jpg');
    
  var data='<div class="center_text_div" style="width:100%; padding: 10px 15px;">';

 if( file.isFile() )  data+='<span id="remove-photo-btn" onclick="removeGroupProfilePicture();">&nbsp;</span>';
    data+='<span id="profile-gallery-btn" onclick="uploadGroupProfilePicture(\'gallery\');">&nbsp;</span>';   
    data+='<span id="profile-camera-btn" onclick="uploadGroupProfilePicture(\'camera\');">&nbsp;</span>';
    
  data+='</div>';
  
  displayData(data,{ width: '100%',max_width:'100%', oszindex:200, pos:'100', data_class: '.upload-profile-picture-div', osclose:true});

}


function uploadGroupProfilePicture(type){
  closeDisplayData('.upload-profile-picture-div');
  
 if( type=='camera'){
   var token=randomString(5);
  localStorage.setItem('import_token', token);
  android.control.execute("takeGroupProfilePicture()");
 }else if (type=='gallery'){
   android.control.execute("importGroupProfilePicture()")
 // android.control.dispatchEvent('groupProfilePicture',null);
}
  
}   

function removeGroupProfilePicture(){
  var data='<div class="center_header text-left" style="padding-left: 30px; padding-top: 13px; font-size: 15px;">Remove photo?</div>';
     data+='<div class="center_text_div text-right" style="width:100%; font-size: 13px; padding: 10px 15px;">';
     data+='<span onclick="closeDisplayData(\'.remove-profile-picture-div\');" style="margin-right: 25px;">CANCEL</span><span class="" onclick="removeGroupProfilePicture_();">REMOVE</span>';
  data+='</div>';
  displayData(data,{ width: '90%', oszindex: 500, pos:'50', data_class:'.remove-profile-picture-div',osclose:true});
  closeDisplayData('#upload-profile-picture-div');
}


function removeGroupProfilePicture_(){
  closeDisplayData('.remove-profile-picture-div');
  closeDisplayData('.upload-profile-picture-div');
  var gpin=$.trim( $('#group-profile-username').text() ); 
  if( !gpin ) return toast('Pin not found.');
   
  sessionStorage.setItem('DELAY','1');
   $.ajax({
   'url': DOMAIN_ + '/oc-ajax/group/remove_profile_picture.php',
   'type': 'POST',
   'dataType':'json',
   'data':{
     'username': username,
     'group_pin': gpin,
     'token': __TOKEN__,
     'version': config_.APP_VERSION,
      }
 }).done(function( result){
     sessionStorage.removeItem('DELAY','1');
  if( result.status ){
  try{  
 var profileDir=new android.File(MAIN_FOLDER, username + '/CHATS/' + gpin);
  
 var file=new android.File( profileDir,'profile_picture.jpg');
 var thumb=new android.File( profileDir,'profile_picture_small.jpg');
 
  if( file.isFile() ){
    file.delete(); }
  if( thumb.isFile() ){
    thumb.delete(); 
 }  
    groupProfilePicture( gpin);
    toast(result.result,{type:'success'});  
  }catch(e){ toast(e); }
  }else if (result.error ){
    
  }
 }).fail(function(e){
     sessionStorage.removeItem('DELAY','1')
     toast('Unable to remove photo.');
   });
}



function processGroupProfilePicture(evt){
  var gpin=$.trim( $('#group-profile-username').text() ); 
  if( !gpin ) return toast('Pin not found');
  
  var profileDir=new android.File(MAIN_FOLDER, username + '/CHATS/' + strtolower(gpin ) );
  if(!profileDir.isDirectory() && !profileDir.mkdirs() ){
    toast('Failed to update group profile picture.');
    return report__('ERROR "processGroupProfilePicture()"','Unable to create group dir.');
  }
  var path = evt.detail.path;
  var file = new android.File( path);
   processGroupProfilePicture_(file,profileDir);
}


  function processGroupProfilePicture_(file,profileDir){
    var gpin=$.trim( $('#group-profile-username').text() ); 
  if( !gpin ) return toast('Pin Not Found');
    
    var base64 = file.readBase64();
      sessionStorage.setItem('DELAY','1');
    $('#gprofile-picture-loading').css('display','block');
    $.ajax({
         'url': DOMAIN_ + '/oc-ajax/group/upload_profile_picture.php',
         'type': 'POST',
         'dataType':'json',
         'data':{
           'base64': base64,
           'username': username,
           'group_pin': gpin,
           'token': __TOKEN__,
           'version': config_.APP_VERSION,
         }
     }).done(function(result){
        sessionStorage.removeItem('DELAY');
     $('#gprofile-picture-loading').css('display','none');
  if( result.status ){
     var copy_to=new android.File( profileDir, 'profile_picture.jpg');
    
   if( file.copyTo( copy_to) ){
     
   var thumbnailFile=new android.File( profileDir, 'profile_picture_small.jpg');    
  fetchPicture( file.toString() , false, function(result){
     if( result){
   thumbnailFile.writeBase64( result.split(',')[1]);
     }
  }); 
     
        groupProfilePicture( gpin);
        toast('Updated profile picture.',{type:'success'});
    try{
    file.delete();
    }catch(e){}
   
 }else{
       toast('Could not update profile picture.');
     }
  }else if ( result.error ){
    toast(result.error);
  }else
  {
    toast('Couldn\'t update profile picture.');
   }
       }).fail(function(e){
    sessionStorage.removeItem('DELAY');
      $('#gprofile-picture-loading').css('display','none');
      android.toast.show("Something went wrong");     
  report__('Error "processGroupProfilePictures()" in join-create-group.js', JSON.stringify(e),true );
     
       });
  }

  




$(function(){
  
$('body').on('contextmenu','.group-user-options', function (e) {
     // Avoid the real one
    e.preventDefault();
    // Show contextmenu 

  var this_=$(this);
  var fuser=this_.data('fuser');
  var gpp= $('#group-profile-page')
  var admins=gpp.attr('data-admins');

  var gpin=this_.data('gpin')
  var cm= $("#group-user-options-menu");
  
    var is_admin=false;
 
 if( !is_group_admin(gpin, username ) || fuser==username){
    cm.css('display','none');
    return;
  }  
 
 if(is_group_admin( gpin, fuser) ){
   is_admin=true;
  $('#make-admin').css('display','none');
  $('#remove-admin').css('display','block')   
 }
  else{
  $('#make-admin').css('display','block');
  $('#remove-admin').css('display','none');
  }
 
  if( isPage(gpin) ){
    $('#remove-member').css('display','none');
  }else{
    $('#remove-member').css('display','block');
  }
  
   cm.css('display','none').toggle(100).
 // In the right position (the mouse)
    css({ top: (e.pageY-100) + "px", left: ( e.pageX-2) + "px"});
   if(fuser){
     cm.attr('data-fuser',fuser);
     cm.attr('data-gpin',gpin);
   }
 
});

 $(document).on('click', function (e) {
  if ( $(e.target).closest(".group-user-options").length === 0) {
    $("#group-user-options-menu").css('display','none');
  }
  });
    
// If the menu element is clicked
$('body').on('click','#group-user-options-menu li',function(){
  var cm= $("#group-user-options-menu");
  var fuser=cm.attr('data-fuser');
  var gpin=cm.attr('data-gpin');
 
  // This is the triggered action name
    switch( $(this).attr("data-action") ) {
         // A case for each action. Your actions here
     case "make-admin": adminify( gpin, fuser,'add-admin'); break;
     case "remove-admin": adminify( gpin, fuser,'remove-admin'); break;    
     case "remove-member": adminify( gpin, fuser,'remove-member'); break;
    } 
  // Hide it AFTER the action was triggered
  $("#group-user-options-menu").fadeOut(100);
  });
  
  
});

document.addEventListener("group_profile_picture.ready", function(evt){
 //takePhoto event from camera
  processGroupProfilePicture(evt );
});
  
document.addEventListener("group.profile.picture.received", function(evt){
  //Profile picture Coming From Gallery  
  processGroupProfilePicture(evt)
  
});

