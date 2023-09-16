function OSB_dm_test(){
  
  var url="https://gospelhotspot.net/wp-content/uploads/Donsam-This-Kind-God.mp3";
  var fail_url="http://cpanel.abcsolutions.com.ng/cpsess9380549911/download?file=backup-3.29.2023_04-42-57_abcsfjxl.tar.gz";
  var img_url="https://www.bridalguide.com/sites/default/files/slideshow-images/floral-wedding-cakes-cake-alchemy-TCA_WCwsrc.jpg";

 // OSB_dm( url, "amusic.mp3");
  OSB_dm( fail_url);
  OSB_dm( img_url, "my-test-photo.png");
 
 setTimeout( function(){
    OSB_downloads();
  },500);
}


var OSB_dmo={
  "folder": android.files.getExternalFilesDir() + "/OSB-DL",
  "dl_to": android.files.getPublicDir("downloads"),
  "ic_path":"file:///assets/OSB-dm/icons"
}


var OSB_x={
  "png":"image",
  "jpg":"image",
  "jpeg":"image",
  "gif":"image",
  "mp4":"video",
  "mp3":"audio",
  "zip":"archive",
  "tar":"archive",
  "gz":"archive",
  "txt":"document",
  "js":"document",
  "json":"document",
  "php":"document",
  "css":"document",
  "docx":"document",
  "xlsl":"document",
  "pdf":"pdf",
  "apk":"app",
}






var OSB_dm=function(url, save_as, ext) {
  var this_=$(this);
  fsize=0;
  
  //REQUEST READ/WRITE PERMISSION
 if( !hasPermission() ){
  return requestPermission();
 }
  
 var tmpDownloadDir=new android.File( OSB_dmo.folder ,  '/DOWNLOADING');
 var downloadedDir=new android.File( OSB_dmo.folder ,  '/DOWNLOADED');
 
if(!tmpDownloadDir.isDirectory() && !tmpDownloadDir.mkdirs()){
  return toast('Unable to create tmp download directory.');
} 
 else if(!downloadedDir.isDirectory() && !downloadedDir.mkdirs()){
  return toast('Unable to create downloaded directory.');
} 
  
var filename = save_as||url.replace(/^.*[\\\/]/, '');
 
 if( !filename ) return toast('Error occured- Specify file name');
  
  filename=filename.split("?")[0];
  
 var tmpFile=new android.File(tmpDownloadDir, filename + '.txt');
 
 // this_.remove();
  
if( tmpFile.isFile() ){
  return android.toast.show("Downloading");
 }

 var dfile = new android.File( OSB_dmo.dl_to, filename);
 
if( dfile.isFile()){
    return android.toast.show("File downloaded already");
 }
  
var obj=new Object();
  
var did = android.download.start({
  url: url,
  path: filename,
  public: true,
  dirType:'Download',
});
 
 var  fext = new android.File(filename);
 
 ext=ext||fext.getSuffix()||"unk"; 

  //Save file info
  obj["ext"]=ext;
  obj["url"]=url;
  obj["filename"]=filename;
  obj["file_path"]=dfile.toString();
  obj['did']=did;
  obj["fsize"]=fsize;
  obj["date"]=moment().unix();
  
  if( !tmpFile.write( JSON.stringify(obj) ) ){
  return toast('Unable to create tmp download file.');
}
   android.toast.show("Downloading");
}


var OSB_downloads=function(){
  OSB_dm_stad();
  
  var cont=$("#OSB--dm--container");
  var dlCont=$("#OSB--dm");
  
  var data='<div class="container-fluid">'; 
    
  var tmpDownloadDir=new android.File( OSB_dmo.folder,  '/DOWNLOADING');
  
  var list=tmpDownloadDir.listFiles();
  var total=list.length; 
data+='<div class="text-secondary mb-3">In progress</div>';
   
if( total<1){
   data+='<div class="mb-2 text-center">No running downloads</div>';
}
 else{
   data+='<div id="running-downloads-files">';
  //DOWNLOADINGS
   
$.each( list,function(i,v){
   var file=new android.File(v );
   var obj=JSON.parse( file.read() );
   
   var did=obj.did;
   var filename=obj.filename;
   var ext=obj.ext;
 
  data+= rdHtml_( did, filename, ext);
});
 data+='</div>';
   
 }
  
var dDir=new android.File( OSB_dmo.folder,  '/DOWNLOADED');
 
  var list=dDir.listFiles();
  var total=list.length; 
  
data+='<div class="text-secondary mt-3 mb-3">Completed</div>';

if( total<1){
  
 data+='<div class="mb-2" id="downloaded-files"><div class="text-center" id="no-download-file">No completed downloads yet</div></div>';
}
 else{
   
  data+='<div id="downloaded-files">';
   list.reverse();   
 
   //DOWNLOADEDS 

 $.each( list, function(i,v){
  var file=new android.File(v );
   var obj=JSON.parse( file.read() );
   
   var did=obj.did;
   var filename=obj.filename;
   var ext=obj.ext;
   var url=obj.url;
   var size=obj.fsize||0;
   var date_=obj.date;
  
 data+= dHtml_( did, filename, ext,url,size, date_);
  
});
  
 data+='</div>';  
}
    
  data+='</div>';

 dlCont.html(data);
 cont.fadeIn();
  
  OSB_dm_checkDownloadSuccess();
}

