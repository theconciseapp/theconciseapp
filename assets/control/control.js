//android.webView.setBackButtonLogic("none")
android.activity.setBackAction("none");
localStorage.removeItem("backup_running");

document.addEventListener("onBackPressed", function(){
 if(!localStorage.getItem("payment_page_opened") ){
  var curr_Id=+localStorage.getItem("drawerSelected")||0;
  android.activity.loadUrl("" + (curr_Id + 100), "javascript:onBackPressed();");
  return
 }

  android.activity.loadUrl("buy_pro", "javascript:onBackPressed();");
 
});

function exportTemplates(){
  
  var dir=new android.File( TEMPLATES_DIR);
    if(!dir.isDirectory() && !dir.mkdirs()) { 
  android.toast.show('Error creating Template directory');
    return false;
   }

  var tdir=new android.AssetFile("themes");
 
  if( !tdir.isDirectory()) return;
 
  var list=tdir.list();
  var total= list.length;
  
 for(var i=0;i<total;i++){
   var template=list[i];
  var f=new android.AssetFile( tdir, template );
  var f2=new android.File( dir, template );
 
   if(!f2.isDirectory() ) {
      f.copyTo( f2);
   }
  }
}

exportTemplates();