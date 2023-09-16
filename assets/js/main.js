function share(){
  var dir=android.files.getPublicDir("downloads");
  var file=new android.AssetFile("zample.png");
  
 android.activity.shareFile(file,"image/png");
 }

function printPage(){
  android.webView.print();
}

var customPageOpenedIds=[];
var TODAY_DATE=moment().format('DD_MM_YYYY');

function closeCustomPage(t,id) {
  if(t){
   id=$(t).data('close-id');
 }
  else if(!id ){
  if(customPageOpenedIds.length) {
    id=customPageOpenedIds[ customPageOpenedIds.length-1];
  }else return;
 }
   $('#' + id).css('display','none');
  
var index = customPageOpenedIds.indexOf(id);
if (index > -1) {
  customPageOpenedIds.splice(index, 1);
 }
  applyScroll(1);
}

function openCustomPage(id,effect){
  if(!effect){
    $('#' + id).css('display','block');
   
  }
   else{
     $( "#" + id ).show("slide",{
      },400);
}
  customPageOpenedIds.push( id);
  getScroll(true);
}



function upgradeForm(text){
  var star='<img src="' + ASSETS_DOMAIN + '/images/button-icons/star-black.png" style="width: 17px; height: 17px;">';
  var data='<div class="center-div bg-white">';
     
      data+='<div class="center-header text-center" style="border-bottom:0; font-weight: bold; padding-top: 10px;">';
      data+='Get pro version';
      data+='</div>';
   
      data+='<div class="center-text-div" style="padding: 0px 16px 40px 16px;">';
      data+='<div>' + star + ' ' + text + '</div>';
      data+='<div class="mb-3">' + star + ' Unlock all features</div>';
      data+='<div class="mb-2 text-center"><button onclick="openInBrowser(\'' + config.pro_link + '\');" class="btn btn-white-black"><img src="' + ASSETS_DOMAIN + '/images/button-icons/amazon-blue.png" style="width: 17px; height: 17px;"> Amazon Appstore $0.99</button></div>';
  
      data+='</div></div>';
    
   displayData( data, { oszindex: 200, osclose: true, data_id:"create-class-req"});
   return
}



function avatarError(t){
  var this_=$(t);
  var id=this_.attr("data-id");
  this_.addClass("d-none");
  var ava= $("#" + id + "-avatar-2");
  ava.removeClass("d-none");
}

function showInfo(t, info){
 if(!info){
   var info=$(t).data("info");
 }
  var data='<div class="center-div bg-white">';
     data+='<div class="center-header ellipsis" style="padding-left: 16px;"></div>';
     data+='<div class="center-text-div text-center" style="padding: 0 15px;">';
     data+=info;
     data+='</div>';
     data+='<div class="center-footer"></div>';
     data+='</div>';
  displayData(data,{ oszindex: 500, data_id:"show-info-div", osclose:true});
}

function changePhotoForm(id){
  if(!hasPermission() ){
  return requestPermission();
 }
  
 if( id){

   $("#id-update-profile").val( id);
 }
 var data='<div class="center-div bg-white">';
     data+='<div class="center-header ellipsis" style="padding-left: 16px; font-size: 17px;">Choose</div>';
     data+='<div class="center-text-div text-center" style="padding: 0 10px;">';
 
     data+='<table class="table" style="margin-bottom: 15px;"><tr>';
     data+='<td class="text-left"><button class="btn btn-white-black" style="margin-left: 16px;" onclick="changePhoto();"><img src="' + ASSETS_DOMAIN + '/images/button-icons/camera.png" style="width: 17px; height: 17px;"> Camera</button></td>';
     data+='<td class="text-center"><button class="btn btn-white-black" onclick="changePhoto(1);"><img src="' + ASSETS_DOMAIN + '/images/button-icons/gallery.png" style="width: 17px; height: 17px;"> Gallery</button></td>';
     data+='</tr></table>';
  
     data+='</div>';
     data+='</div>';
     displayData(data, { data_id: "change-photo-form", oszindex: 180, osclose:true});   
}