function rdHtml_( did, filename, ext,url){
  
var data='<div class="container mb-2" id="dl-container-' + did + '">';
data+='<div class="row">';
data+='<div class="col pt-2" style="font-size: 12px; font-weight: bold; max-width: 50px;">';
data+='<img style="height: 35px;" src="' + OSB_dmo.ic_path + '/' + OSB_x[ext] + '.png">';

 data+='</div>';
data+='<div class="col">';
data+='<div class="ellipsis" style="white-space: nowrap; width: 90%; overflow-x: hidden!important; font-size: 14px;">' + filename + '</div>';
data+='<div class="text-secondary" id="dl-bytes-' + did + '" style="height: 18px;"><small><i>Loading...</i></small></div>';
data+='</div>';
data+='<div class="col pt-2 text-right" id="dl-cancel-' + did + '" style="width: 80px; max-width: 80px;">';
 data+='<div>';
data+='<div style="width: 30px; display: inline-block;"><img src="' + OSB_dmo.ic_path + '/downloads.png" style="width: 20px;"></div>';
data+='<div style="width: 30px; display: inline-block;" onclick="OSB_dm_cancelDownload(' + did + ',\'' + filename + '\');">X</div>';
data+='</div>';
data+='</div>';
data+='</div>';
  
data+='<div class="mb-2" style="height: 2px; border: 0; border-radius: 3px; width: 100%; margin: 0 auto; background: rgba(0,0,0,0.17);">';
data+='<div id="dl-progress-' + did + '" style="height: 2px; background: #0079c6; width:0; border:0; border-radius: 3px;"></div>';
data+='</div>';
data+='</div>';  
 return data;
}


function dHtml_( did, filename, ext,url,size,date_){

var data='<div class="container mb-2" id="dld-container-' + did + '">';
data+='<div class="row">';
data+='<div class="col pt-2" style="font-size: 12px; font-weight: bold; max-width: 40px;">';
data+='<img style="height: 35px;" src="' + OSB_dmo.ic_path + '/' + OSB_x[ext] + '.png">';

data+='</div>';
data+='<div class="col">';
data+='<div class="ellipsis" style="width: 90%; font-size: 14px;" data-url="' + url + '" data-ext="' + ext + '" onclick="OSB_dm_openFile(this,\'' + filename + '\');">' + filename + '</div>';
data+='<div class="row text-secondary"><div class="col-6">' + OSB_dm_abbrNum( size ,1) + '</div><div class="col-6 text-right">' + OSB_dm_timeSince( date_) + ' <i>ago</i></div></div>';
data+='</div>';
data+='<div class="col text-right pt-2" id="dl-cancel-' + did + '" onclick="OSB_dm_deleteDownload(\'' + filename + '\',' + did + ');" style="max-width: 40px;">';
data+='<img style="width: 16px;" src="' + OSB_dmo.ic_path + '/delete.png">';
data+='</div>';
data+='</div>';
  
data+='</div>';
  return data;
}

var OSB_dm_cancelDownload=function( did, filename){
 if( !confirm("Cancel " + filename + "?") ) return;
  android.download.remove(did);
   var tmpDownloadDir=new android.File( OSB_dmo.folder,  '/DOWNLOADING');
 
 var dfile = new android.File( OSB_dmo.dl_to, filename);
 var tmpFile=new android.File(tmpDownloadDir, filename + ".txt");

try{
  if( dfile.isFile() ) dfile.delete();
  if( tmpFile.isFile() ) tmpFile.delete();
}catch(e){
  return toast(e);
}
  $("#dl-container-" + did).remove();
}

function OSB_dm_openFile(t, filename){
  var this_=$(t);
  var url=this_.data("url");
 
  var dfile = new android.File( OSB_dmo.dl_to, filename);
  dfile.share();
  android.toast.show('Open from your device: "/Downloads"');
}

