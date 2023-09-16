function importTheme_( theme,element){
  
  var d=$(element);
  var t=$('.rfd-text');
  
 function dis(d_){
   d_.attr('disabled','disabled');
 }
  function ena(d_){
   d_.removeAttr('disabled');
    $('.rfd-text').text('Select from device');
 }
 
 t.text('Checking file...');
    dis(d);
 setTimeout(function(){
   
   if( !theme.isFile() ){
    ena(d);
     return toast('File not found.');
  }
 
   t.text('Installing...');

 setTimeout(function(){ 
   
   var importTo=new android.File( TEMPLATES_DIR);
    
   theme.unzip( importTo,function(e){
  
   var tmp_dir=new android.File( TEMP_DIR);
   
      try{
        tmp_dir.deleteFileOrFolder();
      }catch(e){ alert(e); }
     if(e.error){
        ena(d)
     return toast("Failed to install. " +JSON.stringify(err) );
   }
    
  showTemplates();   
     
  toast('Installed successfully.',{ hide:8000, type:'success'});     
     ena(d);
     
    });  
   
 },1000);
   
 },1000);
       
 };
     
  
    
function importTheme(){
    android.control.execute("importTheme()")
  /*
  $('.android_toast').fadeOut();
  var intent={
    action:"android.intent.action.GET_CONTENT"
        , type:'application/zip'
  }
  android.activity.startActivityForResult(intent,function(r){ 
;
  },true);
  */
 }   
    
  

document.addEventListener("importThemeCompleted", function(evt){
   var wid = +android.webView.getId();
   var curr_Id=+localStorage.getItem("drawerSelected")||0
    curr_Id=curr_Id+100;
  
  if( curr_Id!==wid) return;
    
  var fpaths=evt.detail.file_paths;
  
  if( fpaths.length<1){
    return toast('Not supported.');
  }
  
  var theme=new android.File( fpaths[0] );
 
  importTheme_(theme,'#import-theme');
  
});



