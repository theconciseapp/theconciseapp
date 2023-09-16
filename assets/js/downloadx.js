function go_save_post_picture(t) {
  var this_=$(t);
  var url=this_.data('src');
  var fsize=this_.data('fsize');
 // var url=$('#go-full-photo-div img.go-full-photo').attr('src');
 
 if( !hasPermission( rights) ){
  return requestPermission(rights);
 }
  
 var tmpDownloadDir=new android.File( GO_FOLDER,  '/DOWNLOADING');
 
if(!tmpDownloadDir.isDirectory() && !tmpDownloadDir.mkdirs()){
  return toast('Unable to create tmp download directory.');
} 
  

var filename = url.replace(/^.*[\\\/]/, '');
  if(!filename) return toast('Error occured');
  filename=filename.split("?")[0];
  
 var tmpFile=new android.File(tmpDownloadDir, filename + '.txt');
 
  this_.remove();
  
  if( tmpFile.isFile() ){
    return android.toast.show("Downloading");
  }

 var dfile = new android.File( android.files.getPublicDir("downloads"), filename);
 
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
  obj["ext"]="jpg";
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


function go_save_video(t) {
  var this_=$(t);
  var url= this_.data('src');
  var fsize= this_.data('fsize');
  
 if(!hasPermission(rights) ){
  return requestPermission(rights);
 }

var tmpDownloadDir=new android.File( GO_FOLDER,  '/DOWNLOADING');
 
if(!tmpDownloadDir.isDirectory() && !tmpDownloadDir.mkdirs()){
  return toast('Unable to create tmp download directory');
} 

  
  var filename = url.replace(/^.*[\\\/]/, '');
  if(!filename) return toast('Error occured');
  filename=filename.split("?")[0];
  
 var tmpFile=new android.File(tmpDownloadDir, filename + ".txt");

  this_.remove();
 
  if( tmpFile.isFile()){
    return android.toast.show("File is downloading or downloaded");
  }

 // this_.prop('disabled', true);
var dfile = new android.File( android.files.getPublicDir("downloads"), filename);
 
  if( dfile.isFile()){
    return android.toast.show("File downloaded already");
 }
  
  var obj=new Object();
  
  var did = android.download.start({
  url: url,
  path: filename,
  public: true,
  dirType:'Download'
 });
  
  obj["ext"]="mp4";
  obj["filename"]=filename;
  obj["url"]=url;
  obj["file_path"]=dfile.toString();
  obj['did']=did;
  obj["date"]=moment().unix();
  obj["fsize"]=fsize;
 
  if( !tmpFile.write( JSON.stringify(obj) ) ){
  return toast('Unable to create tmp download file.');
}
   android.toast.show("Downloading");
}

function openDownloads(){
  var cont=$("#go-downloads-container");
  var dlCont=$("#go-running-downloads");
  
  var data='<div class="container-fluid">'; 
    
  var tmpDownloadDir=new android.File( GO_FOLDER,  '/DOWNLOADING');
  
  var list=tmpDownloadDir.listFiles();
  var total=list.length; 
data+='<div class="text-secondary mb-3">In progress</div>';
   
if( total<1){
   data+='<div class="mb-2 text-center">No running downloads</div>';
}
 else{
   data+='<div id="running-downloads-files">';
   
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
  
var dDir=new android.File( GO_FOLDER,  '/DOWNLOADED');
 
  var list=dDir.listFiles();
  var total=list.length; 
  
data+='<div class="text-secondary mt-3 mb-3">Completed</div>';

if( total<1){
  
 data+='<div class="mb-2" id="downloaded-files"><div class="text-center" id="no-download-file">No completed downloads yet</div></div>';
}
 else{
   
  data+='<div id="downloaded-files">';
   list.reverse();   
   
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
  
  checkDownloadSuccess();
 
}

function rdHtml_( did, filename, ext,url){
  
var data='<div class="container mb-2" id="dl-container-' + did + '">';
data+='<div class="row">';
data+='<div class="col pt-2" style="font-size: 12px; font-weight: bold; max-width: 50px;">';
data+='<img class="w-16 h-16" src="file:///assets/go-icons/dl-' + ext + '.png">';

 data+='</div>';
data+='<div class="col">';
data+='<div class="ellipsis" style="white-space: nowrap; width: 90%; overflow-x: hidden!important; font-size: 14px;">' + filename + '</div>';
data+='<div class="text-secondary" id="dl-bytes-' + did + '" style="height: 18px;"><small><i>Loading...</i></small></div>';
data+='</div>';
data+='<div class="col pt-2 text-right" id="dl-cancel-' + did + '" onclick="cancelDownload(' + did + ',\'' + filename + '\');" style="max-width: 40px;">';
 data+='X';
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
data+='<img class="w-16 h-16" src="file:///android_asset/go-icons/dl-' + ext + '.png">';

data+='</div>';
data+='<div class="col">';
data+='<div class="ellipsis" style="width: 90%; font-size: 14px;" data-url="' + url + '" data-ext="' + ext + '" onclick="openDownloadedFile(this,\'' + filename + '\');">' + filename + '</div>';
data+='<div class="row text-secondary"><div class="col-6">' + abbrNum( size ,1) + '</div><div class="col-6 text-right">' + timeSince( date_) + ' <i>ago</i></div></div>';
data+='</div>';
data+='<div class="col text-right pt-2" id="dl-cancel-' + did + '" onclick="deleteDownload(\'' + filename + '\',' + did + ');" style="max-width: 40px;">';
data+='<img class="w-16 h-16" src="file:///android_asset/go-icons/delete.png">';
data+='</div>';
data+='</div>';
  
data+='</div>';
  return data;
}

function cancelDownload( did, filename){
  android.download.remove(did);
   var tmpDownloadDir=new android.File( GO_FOLDER,  '/DOWNLOADING');
 
 var dfile = new android.File( android.files.getPublicDir("downloads"), filename);
 var tmpFile=new android.File(tmpDownloadDir, filename + ".txt");
try{
  if( dfile.isFile() ) dfile.delete();
  if( tmpFile.isFile() ) tmpFile.delete();
}catch(e){
  return toast(e);
}
  $("#dl-container-" + did).remove();
}

function openDownloadedFile(t, filename){
  var this_=$(t);
  var url=this_.data("url");
  //alert(url)
  var dfile = new android.File( android.files.getPublicDir("downloads"), filename);
  dfile.share();
  android.toast.show('Open from your device: "/Downloads"');
}

function deleteDownload( filename, did){
var data='<div class="center_text_div text-left bg-white" style="border-radius: 5px; width:100%; font-size: 14px; font-weight: bold; padding: 8px 15px;">';
     data+='<div class="mt-3 mb-3 text-secondary">Delete ' + filename + '</div>';
   
  data+='<div class="custom-control custom-checkbox mb-3">';
   data+='<input type="checkbox" class="custom-control-input" id="dl-from-device">';
   data+='<label class="custom-control-label" for="dl-from-device">';
   data+='<span style="display: inline-block; font-size: 13px;"> Remove from device</span>';
   data+='</label>';
  data+='</div>';
  
  
  data+='<div class="container mb-3">';
  data+='<div class="row">';
   data+='<div class="col-7 text-right p-2"><button class="btn btn-sm btn-primary" onclick="closeDelDownload();">Cancel</button></div>';
   data+='<div class="col  text-right p-2"><button class="btn btn-sm btn-danger" onclick="deleteDownload_(\'' + filename + '\',' +did + ');">Delete</button></div>';
   
    data+='</div</div></div>'; 
  displayData(data,{ width: '90%', oszindex: 205, pos:'50', data_class: '.delete-dl-div', osclose:true});  

}

function deleteDownload_( filename,did){
   var dDir=new android.File( GO_FOLDER,  '/DOWNLOADED');
   var df=new android.File( dDir, filename + ".txt");
   
  var dfile = new android.File( android.files.getPublicDir("downloads"), filename);
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
  closeDelDownload();
}


function closeDelDownload(){
 closeDisplayData(".delete-dl-div"); 
}

function closeDownloadsPage(){
  $("#go-downloads-container").fadeOut();
}



var checkDownloadInt_;

function checkDownloadSuccess(){
  if( sessionStorage.getItem("download_running") ){
    return;
    //toast('running')
  }
  
  var tmpDownloadDir=new android.File( GO_FOLDER,  '/DOWNLOADING');
 
  var list=tmpDownloadDir.listFiles();
  var total=list.length;
  
  if(total<1){
    sessionStorage.removeItem('download_running');
   clearInterval(checkDownloadInt_);
    return;
  }
  
  sessionStorage.setItem('download_running','true');
  var len=0;
 
   checkDownloadInt_=setInterval(function(){
   
   if( len>=total ){
   sessionStorage.removeItem('download_running');
     clearInterval( checkDownloadInt_);
   checkDownloadSuccess();
  return;
  }
   
   var file=new android.File( list[len] );
   
   var obj=JSON.parse(file.read() );
     
   var did=obj.did;
   var filename=obj.filename;
   var file_path=new android.File( obj.file_path);
 
 var dlProg=$("#dl-progress-" + did)
           
  var result=getDownloadStatus(did);
   
  if(!result){
    downloadFailed(obj,did);
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
   downloadCompleted(obj, did, tbytes);
  }
 else if(dstatus==16){
    //Download failed
  downloadFailed(obj, did);
  }
   else{
    var percent=( Math.floor( (rbytes*100)/tbytes ) );
   dlProg.css({ width: "" + percent + "%"});
   var rb= abbrNum(rbytes, 1);
   var tb= abbrNum(tbytes, 1);
 
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

function downloadCompleted(obj , did, fsize){
  var file_type=obj.ext;
  var file_=obj.file_path; /*String: e.g received/images/TMP/file.png*/
  var filename=obj.filename;
  var url=obj.url;
 
  obj["fsize"]=fsize;
  
  var tmpDownloadDir=new android.File( GO_FOLDER,  '/DOWNLOADING');
 var  downloadedDir=new android.File( GO_FOLDER,  '/DOWNLOADED');
 
 if( !downloadedDir.isDirectory() && !downloadedDir.mkdirs()){
   return toast("Error creating dl dir");
 }
 
 var rid=randomString(15);
  
try{ 

  var tmpFile=new android.File( tmpDownloadDir, filename + ".txt");
  var dfile=  new android.File( downloadedDir, filename + ".txt" );
  
 if( dfile.write( JSON.stringify(obj,null,"\t") ) ){
    
   if( file_type=="jpg"){
  
 var allFile= new android.File( GO_FOLDER,'imagefiles.txt');
     allFile.append('"' + rid + '": {"file_path":"' + file_ + '"}\n,\n'); 
  }
   else if( file_type=="mp4"){
  var allFile= new android.File( GO_FOLDER,'videofiles.txt');
      allFile.append('"' + rid + '": {"file_path":"' + file_ + '","size":"' + fsize + '"}\n,\n');  
   }
 
  $("#dl-container-" + did + ",#no-download-file").remove();
  $("#downloaded-files").prepend( dHtml_( did, filename, file_type,url,fsize) )
  
 toast("Downloaded " + filename,{type:"success"});
  tmpFile.delete();  
  
 }
 }catch(e){}

}


function downloadFailed(obj,did){
  var filename=obj.filename;
  var url=obj.url;
  var fsize=obj.fsize;
  var ext=obj.ext;
  
 var tmpDownloadDir=new android.File( GO_FOLDER,  '/DOWNLOADING');
  try{     
   var tmpFile=new android.File(tmpDownloadDir, filename + ".txt");
   var dfile = new android.File( android.files.getPublicDir("downloads"), filename);
    
  $("#dl-bytes-" + did).html( $('<div></div>')
    .append('<small class="text-danger"><i>Download failed</i> <img class="w-16 h-16" src="file:///android_asset/go-icons/refresh.png"></small>')
    .attr("data-src", url)
    .attr("data-fsize", fsize)
    .click(function(){
    
    if(dfile.isFile()){
    dfile.delete();
  }
    
  if( tmpFile.isFile()){
    tmpFile.delete();
  }
    
 $("#dl-container-" + did ).remove();
  $("#running-downloads-files").prepend( rdHtml_( did, filename, ext) );
  
 if( ext=="jpg" ){
   go_save_post_picture(this);
 }
 else if( ext=="mp4"){
   go_save_video(this);
    }
    
 checkDownloadSuccess();
    
  }) );
     
  }catch(e){}
  
}
