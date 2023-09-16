//alert( JSON.stringify( android.download.status));


function OSB_dm_test(){
  
  var url="https://gospelhotspot.net/wp-content/uploads/Donsam-This-Kind-God.mp3";
  var fail_url="http://cpanel.example.com.ng/cpsess9380549911/download?file=backup-3.29.2023_04-42-57_abcsfjxl.tar.gz";
  var img_url="https://www.bridalguide.com/sites/default/files/slideshow-images/floral-wedding-cakes-cake-alchemy-TCA_WCwsrc.jpg";

 // OSB_dm.download( url, "amusic.mp3");
   OSB_dm.download( fail_url,"download.gz");
//  OSB_dm.download( img_url, "my-test-photo.png");

 OSB_dm.download(img_url,"aio.png");
  OSB_dm.downloads();
 }

function file_download_completed(result){  
  //This function is called each time a download is successful
  //result: contains details of the file downloaded
 
 //JSON.stringify( result );
}

function file_download_failed( result){
  //This function is called each time a download failed
  //result: contains details of the file
  
  //JSON.stringify( result );
}

function file_download_running(result){
  // alert( JSON.stringify( result ))
}

var OSB_dm_showType,
    OSB_dm_cancel,
    OSB_dm_delete,
    OSB_dm_delConfim,
    OSB_dm_closeDelConfirm,
    OSB_dm_openFile,
    OSB_dm_modalBox,
    OSB_dm_closeModalBox;