function changePhoto(type){
  var id=$("#id-update-student").val();

  closeDisplayData('change-photo-form');  
 
  if(!type){
  android.control.execute("takePhoto()");
 }else{
  android.control.execute("importPhoto('png')");
  // android.control.dispatchEvent('myProfilePicture', null);  
 }
  
}

function deletePhoto( class_,id){
  if( !confirm("Confirm delete")) return;
  class_=class_||localStorage.getItem("classSelected")||"first-class";
  var file=new android.File( PHOTO_DIR, class_ + "/" + id + ".png");
  var thumb=new android.File( PHOTO_DIR, class_ + "/" + id + "-thumb.png");

  try{
  if( file.delete()){
   thumb.delete();
   $("#" + id + "-avatar").addClass("d-none");
   $("#" + id + "-avatar-2").removeClass("d-none");
   closeDisplayData("avatar-big");
  return toast("Deleted", { type:"success"});
 }
  }catch(e){
   toast("Could not delete. " + e);
  }
}

function closeHighlightedOptions(){
  $("#highlighted-options-container,.highlighted").css('display','none')
}

function showHighlightedOptions(){
  $("#highlighted-options-container").fadeIn();
}



function highlightAll(){
  var total_students=+$(".total-students:first").text();
  var total=$(".highlighted:visible").length;
   
  if( total && total== total_students ){
   return closeHighlightedOptions();
  }
  
  $(".highlighted").css("display","block");
  var total=$(".highlighted:visible").length;
  $("#total-highlighted").text( total);  
}


function showPhoto(t){
  var class_=localStorage.getItem("classSelected")||"first-class";
  var id=$(t).data("id");
  var file=new android.File( PHOTO_DIR, class_ + "/" + id +".png");
  
 var data='<div class="center-div bg-white" style="min-width: 200px;">';
     data+='<div class="center-header ellipsis" style="padding-top: 8px; font-size: 17px;">';
     
     data+='<img class="w-20 h-20" onclick="deletePhoto(\'' + class_ + '\',\'' + id + '\');" style="position: absolute; right: 10%; top: 7px;" src="' + ASSETS_DOMAIN + '/images/button-icons/delete.png">';   

     data+='<button onclick="changePhotoForm(\'' + id + '\');" style="margin: 0 auto;" class="btn-hl w-50">';
     data+='<img class="w-20 h-20" src="' + ASSETS_DOMAIN + '/images/button-icons/edit.png">';   
     data+='</button>';
   
     data+='</div>';
     data+='<div class="center-text-div text-center" style="padding: 0 10px;">';
 
     data+='<img id="student-avatar-big" src="' + file.toString() + '?y=' + randomString(4) + '">';
  
     data+='</div>';
     data+='</div>';
     displayData(data, { data_id: "avatar-big",osclose:true}); 
   
}



function printOptions(name){
  
 var data='<div class="center-div bg-white">';
     data+='<div class="center-header ellipsis" style="padding-left: 16px; font-size: 17px;">Print options</div>';
     data+='<div class="center-text-div text-center" style="padding: 0 10px;">';
 
     data+='<table class="table text-center" style="margin-bottom: 15px;">';
     data+='<tr>';
     data+='<td><button class="btn btn-white-black" onclick="printReport();"><img src="' + ASSETS_DOMAIN + '/images/button-icons/pdf.png" style="width: 17px; height: 17px;"> PDF</button></td>';
     data+='<td><button class="btn btn-white-black" onclick="exportReport();"><img src="' + ASSETS_DOMAIN + '/images/button-icons/json.png" style="width: 17px; height: 17px;"> JSON</button></td>';
     data+='<td><button class="btn btn-white-black" onclick="exportReport(1);"><img src="' + ASSETS_DOMAIN + '/images/button-icons/net2.png" style="width: 17px; height: 17px;"> CSV</button></td>';
     data+='</tr>';

     data+='</table>';
  
     data+='</div>';
     data+='</div>';
     displayData(data, { data_id: "print-options", oszindex: 180, osclose:true});
}



var pointerTimer;
var manualUpgradeFormTimer;
  