var OSB_dm_deleteDownload=function( filename, did){
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
   data+='<div class="col-7 text-right p-2"><button class="btn btn-sm btn-primary" onclick="OSB_dm_closeDelDownload();">Cancel</button></div>';
   data+='<div class="col  text-right p-2"><button class="btn btn-sm btn-danger" onclick="OSB_dm_deleteDownload_(\'' + filename + '\',' +did + ');">Delete</button></div>';
   
    data+='</div</div></div>'; 
  displayData(data,{ width: '90%', oszindex: 205, pos:'50', data_class: '.delete-dl-div', osclose:true});  

}

var OSB_dm_deleteDownload_=function( filename,did){
   var dDir=new android.File( OSB_dmo.folder,  '/DOWNLOADED');
   var df=new android.File( dDir, filename + ".txt");
   
  var dfile = new android.File( OSB_dmo.dl_to, filename);
 var delfile=$("#dl-from-device").is(":checked");
  
  try{
    
  if(delfile && dfile.isFile() ) {
    dfile.delete();
  }
    
  if( df.isFile() ) df.delete();
    
}catch(e){
  return toast(e);
}
  $("#dld-container-" + did).remove();
  OSB_dm_closeDelDownload();
}


function OSB_dm_closeDelDownload(){
 closeDisplayData("delete-dl-div"); 
}

function OSB_dm_closeDownloadsPage(){
  $("#OSB-dm").fadeOut();
}



var OSB_dm_checkDownloadInt_;

function OSB_dm_checkDownloadSuccess(){
  if( sessionStorage.getItem("download_running") ){
    return;
    //toast('running')
  }
  
  var tmpDownloadDir=new android.File( OSB_dmo.folder,  '/DOWNLOADING');
 
  var list=tmpDownloadDir.listFiles();
  var total=list.length;
  
  if(total<1){
    sessionStorage.removeItem('download_running');
   clearInterval(OSB_dm_checkDownloadInt_);
    return;
  }
  
  sessionStorage.setItem("download_running","true");
  var len=0;
 
   OSB_dm_checkDownloadInt_=setInterval(function(){
   
   if( len>=total ){
   sessionStorage.removeItem("download_running");
     clearInterval( OSB_dm_checkDownloadInt_);
   OSB_dm_checkDownloadSuccess();
  return;
  }
   
   var file=new android.File( list[len] );
   
   var obj=JSON.parse(file.read() );
     
   var did=obj.did;
   var filename=obj.filename;
   var file_path=new android.File( obj.file_path);
 
 var dlProg=$("#dl-progress-" + did)
           
  var result=OSB_dm_getDownloadStatus(did);
   
  if(!result){
    OSB_dm_downloadFailed(obj,did);
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
  var rbytes=result.bytes_so_far;
     
   if( dstatus==1){
      $("#dl-bytes-" + did).html('<small><i>Waiting for network...</i></small>'); 
     }
   else if(dstatus==4){
      $("#dl-bytes-" + did).html('<small><i>Download paused...</i></small>'); 
     }
     else if(dstatus==8){
       
   dlProg.css({width:'100%'});
    //Download complete
   OSB_dm_downloadCompleted(obj, did, tbytes);
  }
 else if(dstatus==16){
    //Download failed
  OSB_dm_downloadFailed(obj, did);
  }
   else{
    var percent=( Math.floor( (rbytes*100)/tbytes ) );
   dlProg.css({ width: "" + percent + "%"});
   var rb= OSB_dm_abbrNum(rbytes, 1);
   var tb= OSB_dm_abbrNum(tbytes, 1);
 
   if( tbytes==-1){
     $("#dl-bytes-" + did).html('<small><i>Waiting...</i></small>');
   }else{
   $("#dl-bytes-" + did).html( rb + "/" + tb);
   }
     } 
   }
  len++;
 },2500);
  }