var OSB_dm = (function() {
var FAILED__={}
var RD={} //Running Downloads

var time_= Math.round(+new Date()/1000);
  
var OSB_dmo={
  "folder": android.files.getExternalFilesDir() + "/OSB-dm",
  "dl_to": android.files.getPublicDir("downloads"),
  "ic_path":"file:///assets/OSB-dm/icons"
}

function ftype(ext){
var x={
  "png":"image",
  "jpg":"image",
  "jpeg":"image",
  "gif":"image",
  "mp4":"video",
  "mkv":"video",
  "avi":"video",
  "mov":"video",
  "mp3":"audio",
  "zip":"archive",
  "tar":"archive",
  "gz":"archive",
  "txt":"document",
  "doc":"document",
  "csv":"document",
  "docx":"document",
  "xlsl":"document",
  "pdf":"pdf",
  "apk":"app",
  "js":"web",
  "json":"web",
  "php":"web",
  "css":"web",
  "cgi":"web",
  "unk":"other"
}
  return x[ext]||"other";
}

var download=function(prams, save_as, extra) {
  //REQUEST READ/WRITE PERMISSION

 if( !canWrite() ){
  return requestWritePerm();
 }
   
  var _xtend=false;
  
if ( typeof prams === "object" &&
    !Array.isArray(prams) &&
    prams !== null
) {
  
 var url=prams.url;
   if(prams.path) save_as=prams.path;
   _xtend=true;
}
 else if( typeof prams==="string" ){
    var url=prams;   
  }  
else{
return alert("Url not found");
}
 
if(!save_as ){
 return  alert('Second argument "save_as" missing')
}
  
 var params={
    url: url,
    path:  save_as,
    public: true,
    dirType: "Download"
    }
   
if( _xtend )  params=extend( params, prams );
   
  var fsize=0;
   
 var tmpDownloadDir=new android.File( OSB_dmo.folder ,  '/DOWNLOADING');
 var downloadedDir= new android.File( OSB_dmo.folder ,  '/DOWNLOADED');
 
if(!tmpDownloadDir.isDirectory() && !tmpDownloadDir.mkdirs()){
  return -1; //Unable to create tmp download directory
} 
 else if(!downloadedDir.isDirectory() && !downloadedDir.mkdirs() ){
  return -2; //Unable to create downloaded directory
} 
  
var filename = new android.File( params.path).getName() //url.replace(/^.*[\\\/]/, '');
  
var ext=filename.split(".")[1]||"unk";
var accepted_dir_type=["Music","Podcasts","Ringtones","Alarms","Notifications","Pictures","Movies","Download","DCIM","Documents"];

if( params.public ){
  var dfile = new android.File( android.files.getExternalDir(), params.path);

if( params.dirType ){
  if( accepted_dir_type.indexOf( params.dirType)!==-1){
 var type=params.dirType.toLowerCase().replace("download","downloads");
    dfile = new android.File( android.files.getPublicDir(type) , params.path);
  }else{
    return alert("dirType error: should be one of these: " +  accepted_dir_type.toString() )
  }
 }  
}
 else{
  var dfile=new android.File( android.files.getExternalFilesDir(), ( params.dirType?params.dirType + "/":"" ) + params.path);
 }
 
   
if( dfile.isFile() ){
 //  filename= _randomNumbers(6) + "-" + filename;
   return 1; //File already exist
 }

var tmpFile=new android.File(tmpDownloadDir, filename + ".txt");
  
if( tmpFile.isFile() ){
  return -3; //"Downloading"
}
  
var did = android.download.start( params);
 
  //Save file info
var obj=new Object(); 
  
  obj["did"]=did;
  obj["ext"]=ext;
  obj["url"]=params.url;
  obj["filename"]=filename;
  obj["dest"]=dfile.toString();
  obj["size"]=fsize;
  obj["date"]= time_;
  obj["extra"]=extra||"";
  
  //RD[did]=obj;  
  
if( !tmpFile.write( JSON.stringify(obj) ) ){
   android.download.remove(did);
   return 0;
}
 refreshDownloadsCheck();
   return did;
}

var downloads=function(data_only){
var downloading__=[];
var downloaded__=[];
  
  stad(data_only);
  
  var data='<div class="container-fluid">'; 
    
  var tmpDownloadDir=new android.File( OSB_dmo.folder,  '/DOWNLOADING');
  
  var list=tmpDownloadDir.listFiles();
  var total=list.length; 
data+='<div class="text-secondary mb-3 OSB_dm-cat-title">In progress</div>';
   
if( total<1){
   data+='<div class="mb-2 text-center">No running downloads</div>';
}
 else{
   data+='<div id="running-downloads-files">';
  //DOWNLOADINGS
   
  for(var i=0; i<total;i++){
   var file=new android.File( list[i] );
   var obj=JSON.parse( file.read() );
   
 //RD[did]=obj;  
    
    
 if(data_only) downloading__.push( obj);
   var did=obj.did;
   var filename=obj.filename;
   var ext=obj.ext;
 
  if(!data_only)  data+= rdHtml_( did, filename, ext);
 }
  data+='</div>';
}
  
var dDir=new android.File( OSB_dmo.folder,  '/DOWNLOADED');
 
  var list=dDir.listFiles();
  var total=list.length; 
  
data+='<div class="text-secondary mt-3 mb-3 OSB_dm-cat-title">Completed</div>';

if( total<1){
  
 data+='<div class="mb-2" id="downloaded-files"><div class="text-center" id="no-download-file">No completed downloads yet</div></div>';
}
 else{
   
  data+='<div id="downloaded-files">';
   list.reverse();   
 
   //DOWNLOADEDS 

 for(var i2=0;i2<total; i2++){
  var file=new android.File( list[i2]);
   var obj=JSON.parse( file.read() );
   
  if( data_only)   downloaded__.push( obj);
   
   var did=obj.did;
   var filename=obj.filename;
   var ext=obj.ext;
   var url=obj.url;
   var size=obj.size||0;
   var date_=obj.date;
  
if(!data_only )  data+= dHtml_( did, filename, ext,url,size, date_);
 }
  
 data+='</div>';  
}
    
data+='</div>';

  if(!data_only ){

 var el=document.getElementById("OSB--dm");
     el.innerHTML=data;
 var elc=document.getElementById("OSB--dm--container");
  setTimeout( function(){
    elc.style.display="block";
 },300)
  } 
  
 checkDownloadSuccess();  
  
var __r=new Object();

   __r["downloading"]=downloading__;
  __r["downloaded"]=downloaded__;
return __r;
}

function rdHtml_( did, filename, ext,url){
  
var data='<div class="OSB-container mb-3 OSB_dm-file-container OSB_dm-' + ftype(ext) + '-container" id="dl-container-' + did + '">';

data+='<div class="OSB-row">';
data+='<div class="OSB-col pt-2 pr-0 pl-0 text-center" style="max-width: 50px;">';
data+='<img class="OSB_dm-file-type-icon" src="' + OSB_dmo.ic_path + '/' + ftype(ext) + '.png">';
 data+='</div>';
data+='<div class="OSB-col">';
data+='<div class="ellipsis OSB_dm-filename">' + filename + '</div>';
data+='<div class="text-secondary OSB_dm-bytes-received" id="dl-bytes-' + did + '"><small><i>Loading...</i></small></div>';
data+='</div>';
data+='<div class="OSB-col p-0" id="dl-cancel-' + did + '" style="height: 17px; width: 70px; max-width: 70px;">';
data+='<div class="d-inline-block" style="width: 50%;" id="retry-download-' + did + '"></div>';
data+='<div class="text-center d-inline-block text-danger" style="width: 50%;" onclick="OSB_dm_cancel(' + did + ',\'' + filename + '\');"><img class="OSB_dm-cancel-icon" src="' + OSB_dmo.ic_path + '/cancel.png"></div>';
data+='</div>';
data+='</div>';
  
data+='<div class="mb-2 OSB_dm-download-progress-container">';
data+='<div class="OSB_dm-download-progress" id="dl-progress-' + did + '"></div>';
data+='</div>';
data+='</div>';  
 return data;
}


function dHtml_( did, filename, ext,url,size,date_){

var data='<div class="OSB-container mb-2 OSB_dm-file-container OSB_dm-' + ftype(ext) + '-container" id="dld-container-' + did + '">';
data+='<div class="OSB-row">';
data+='<div class="OSB-col pt-2 pl-0 pr-0 text-center" style="max-width: 50px;">';
data+='<img class="OSB_dm-file-type-icon" src="' + OSB_dmo.ic_path + '/' + ftype(ext) + '.png">';

data+='</div>';
data+='<div class="OSB-col">';
data+='<div class="ellipsis OSB_dm-filename" data-url="' + url + '" data-ext="' + ext + '" onclick="OSB_dm_openFile(\''+ filename + '\');">' + filename + '</div>';
data+='<div class="row text-secondary"><div class="col-6 OSB_dm-file-size">' + abbrNum( size ,1) + '</div><div class="col-6 text-right OSB_dm-time-ago">' + timeSince( date_) + '</div></div>';
data+='</div>';
data+='<div class="OSB-col text-center p-0 pt-2" id="dl-cancel-' + did + '" onclick="OSB_dm_delConfirm(' + did + ',\'' + filename + '\');" style="max-width: 40px;">';
data+='<img class="OSB_dm-delete-icon" src="' + OSB_dmo.ic_path + '/delete.png">';
data+='</div>';
data+='</div>';
  
data+='</div>';
return data;
}


var getAllDownloading=function(){
  var tmpDownloadDir=new android.File( OSB_dmo.folder,  '/DOWNLOADING');
  var list=tmpDownloadDir.listFiles();
  var total=list.length;
var arr={};
  
  if( total<1){
    return arr;
  }
  
  var i;
for( i=0;i<total;i++){
  
var file=new android.File( list[i] );   
var obj=JSON.parse(file.read() );
     
   var did=obj.did;
   var filename=obj.filename;
   var url=obj.url;
   var date_=obj.date;
   var dest=obj.dest;
   
   var result_=getDownloadStatus(did);

  result_["filename"]=filename;
  result_["dest"]=dest;
  result_["url"]=url;
  result_["date"]=date_;
  
   arr[did]=result_;
  }
 return arr; 
}

var checkDownloadInt_;

var refreshDownloadsCheck=function(){
   sessionStorage.removeItem("download_running");
   clearInterval( checkDownloadInt_);
   checkDownloadSuccess();
}
  
var checkDownloadSuccess=function(){ 
  if( sessionStorage.getItem("download_running") ){
    return;
    //toast('running')
  }
 
  var tmpDownloadDir=new android.File( OSB_dmo.folder,  'DOWNLOADING');
 
  var list=tmpDownloadDir.listFiles();
  var total=list.length;
  
  if(total<1){
    sessionStorage.removeItem("download_running");
   clearInterval(checkDownloadInt_);
    return;
  }
  
  sessionStorage.setItem("download_running","true");
  var len=0;
 
   checkDownloadInt_=setInterval(function(){
   
if( len>=total ){
  refreshDownloadsCheck();
  return;
  }
     
 var file=new android.File( list[len] );
 
if( !file.isFile() ){
  //remove from list
  
}else{
  var obj=JSON.parse(file.read() );
     
   var did=obj.did;
   var filename=obj.filename;
   var failed=obj.failed;
   
  var file_path=new android.File( obj.dest);
  
 var dlProg=document.getElementById("dl-progress-" + did)
 var rbtn=document.getElementById("retry-btn-" + did);      
 
 var result=getDownloadStatus(did);
  
 if(!result){
   if( !FAILED__[did]) downloadFailed_(obj);
  }
   else{
  var dstatus=result.status; 
  
  /*     
     1 = Waiting to start i.e. pending
     2 = Download running
     4 = Paused
     8 = successful
     16= Failed     
  */
   
  var tbytes=result.bytes;
  var rbytes=result.bytesDownloaded;
  var mediaType=result.mediaType;

 obj["size"]=tbytes;
 obj["bytesDownloaded"]=rbytes;
 obj["localUri"]=result.localUri;
 obj["status"]=dstatus;
   
var elb=document.getElementById("dl-bytes-" + did)    
   
 if( dstatus==1){
   if(elb!=null )  elb.innerHTML='<small><i>Waiting for network...</i></small>'; 
 if( typeof file_download_pending==="function" ){
   file_download_pending(obj )  
 }

}
   else if(dstatus==4){
    if( elb!=null) elb.innerHTML='<small><i>Download paused...</i></small>'; 
  
 if( typeof file_download_paused==="function" ){
  file_download_paused(obj );
 }
   }
   else if(dstatus==8){
     delete obj["bytesDownloaded"];
   
  if( dlProg!=null) dlProg.style.width='100%';
    //Download complete
    downloadCompleted_(obj);
 }
 else if(dstatus==16){
   
    //Download failed
 if(!FAILED__[did] ) downloadFailed_(obj);
else if( total<2 ) {
   sessionStorage.removeItem("download_running");
   clearInterval( checkDownloadInt_);
}
 
 }
   else{
 
 if( typeof file_download_running==="function" ){
  file_download_running(obj );
 }
     
  var percent=( Math.floor( (rbytes*100)/tbytes ) );
  if( dlProg!=null) dlProg.style.width= percent + "%";
   
   var rb= abbrNum(rbytes, 1);
   var tb= abbrNum(tbytes, 1);
 
   if( tbytes==-1){
    if( elb!=null ) elb.innerHTML='<small><i>Waiting...</i></small>';
  
  }else{
     if(elb!=null) elb.innerHTML=rb + "/" + tb;
   }
     } 
   }
  len++;
    }
     
  }, (checkDownloadInt_?2500:300) );
}

var downloadCompleted_=function(obj){
  var did=obj.did;
  var file_type=obj.ext;
  var file_=obj.dest; /*String: e.g received/images/TMP/file.png*/
  var filename=obj.filename;
  var url=obj.url;
  var size=obj.size;
  delete FAILED__[did];
  
 var tmpDownloadDir=new android.File( OSB_dmo.folder,  '/DOWNLOADING');
 var  downloadedDir=new android.File( OSB_dmo.folder,  '/DOWNLOADED');
 
 var rid=randomString(15);
  
try{ 

  var tmpFile=new android.File( tmpDownloadDir, filename + ".txt");
  var dfile=  new android.File( downloadedDir, filename + ".txt" );
  
 if( dfile.write( JSON.stringify(obj,null,"\t") ) ){
     
  if( typeof file_download_completed==="function" ){
     file_download_completed(obj); 
  }
  tmpFile.delete();
   
   if( !OSB_dm.opened() ) return;  
 
  var eld=document.getElementById("dl-container-"+ did );
   eld.remove()
  
  var elnd=document.getElementById("no-download-file");
    elnd.remove()
      
   var elrd=document.getElementById("downloaded-files");
  
    var addElem = document.createElement("div");
       addElem.innerHTML= dHtml_( did, filename, file_type,url,size);    
   elrd.insertBefore( addElem, elrd.firstChild);
 
 }
  
}catch(e){}

}


var downloadFailed_=function(obj){
  var did=obj.did;
  var filename=obj.filename;
  var url=obj.url;
  var ext=obj.ext;
  obj["failed"]="failed";
  FAILED__[did]="X";
     
   did=obj["did"];
  
 var tmpDownloadDir=new android.File( OSB_dmo.folder,  '/DOWNLOADING');
  try{     
   var tmpFile=new android.File(tmpDownloadDir, filename + ".txt");
   var dfile = new android.File(OSB_dmo.dl_to, filename);
   
  tmpFile.write( JSON.stringify(obj) );
 
   if( typeof file_download_failed==="function" ){
    file_download_failed(obj); 
  }  
    
  if( !OSB_dm.opened() ) return;
    
  var elb=document.getElementById("dl-bytes-" + did)
      elb.innerHTML='<small class="text-danger" id="retry-btn-' + did + '"><i>Download failed</i></small>';
        
   var elr=document.getElementById("retry-download-" + did)  
   
   elr.addEventListener("click",function(){
  
   if( dfile.isFile()){
     dfile.delete();
  }    
 
  if( tmpFile.isFile() ){
    delete FAILED__[did];
      tmpFile.delete();
    }

  var el=document.getElementById("dl-container-" + did );  
      el.remove();
  
 var ndid=OSB_dm.download( url, filename);
  
  if( ndid>0) {
   var elrd=document.getElementById("running-downloads-files");
   var addElem = document.createElement("div");
       addElem.innerHTML= rdHtml_( ndid, filename, ext);
    
   elrd.insertBefore( addElem, elrd.firstChild);   
  refreshDownloadsCheck();
  }
 });
elr.innerHTML='<img src="' + OSB_dmo.ic_path + '/retry-download.png" class="OSB_dm-retry-icon">';                        
                             
}catch(e){}
  
}

var getDownloadStatus=function(id) {
  var dm = android.java.activity.getSystemService("download");
  var queryClass = new android.JavaObject("android.app.DownloadManager$Query");
  var query = queryClass._newInstance([]);
  var cursor = dm.query(query);
  if(!cursor) return null;
  cursor.moveToFirst();
  var idIdx = cursor.getColumnIndex("_id");
  var statusIdx = cursor.getColumnIndex("status");
  var reasonIdx = cursor.getColumnIndex("reason");
  var bytesIdx = cursor.getColumnIndex("total_size");
  var bytesIdxx = cursor.getColumnIndex("bytes_so_far");
  var mediaType = cursor.getColumnIndex("media_type");
  var lastModified = cursor.getColumnIndex("last_modified_timestamp");
  var localUri = cursor.getColumnIndex("local_uri");
  
  var status = -1;
  
  while(!cursor.isAfterLast()) {
    var cId = cursor.getLong(idIdx);
    if(cId==id) {
       var result = {};
       result.status = cursor.getInt(statusIdx);
       result.reason = cursor.getInt(reasonIdx);
       result.bytes = cursor.getLong(bytesIdx);
       result.bytesDownloaded = cursor.getLong(bytesIdxx);
       result.mediaType=cursor.getString(mediaType);
       result.lastModified=cursor.getString(lastModified);
       result.localUri=cursor.getString(localUri);
      
       cursor.close();
       return result;
    }
    else cursor.moveToNext();
  }
  cursor.close();
  return null;
}


function abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "K", "M", "B", "T" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
             // Here, we multiply by decPlaces, round, and then divide by decPlaces.
             // This gives us nice rounding to a particular decimal place.
             number = Math.round(number*decPlaces/size)/decPlaces;

             // Handle special case where we round up to the next abbreviation
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }

             // Add the letter for the abbreviation
             number += abbrev[i];

             // We are done... stop
             break;
        }
    }

    return number;
}