$(function(){
  
$('body').on("pointerdown",".long-select", function(){
 // if(!$('.mark_members').next('label').find('span').is(':visible')) return false;
  $(".dropdown-toggle").prop("checked", true);
  
  var this_=$(this);
   var id=this_.data('id');
  var hlight=$("#" + id + "-highlighted");
  
  pointerTimer = setTimeout(function(){
 
  if ( hlight.is(":visible") ){
     hlight.hide();
    }   
   else {
     hlight.fadeIn();
     if( typeof showHighlightedOptions ==="function"){
       showHighlightedOptions();
     }
   }
 var total=$(".highlighted:visible").length;
    
  if (  total <1)
  { 
  //$('#open_search_input').show();
    if( typeof closeHighlightedOptions ==="function"){
       closeHighlightedOptions();
     }
  }else{
    $("#total-highlighted").text( total);
    $('#open_search_input').hide();
  }
      },800);

  }).on("pointerout",".long-select",function(){
    clearTimeout(pointerTimer);
});

  
$('body').on('click','.long-select', function(){
  var this_=$(this);
   var id=this_.data('id');
   var hlight=$("#" + id + "-highlighted");

  if( hlight.is(":visible")){
   hlight.hide();
  }else if( $(".highlighted:visible").length>0){
   hlight.fadeIn(200);
  }
  
  var total=$(".highlighted:visible").length;
  
  if( total<1){
    
    if( typeof closeHighlightedOptions ==="function"){
       closeHighlightedOptions();
     }
  }
  
  $("#total-highlighted").text( total);
  
});
  
  
 $("body").on("touchmove",".hover-me", function() { 
     var this_=$(this);
     var from=this_.data("hover-from")||"#f3f3f3";
     var to=this_.data("hover-to")||"#ffffff";
  
   this_.stop().animate({backgroundColor: from},200,function(){
       this_.stop().animate({backgroundColor: to},100);
   });
}); 

  
 $("body").on("pointerdown",".MANUAL--UPGRADE", function(){
   if( upgraded() ) return;
  
  manualUpgradeFormTimer = setTimeout( function(){
   manualUpgradeForm();   
    },1000);

  }).on("pointerout",".MANUAL--UPGRADE",function(){
    clearTimeout( manualUpgradeFormTimer);
});
  
   
});

  function manualUpgradeForm(){
    
    var data='<div class="center-div bg-white">';
     data+='<div class="center-header text-center">Enter your App ID</div>';
     data+='<div class="center-text-div text-center" style="padding: 0 16px;">';
     
     data+='<div class="text-center">';
     data+='<input type="text" id="upgrade-code-input" class="form-control btn btn-lg btn-light" placeholder="App ID">';
     data+='</div>';
     data+='<table class="table" style="margin-bottom: 15px;"><tr>';
     data+='<td class="text-center"><button class="btn btn-white-black" onclick="manualUpgrade(this);"><img src="' + ASSETS_DOMAIN + '/images/button-icons/mark_grey.png" style="width: 17px; height: 17px;"> Confirm</button></td>';
     data+='</tr></table>';
  
     data+='</div>';
     data+='</div>';
   displayData( data, {oszindex:500, data_id: "manual-upgrade-form",osclose:true});
  }


function manualUpgrade(t){
  
  var this_=$(t);
  var code=$.trim( $("#upgrade-code-input").val() );
  var aid= strtolower(  appId());
  
 if(strtolower(  code)!= aid) {
   return toast("Invalid App Id");
 }
   buttonSpinner(this_)
  $.ajax({
    url:manual_upgrade_link,
    cache: false,
  }).done(function( result){
   buttonSpinner(this_, true);
  result= $.trim( result);
    
  var re=new RegExp(aid,"gim");
    
  if( !result.match(re) ){
    return toast("Validation failed");
  }    
    localStorage.setItem("pro_activated","true");
    showInfo("", "Upgraded successfully. Please close and re-start app for upgrade to take effect.");
  }).fail(function(e, xhr,txt){
    toast("Check your internet. " + txt);
    buttonSpinner(this_, true);
  });
  
}