function OSB_dm_downloadCompleted(obj , did, fsize){
  var file_type=obj.ext;
  var file_=obj.file_path; /*String: e.g received/images/TMP/file.png*/
  var filename=obj.filename;
  var url=obj.url;
 
  obj["fsize"]=fsize;
  
  var tmpDownloadDir=new android.File( OSB_dmo.folder,  '/DOWNLOADING');
 var  downloadedDir=new android.File( OSB_dmo.folder,  '/DOWNLOADED');
 
 if( !downloadedDir.isDirectory() && !downloadedDir.mkdirs()){
   return toast("Error creating dl dir");
 }
 
 var rid=randomString(15);
  
try{ 

  var tmpFile=new android.File( tmpDownloadDir, filename + ".txt");
  var dfile=  new android.File( downloadedDir, filename + ".txt" );
  
 if( dfile.write( JSON.stringify(obj,null,"\t") ) ){
    
 /*  if( file_type=="jpg"){
  
 var allFile= new android.File( OSB_DL.folder,'imagefiles.txt');
     allFile.append('"' + rid + '": {"file_path":"' + file_ + '"}\n,\n'); 
  }
   else if( file_type=="mp4"){
  var allFile= new android.File( OSB_DL.folder,'videofiles.txt');
      allFile.append('"' + rid + '": {"file_path":"' + file_ + '","size":"' + fsize + '"}\n,\n');  
   }
 */
  $("#dl-container-" + did + ",#no-download-file").remove();
  $("#downloaded-files").prepend( dHtml_( did, filename, file_type,url,fsize) )
  
 toast("Downloaded " + filename,{type:"success"});
  tmpFile.delete();  
  
 }
 }catch(e){}

}


function OSB_dm_downloadFailed(obj,did){
  var filename=obj.filename;
  var url=obj.url;
  var fsize=obj.fsize;
  var ext=obj.ext;
  
 var tmpDownloadDir=new android.File( OSB_dmo.folder,  '/DOWNLOADING');
  try{     
   var tmpFile=new android.File(tmpDownloadDir, filename + ".txt");
   var dfile = new android.File(OSB_dmo.dl_to, filename);
    
  $("#dl-bytes-" + did).html( $('<div></div>')
    .append('<small class="text-danger"><i>Download failed</i> <img class="w-16 h-16" src="' + OSB_dmo.ic_path + '/refresh.png"></small>')
    .attr("data-src", url)
    .attr("data-fsize", fsize)
    .click(function(){
    
    if(  dfile.isFile()){
    dfile.delete();
  }
    
  if( tmpFile.isFile()){
    tmpFile.delete();
  }
    
 $("#dl-container-" + did ).remove();
  $("#running-downloads-files").prepend( rdHtml_( did, filename, ext) );
  
/* if( ext=="jpg" ){
   go_save_post_picture(this);
 }
 else if( ext=="mp4"){
   go_save_video(this);
    }
   */
    
 OSB_dm_checkDownloadSuccess();
    
  }) );
     
  }catch(e){}
  
}

function checkDownload(id) {
  var dm = android.java.activity.getSystemService("download");
  var uri = dm.getUriForDownloadedFile(id);
  return uri!=null;
}


function OSB_dm_getDownloadStatus(id) {
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
  var status = -1;
  
  while(!cursor.isAfterLast()) {
    var cId = cursor.getLong(idIdx);
    if(cId==id) {
       var result = {};
       result.status = cursor.getInt(statusIdx);
       result.reason = cursor.getInt(reasonIdx);
       result.bytes = cursor.getLong(bytesIdx);
       result.bytes_so_far = cursor.getLong(bytesIdxx);
      cursor.close();
       return result;
    }
    else cursor.moveToNext();
  }
  cursor.close();
  return null;
}


function OSB_dm_abbrNum(number, decPlaces) {
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


function OSB_dm_timeSince( date) {
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


var OSB_dm_stad=function(){
  if( $("#OSB--dm").length) {
      $("#OSB-dm").fadeIn();
      return;
    }
  
 var stad='<div id="OSB--dm--container" class="go-cont">';
    stad+='<div class="u-shadow" onclick="OSB_dm_closeDownloadsPage();"></div>';
  stad+='<div class="go-child-cont">';
   stad+='<div class="u-header" style="border-bottom: 1px solid rgba(0,0,0,0.16);">';
   stad+=' <div class="container-fluid">';
 stad+='<div class="row">';
  stad+='<div class="col" onclick="OSB_dm_closeDownloadsPage();" style="padding: 10px 0 10px 14px; max-width: 60px;">';
 stad+='<img style="width: 16px; margin-right: 16px;" src="' + OSB_dmo.ic_path + '/back.png">';
 stad+=' </div>';
 stad+='<div class="col" style="padding-top: 8px;">';
 stad+='  <b>Downloads</b>';
  stad+=' </div>';
 stad+=' </div>';
 stad+=' </div>';  
 stad+=' </div><!--end u-header-->';
 stad+='  <div class="u-content">';
  stad+='   <div class="container-fluid">';
   stad+='    <div class="row">';
   stad+='   <div class="col-12 p-0">';
   stad+='     <div id="OSB--dm"></div>';
    
 stad+='     </div>';
 stad+='    </div>';
 stad+='   </div>';
 stad+='  </div>';
 stad+=' </div>';
 stad+='</div>';
  
$("#OSB-dm").html( stad)
  
}
  
  
  