function timeSince( date) {
  date=new Date( +date * 1000);
  var seconds = Math.floor( ( new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + "y";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + "mo";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + "d";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + "h";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + "m";
  }
 
 return "Just now";
 // return Math.floor(seconds) + " seconds";
}
  
  
var stad=function(data_only){
  if( data_only ) return;
  
  var el=document.getElementById("OSB--dm");
  var elc=document.getElementById("OSB-dm");
  
  if( el!=null) {
    elc.style.display="block";
    return;
  }
    
   
 var stad='<div id="OSB--dm--container" class="go-cont">';
    stad+='<div class="u-shadow" onclick="OSB_dm_close();"></div>';
  stad+='<div class="go-child-cont">';
   stad+='<div class="u-header" style="border-bottom: 1px solid rgba(0,0,0,0.16);">';
   stad+='<div class="OSB-container">';
 stad+='<div class="OSB-row">';
 stad+='<div class="OSB-col" onclick="OSB_dm_close();" style="padding: 10px 0 10px 14px; max-width: 60px;">';
 stad+='<img class="OSB_dm-close-icon" src="' + OSB_dmo.ic_path + '/back.png">';
 stad+=' </div>';
 stad+='<div class="OSB-col" style="padding-top: 8px;">';
 stad+=' <b>Downloads</b>';
 stad+='</div>';
 stad+=' </div>';
 stad+=' </div>';

  stad+='<div id="OSB_dm-type-btn-container">';

 stad+='<button class="show-type-btn OSB_dm-type-btn-selected" onclick="OSB_dm_showType(this,\'file\');"><img src="' + OSB_dmo.ic_path + '/all.png">All</button>'; 
 stad+='<button class="show-type-btn" onclick="OSB_dm_showType(this,\'image\');"><img src="' + OSB_dmo.ic_path + '/image.png">Images</button>';
 stad+='<button class="show-type-btn" onclick="OSB_dm_showType(this,\'video\');"><img src="' + OSB_dmo.ic_path + '/video.png">Videos</button>';
 stad+='<button class="show-type-btn" onclick="OSB_dm_showType(this,\'audio\');"><img src="' + OSB_dmo.ic_path + '/audio.png">Audios</button>';
 stad+='<button class="show-type-btn" onclick="OSB_dm_showType(this,\'pdf\');"><img src="' + OSB_dmo.ic_path + '/pdf.png">Pdfs</button>';
 
 stad+='<button class="show-type-btn" onclick="OSB_dm_showType(this,\'document\');"><img src="' + OSB_dmo.ic_path + '/document.png">Documents</button>';
 stad+='<button class="show-type-btn" onclick="OSB_dm_showType(this,\'archive\');"><img src="' + OSB_dmo.ic_path + '/archive.png">Archives</button>';
 stad+='<button class="show-type-btn" onclick="OSB_dm_showType(this,\'web\');"><img src="' + OSB_dmo.ic_path + '/web.png">Web</button>';
 stad+='<button class="show-type-btn" onclick="OSB_dm_showType(this,\'app\');"><img src="' + OSB_dmo.ic_path + '/app.png">Apps</button>';
 stad+='<button class="show-type-btn" onclick="OSB_dm_showType(this,\'other\');"><img src="' + OSB_dmo.ic_path + '/other.png">Others</button>';
 stad+='</div>';
  
  
 stad+=' </div><!--end u-header-->';
 stad+=' <div class="u-content">';
  stad+='<div class="OSB-container">';
  stad+='<div id="OSB--dm"></div>';
 
 stad+='   </div>';
 stad+='  </div>';
 stad+=' </div>';
 stad+='</div>';
   
  
   var elemDiv = document.createElement('div');
      elemDiv.setAttribute("id","OSB-dm");
      elemDiv.innerHTML=stad;
     document.body.appendChild(elemDiv); 
}

OSB_dm_showType=function(t,type){
//  OSB_dm-file-container OSB_dm-' + OSB_x[ext] + '-element
 var e=document.getElementsByClassName("OSB_dm-file-container")
 var s=document.getElementsByClassName("OSB_dm-" + type + "-container");
 var b=document.getElementsByClassName("show-type-btn");
 
if( s!=null){
  if( type!="file"){
   for(var i = 0; i < e.length; i++){
  e[i].style.display="none";
   }
  }
for(var i = 0; i < s.length; i++){
  s[i].style.display="block";
   }
for(var i = 0; i < b.length; i++){
  b[i].classList.remove("OSB_dm-type-btn-selected");
   }
  t.classList.add("OSB_dm-type-btn-selected");
  }
 }


var canWrite=function( requestType) {
  if( !requestType){
    requestType="WRITE_EXTERNAL_STORAGE";
  }
  
requestType="android.permission." + requestType;
return android.system.checkRuntimePermission(requestType);
 
}

var requestWritePerm=function(requestType){
 if( !requestType){
    requestType="WRITE_EXTERNAL_STORAGE";
  }
  
requestType="android.permission." + requestType;
 android.system.requestPermissions(requestType);
}



var _randomNumbers=function(len,charSet) {
    charSet = charSet || '023456789';
    var randomString='';
    for (var i=0; i<len;i++) {
        var randomPoz=Math.floor(Math.random()*charSet.length);
        randomString+=charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

var extend=function(a, b){
    for(var key in b)
        if(b.hasOwnProperty(key))
            a[key] = b[key];
    return a;
}

OSB_dm_modalBox=function(data, arr ){
  var osclass="dd_" + randomString(10);
  var a=extend({
    ddclass: "body",
    pos: 50,
    gs:true,
    os:true,
    osc: osclass,
    oszindex: 150,
    bground:"#fff",
    data_class: ".nothing",
    osclose: false,
    on_close: "",
    type:0,
    title:"",
    opacity:"0.5",
    dummy: false,
    append: true,
    max_width: "550px",
    width: "90%",
    no_cancel: false, //i.e cannot be cancelled by back button
  },arr)
  
 var data_class_=a.data_class.replace(/(\.|#)/,"");
 
  if( document.getElementsByClassName(data_class_).length) return;

  //osclose if set to true, then user can also close div on overshadow click
  var osclose='';
   if(a.osclose) osclose=' onclick="OSB_dm_closeModalBox(\'' + a.data_class + '\',\'' + a.on_close + '\');"';
  var no_cancel=a.no_cancel?'no-cancel':'';
  
  var div='';
  
 if( a.dummy ){
   
     div+='<div class="OSB_dm-modal-box d-none ' + no_cancel + ' ' + data_class_ + '" data-class="' + a.data_class + '"></div>';
 
 }else if(a.type){
    
    div='<div class="OSB_dm-modal-box center_div ' + no_cancel + ' center-div ' + data_class_ + '" data-class="' + a.data_class + '" style="background: ' + a.bground + '; width: ' + a.width + '; max-width: ' + a.max_width + ';">';
   //  div='<i class="text-danger fa fa-lg fa-close" style="position: absolute; top: 5px; right: 2%;">Close</i>';
    div+='<div class="center_header">' + (a.title?a.title:'') + '</div>';
    div+='<div class="center_text_div" style="width:100%; padding: 10px 15px;">';
    div+=data;
    div+='</div></div>';
 
 }
  else {
    
    div='<div class="OSB_dm-modal-box center_div ' + no_cancel + ' center-div ' + data_class_ + '" data-class="' + a.data_class + '" style="background: ' + a.bground + '; width: ' + a.width + '; max-width: ' + a.max_width + ';">';
    div+= data;
    div+='</div>';
    
  }
  
  var ed=document.createElement("div");
      ed.innerHTML=div;
      document.body.appendChild(ed);
  
  var pos_=a.pos + '%';
  var trans='translate(-50%,-' + pos_ + ')';
 
 var el=document.getElementsByClassName(data_class_)[0];
   
   el.style.zIndex=( a.oszindex + 15), 
   el.style.top=pos_;
   el.style.webkitTransform=trans;
   el.setAttribute("data-overshadow", a.osc);   
   el.insertAdjacentHTML('afterend','<div class="DONT_PRINT dont_print ' + a.osc + '" style="background: #000; position: fixed; z-index: ' + a.oszindex + '; top:0; left:0; right:0;  bottom:0; opacity: ' + a.opacity + '; display:none;"' + osclose + '></div>');
  
 //  if (a.gs) getScroll(true);
  if(a.os) document.getElementsByClassName(a.osc)[0].style.display="block";

}


OSB_dm_closeModalBox=function(elem,callback){
  var elem_=elem.replace(/(\.|#)/,"");

 if(elem.match(/#/)){
  var el=document.getElementById(elem_)
 }else{
 var el=document.getElementsByClassName(elem_)
 }

 if(!el.length) return;
  var os=el[0].getAttribute("data-overshadow");
 
  var callback_first=el[0].classList.contains("callback-first");
  
 if( !callback_first){
   
   el[0].remove();
   
 }
 
 document.getElementsByClassName(os )[0].remove();

if( callback){
  if(typeof callback==='string' ||callback instanceof String){
    window[callback]();
  } else callback();
 }
if( callback_first ) el[0].remove();
}

  
OSB_dm_closeDelConfirm=function(){
 OSB_dm_closeModalBox(".delete-dl-div"); 
}

  
OSB_dm_cancel=function( did, filename){
 if( !confirm("Cancel " + filename + "?") ) return;
  android.download.remove(did);
   var tmpDownloadDir=new android.File( OSB_dmo.folder,  '/DOWNLOADING');
 
 var dfile = new android.File( OSB_dmo.dl_to, filename);
 var tmpFile=new android.File(tmpDownloadDir, filename + ".txt");

try{
  if( dfile.isFile() ) dfile.delete();
  if( tmpFile.isFile() ) tmpFile.delete();

 }catch(e){
  return android.toast.show(e);
}
  var elem=document.getElementById("dl-container-" + did);
  if( elem!=null ) elem.remove();
}


OSB_dm_delConfirm=function( did, filename){

  var data='<div class="center_text_div text-left bg-white" id="delete-dl-div" style="border-radius: 5px; width:100%; font-size: 14px; font-weight: bold; padding: 8px 15px;">';
     data+='<div class="mt-3 mb-3 text-secondary">Delete ' + filename + '</div>';
   
  data+='<div class="custom-control custom-checkbox mb-3">';
   data+='<input type="checkbox" class="custom-control-input" id="dl-from-device">';
   data+='<label class="custom-control-label" for="dl-from-device">';
   data+='<span style="display: inline-block; font-size: 13px;"> Remove from device</span>';
   data+='</label>';
  data+='</div>';
  
  
  data+='<div class="container mb-3">';
  data+='<div class="row">';
   data+='<div class="col-7 text-right p-2"><button class="btn btn-sm btn-primary" onclick="OSB_dm_closeDelConfirm();">Cancel</button></div>';
   data+='<div class="col  text-right p-2"><button class="btn btn-sm btn-danger" onclick="OSB_dm_delete(' + did + ',\'' + filename+ '\');">Delete</button></div>';
   
    data+='</div</div></div>'; 
  
  OSB_dm_modalBox(data, { width: "90%", oszindex: 205, pos: "50", data_class: ".delete-dl-div", osclose:true});  
}

OSB_dm_delete=function( did, filename ){
   var dDir=new android.File( OSB_dmo.folder,  "/DOWNLOADED");
   var df=new android.File( dDir, filename + ".txt");
   
 var dfile = new android.File( OSB_dmo.dl_to, filename);
// var delfile=$("#dl-from-device").is(":checked");
  var delfile= document.getElementById("dl-from-device").checked;
  
try{
    
  if(delfile && dfile.isFile() ) {
    dfile.delete();
  }
    
  if( df && df.isFile() ) df.delete();
    
}catch(e){
  return android.toast.show(e);
}
  document.getElementById("dld-container-" + did).remove();
  android.download.remove(did);
  OSB_dm_closeDelConfirm();
}

    
OSB_dm_openFile=function(filename){
  var dfile = new android.File( OSB_dmo.dl_to, filename);
 // dfile.share();
  android.toast.show('Open from your device: "/Downloads"');
}

var opened=function(){
  var elc=document.getElementById("OSB-dm");
  if(elc==null ) return false;
  else
  return !!( elc.offsetWidth || elc.offsetHeight || elc.getClientRects().length );
}

OSB_dm_close=function(close_modal){
 var em=document.querySelectorAll(".OSB_dm-modal-box");
  var len=em.length;

  if( len ){
   var elem=em[len-1];
   var on_close=elem.getAttribute("data-on-close");
if(!elem.classList.contains('no-cancel') ){
   OSB_dm_closeModalBox( elem.getAttribute("data-class") , on_close );
 }
  return;
}
 if( close_modal ) return;
  
  var elc=document.getElementById("OSB-dm");
  if( elc!=null) elc.style.display="none";
  
 for (var d in FAILED__) delete FAILED__[d];
   sessionStorage.removeItem("download_running");
  clearInterval(checkDownloadInt_);
}

  
return {
  download:download,
  downloads:downloads,
  running: getAllDownloading,
  checkStatus:checkDownloadSuccess,
  refreshStatusCheck: refreshDownloadsCheck,
  timeSince:timeSince,
  abbrNum:abbrNum,
  opened: opened,
  close: OSB_dm_close
 };
})()
  
  