function loadTemplate(elem){ 
  elem=elem||$("#NOTE--CONTAINER");
  if( elem.hasClass("loaded") ) return;
  var temp_=localStorage.getItem("appTemplateSelected")||DEFAULT_TEMPLATE;
  var dir=new android.File( TEMPLATES_DIR);
  
  if(!dir.isDirectory() && !dir.mkdirs() ){
    return toast("Could not create theme dir");
  }
   
  var dir= new android.File( dir,temp_);
  var cssFile= new android.File(dir, "theme.css");
   
  if( !dir.isDirectory() ||!cssFile.isFile() ){
   return android.toast.showLong("THEME INCOMPLETE");
  }
  
 var css =miniProtect(cssFile.read()||"", temp_);
 
 var head=$("head");
  // head.append("<link rel='stylesheet' href='" .cssFile.toString() + "' type='text/css'>");
    head.append("<style>" + css + "</style>");  
 }



/*
function photoLayout(link, title, class_){ 
 return '<img onclick="enlargePhoto(this);" data-src="' + link + '" class="lazy NOTE--IMAGE ' + class_ + '" alt="' + title + '">'; 
}
*/



function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const htmlFormat =[
    { symbol: '*', tag: 'strong',  regex: '(?<=[ ">~`\^_.\+-]|^)\\*(?:(?!\\s)).*?[^ ]\\*(?=[\\W_]|$)' },
    { symbol: '_',   tag: 'em',    regex: '(?<=[ ">~`\^\*.\+-]|^)_(?:(?!\\s)).*?[^ ]_(?=[\\W_]|$)'},
    { symbol: '~',   tag: 's',     regex: '(?<=[ ">`\^\*_.\+-]|^)~(?:(?!\\s)).*?[^ ]~(?=[\\W_]|$)' },
    { symbol: '--',  tag: 'u',     regex: '(?<=[ ">~`\^\*_.\+]|^)(?:--)(?:(?!\\s)).*?[^ ](?:--)(?=[\\W_]|$)' },
  //  { symbol: '```', tag: 'tt',    regex: '(?<=[\\^> ]|^)(?:```)([^]*)(?!```)(?:```)', m:'g' },
  //  { symbol: '^^^',  tag: 'code', regex: '(?<=[`> ]|^)(?:\\^\\^\\^)([^]*)(?:\\^\\^\\^)(?=[\\W_]|$)',m:'gm' },
    { symbol: '+r+', tag: 're',    regex: '(?<=[ ">~`\^_.\*\+-]|^)(?:\\+r\\+)(?:(?!\\s)).*?[^ ](?:\\+r\\+)(?=[\\W_]|$)' },
    { symbol: '+b+', tag: 'bl',    regex: '(?<=[ ">~`\^_.\*\+-]|^)(?:\\+b\\+)(?:(?!\\s)).*?[^ ](?:\\+b\\+)(?=[\\W_]|$)' },
    { symbol: '+g+', tag: 'gr',    regex: '(?<=[ ">~`\^_.\*\+-]|^)(?:\\+g\\+)(?:(?!\\s)).*?[^ ](?:\\+g\\+)(?=[\\W_]|$)' },
    { symbol: '+s+', tag: 'small', regex: '(?<=[ ">~`\^_.\*\+-]|^)(?:\\+s\\+)(?:(?!\\s)).*?[^ ](?:\\+s\\+)(?=[\\W_]|$)' },
    { symbol: '+l+', tag: 'big',   regex: '(?<=[ ">~`\^_.\*\+-]|^)(?:\\+l\\+)(?:(?!\\s)).*?[^ ](?:\\+l\\+)(?=[\\W_]|$)' },
    { symbol: '+c+', tag: 'center', regex:'(?<=[ ">~`\^_.\*\+-]|^)(?:\\+c\\+)(?:(?!\\s)).*?[^ ](?:\\+c\\+)(?=[\\W_]|$)' }
]

 
function parsemd__(string, show_symbol){
 var obj={}
 string=(string||"").replace(/<br>/g,"\n");

  var obj={}
  
 string=string.replace(/(?<=[^="'\w\]\[]|^)(https:\/\/[^\s\+\\\^\<\>`\{\}\[\]]+\.[^\s\^\<\>\\`\{\}\[\]]+)/gi,function(m){
 var link=m.toString();
 var lid="http:" + randomNumber(8) + "??";
 obj[lid]= link;
 return lid;  
 });
  
  
string=string.replace(/(\b(https\?):\/\/[^\s\+\^\\`\<\>\{\}\[\]]+\.[^\s\^\\`\<\>\{\}\[\]]+)/gi,function(m){
  var link=m.toString();
  var lid="http:" + randomNumber(8) + "%%";
  obj[lid]=link;
  return lid;
});  
 
  
 $.each( htmlFormat, function(i,v){
  
  var symbol=v.symbol;
  var tag= v.tag;
  var reg= v.regex;
  var modifier= v.m||"gm";
   
  if( show_symbol && tag==="code"){
    tag="plaincode";
  }
   const regex=new RegExp( reg, modifier);
   const match = string.match(regex);
   
   if(!match ) return;
  
 if( tag!=="code" && tag!=="tt" && tag!=="plaincode" && match.toString().match(/\n/) ) return;
  
  match.forEach(function(m){
    var formatted = m;
   
 formatted= formatted.replace( new RegExp("(^" + escapeRegExp( symbol) + ")"), function(m,n){
   return "<" + tag + ">";
 });    

 formatted= formatted.replace( new RegExp("(" + escapeRegExp( symbol) + "$)"), function(m){
    return "</" + tag + ">";
  });
 string = string.replace( m, (show_symbol?'<span class="text-format-symbol">' + symbol + '</span>':'') + formatted + ( show_symbol?'<span class="text-format-symbol">' + symbol + '</span>':'') );
    });
 });
 
  $.each(obj, function( lid, link){
  if( lid.match(/%/)){
     string=string.replace( lid, link);
  }
    else{
      string=string.replace( lid, '<a href="' + link + '" target="_blank">' + link + '</a>');
    }
  })
 
  
return string;  
}


function __format(text, show_symbol, file_id){
  var string = parsemd__( text, show_symbol );
   
  var vRegex=/(?<=[^\w]|^)\[video=(.*?)\](.*?)~(.*?)\[\/video\](?=[\W_]|$)/g;
  var aRegex=/(?<=[^\w]|^)\[audio=(.*?)\](.*?)\[\/audio\](?=[\W_]|$)/g;
  var iRegex=/(?<=[^\w]|^)\[img=(.*?)\](.*?)\[\/img\](?=[\W_]|$)/g;
  var fRegex=/(?<=[^\w]|^)\[file=(.*?)\](.*?)~(.*?)\[\/file\](?=[\W_]|$)/g;
  var yRegex=/(?<=[^\w]|^)\[youtube=(.*?)\](.*?)~(.*?)\[\/youtube\](?=[\W_]|$)/g;
  var rRegex=/(?<=[^\w]|^)\[link=(.*?)\](.*?)\[\/link\](?=[\W_]|$)/g;

  file_id=file_id||randomNumber(10);
  
string=string.replace(vRegex, function(m, link, title, poster){  
  if( show_symbol ){   
   return '<osbv>[video=' + link + ']' + poster + '[/video]</osbv>';
   } else return '<osbv src="' + link + '" poster="' + poster + '">' + videoLayout( file_id, "", link, "350_380",title , poster, 0, "external") + '</osbv>';
 }).replace(aRegex, function(m, link, title){  
  if(show_symbol)  {
     return '<osba>[audio=' + link + ']' + title + '[/audio]</osba>';
   } else return '<osba src="' + link + '" title="' + title + '">' + audioLayout( file_id, "", link , title, 0, "external") + '</osba>';
 }).replace(iRegex, function(m, link, title){
  if(show_symbol) {
    return '<osbi>[img=' + link + ']' + title + '[/img]</osbi>';
  }else return '<osbi src="' + link + '" title="' + title + '">' + photoLayout( file_id, "", link, "350_350", title, 0, "external") + '</osbi>';
 }).replace(fRegex, function(m, link, title, ext){
  if(show_symbol) {
    return '<osbf>[file=' + link + ']' + title + '/' + ext + '[/file]</osbf>';
  }else return '<osbf src="' + link + '" title="' + title + '" ext="' + ext + '">' + fileLayout( (ext||"unk"), file_id, "" , link, title, 0, "external") + '</osbf>';
 }).replace(yRegex, function(m, link, title, poster){
  if(show_symbol) {
    return '<osby>[youtube=' + link + ']' + poster + '[/youtube]</osby>';
  }else{
    return '<osby src="' + link + '" poster="' + poster + '">' + youtubeLayout( link, title,poster) + '</osby>';
  }
}).replace(rRegex, function(m,link, title){
  return '<a href="javascript:void(0);" data-href="'+link + '" class="link-reference" onclick="loadReference(this);">' + title + '</a>';
})
  .replace(/\[\[([\w_ -]+):(.*?)\]\]/gi, function(m, site, account ){
 var site_=site.split(" ")[0]
  return '<span class="SOCIAL--LINK--BTN" data-site="' + site_ + '" data-account="' + account + '" onclick="openSocialLink(this);"><i class="fab fa-' + site + '"></i> ' + account + '</span>';
});

  return string;
}



function openSocialLink(t){
  	var this_=$(t);
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
  
 openInBrowser(href);  
  /*
   var data='<div class="center-header pt-2 ps-3"><small><img class="w-16 h-16" src="file:///android_asset/go-icons/info.png"> Social link</small></div><div class="pt-1 pb-3 pl-3 pr-3 center-text-div">';
  data+='<i class="fa fa-2x text-secondary fa-'+ site + '"></i> <a href="' + href + '" style="font-size: 13px; font-weight: bold;" target="_blank">  ' + href + '</a>';
  data+='</div>';
  
   displayData(data, { width: '80%', max_width:'500px',data_class: '.preview-link-div', osclose:true});
  */
}
 
 
function cJob(name, time_, callback){
   //time_ in minutes
 var timeout=moment(new Date() ).add(time_,'minutes').unix();  
 var currentTime=moment().unix();  
  var uc=+localStorage.getItem(name + '_check');
   if(!uc ) {
  localStorage.setItem( name + '_check', timeout);
   uc=timeout;
  }
  if (currentTime<uc ) return;
  localStorage.setItem(name + '_check', timeout );
  if(typeof callback==="function"){
     callback();
  }
}
 

document.addEventListener("importPhotoCompleted", function(evt){
   var wid = +android.webView.getId();
   var curr_Id=+localStorage.getItem("drawerSelected")||0
    curr_Id=curr_Id+100;
  
  if( curr_Id!==wid) return;
    
  var fpaths=evt.detail.file_paths;
  
  if( fpaths.length<2){
    return toast('Check file size.');
  }
  
  var id=$("#id-update-profile").val();
  var class_=localStorage.getItem("classSelected")||"first-class";
  var dir=new android.File( PHOTO_DIR, class_ );
  if( !dir.isDirectory() && !dir.mkdirs() ){
    return toast("Could not create photo dir");
  }
  
  var ifile=new android.File(fpaths[0] );
  var tfile=new android.File( fpaths[1] );
  
  var avatar=new android.File( dir, id + ".png");
  var thumb= new android.File( dir, id + "-thumb.png");
 
  if( ifile.copyTo( avatar) ){
   //if ( !android.bitmaps.toThumbnail(avatar,thumb,100) ){
     // avatar.delete();
     //return toast("Thumbnail error");
  // }
   
   if( !tfile.copyTo(thumb) ){
     avatar.delete();
  return toast("Thumbnail error"); 
   }
   
 var tmp_dir=new android.File( TEMP_DIR);
   
    try{
    tmp_dir.deleteFileOrFolder();
    }catch(e){}  
   
  avatar= avatar.toString() + "?y=" + randomString(4);  
  thumb=  thumb.toString() + "?y=" + randomString(4);
   
 $("#upd-avatar").attr('src', thumb ).removeClass("d-none");
 $("#cup-avatar-2").addClass("d-none");
 
  $("#" + id + "-avatar").attr("src", thumb).removeClass("d-none");
  $("#" + id + "-avatar-2").addClass("d-none");
  $("#student-avatar-big").attr("src", avatar);
   return toast("Photo changed", {type: "success"});
 }
  
  return toast("Could not pload");
  
});



