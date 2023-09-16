function loadBackupDetails(){
   var last_bk=localStorage.getItem("last_backup")||"";
 
  if( last_bk){
    $('.lb-date').html( last_bk);
   $("#backup-to-email").removeClass("d-none");
  }
}



$(function(){
  loadBackupDetails();
   
  $('#delBackup').click(function(){

    var bfile=$('.select_bfiles').val();
  var file=new android.File(bfile);
    if (!confirm('Are you sure you want to delete selected backup file?') ) return false;
  if ( file.delete() ){
  toast('Deleted successfully!',{type:'success'});
   backUp();
}

  });

}); 
 


function restoreFD(file, element, silent){
 
 if(!silent){
   if( !confirm('Are you sure you want to restore this backup?') ) return;
 }
   
   var d=$(element);
  var t=$('.rfd-text');

  
 function dis(d_){
   d_.attr('disabled','disabled');
 }
  function ena(d_){
   d_.removeAttr('disabled');
    $('.rfd-text').text('Select from device');
  //android.control.dispatchEvent('unlock_toolbar_after_restore',null);
if(!silent) android.control.execute("unlockDrawer()")

}

  t.text('Checking file...');
   dis(d);
  
 setTimeout(function(){
   
   if(!file.isFile() ){
    ena(d);
  if(!silent) toast('Backup not found.');
     return;
  }
     
  // android.control.dispatchEvent('lock_toolbar_during_restore',null);
 if(!silent) android.control.execute("lockDrawer()")
 
   t.text('Processing...');            
   var restoreTo=new android.File(STORAGE_DIR);

 if( !restoreTo.isDirectory() && !restoreTo.mkdirs()){
  if(!silent) toast("Could not create storage Dir");
     return;
 }
 setTimeout( function(){
  
   t.text('Restoring...');
 
 setTimeout(function(){
   
   file.unzip(restoreTo,function( detail){
    if(!silent){
      var tmp_dir=file.getParent();
      try{
        tmp_dir.deleteFileOrFolder();
      }catch(e){}
    }
   if(detail.error) {
     ena(d);
  if(!silent)   toast('Failed to restore. ERR: 4');
    return;
   }
  if(!silent) toast('Restored successfully.',{type:'success','pos': 50,'hide': 8000});
 ena(d);
   });
  },1000);
 },1000);
 },1000);     
 }
     
function findBackUp(){
  //Used on first launch of app

    if( API_LEVEL>28) return;
  
  var BACKUP_DIR=EFOLDER + "/Backups";
  var dir=new android.File( BACKUP_DIR);
  
if( !dir.isDirectory() && !dir.mkdirs()){
  return; //Silent
}
  
 var file=new android.File( dir, "true.backup.zip");
  if( !file.isFile()) return;
  restoreFD(file,"#null", true);
  
}

  
function shareBackup(){
  if(API_LEVEL<29){
    var BACKUP_DIR=EFOLDER + "/Backups";
  }
   var bkfile=new android.File( BACKUP_DIR, "true.backup.zip");  
 if(!bkfile.isFile()){
      return toast("No backup found")
   }
  android.control.execute("share_fileAppExt('" + bkfile.toString() + "')");
 
}
    

function startBackup(auto, loudSuccess){
  if( localStorage.getItem("backup_running") ){
    return;
  }
 else if ( !hasPermission() ){
  return requestPermission();
 }
   
 if( API_LEVEL<29){
   var BACKUP_DIR=EFOLDER + "/Backups";
 }
  
 var dir=new android.File( BACKUP_DIR);
  
   
if( !dir.isDirectory() && !dir.mkdirs()){
  return toast("Backup directory failed");
}
  
 var to_=new android.File( dir, "true.backup.zip");
  
  var cont= $('.backup-loading');
  
  cont.html('<h2 style="color: green;">Backing up...</h3>').show('slow');
 
  var folder=new android.File(STORAGE_DIR);
 
  localStorage.setItem("backup_running","true");
  
 folder.zip(to_,function(detail){
  localStorage.removeItem("backup_running");
   
    if (!detail.error){
 var file=new android.File(to_);
     cont.html('<h2 style="color: green;">Backup Successful!</h3>').show('slow');
     var last_bk=moment().format("DD-MMMM-YYYY hh:mma");
     
   $('.lb-date').html( last_bk);
    localStorage.setItem("last_backup", last_bk);
  $("#backup-to-email").removeClass("d-none");
  $('#restore').show('slow');
  $('.lb-date').html( last_bk);
      
   if(!loudSuccess) return; 

 if ( confirm( ( auto?"Automatic ":"") + "Backup successful!\n\nImportant info:\nKeep backup file in your email address or Dropbox or Google drive now or elsewhere. You might consider changing your device in future, you will need this file to restore backup.\n\nWould you keep now?")){
  shareBackup();
  return;
}
   }
   
 else{
   alert('Backup error occurred! ' + detail.error);
}
   
});

 }
    
    
    
function importBackup(callback){
 $('.android_toast').fadeOut();
 
  if ( !hasPermission() ){
  return requestPermission();
 }
  
 android.control.execute("importBackup()")
  
  /*
  var intent={
    action:"android.intent.action.GET_CONTENT"
        , type:'application/zip'
  }
  android.activity.startActivityForResult(intent,function(r){ 
   var token=randomString(5);
    $('.import_token').text(token);
    localStorage.setItem('import_token',token);
    //var resolver = android.java.activity.getContentResolver();
   // var stream = resolver.openInputStream(r.data.data);  
 
  },true);
  */
  
  
}   
    
document.addEventListener("importBackupCompleted",function(evt){
  var wid = +android.webView.getId();
   var curr_Id=+localStorage.getItem("drawerSelected")||0
    curr_Id=curr_Id+100;
  
  if( curr_Id!==wid) return;
    
  var fpaths=evt.detail.file_paths;
  
  if( fpaths.length<1){
    return toast('Not supported.');
  }
  
  var backup=new android.File( fpaths[0] );

  restoreFD(backup,'#restore_fd');
  
});

    
    
