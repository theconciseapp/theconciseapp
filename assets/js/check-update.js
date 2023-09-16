function updateGame(type,link){
  type=type?type.toLowerCase():'';
  if(!type) return '';
  var packageName="com.amazon.venezia";
 
  if(type=='whatsapp') packageName='com.whatsapp';
  
 try{ //var contentUri = android.files.toFile(to_).getContentUri();
   var pm = android.java.activity.getPackageManager();
  var ai = pm.getApplicationInfo(packageName, 0);
    if(ai) { 
      location.href=link;  
      return false; 
        }
 }catch(err){
  alert('Sorry! You do not have ' + type.toUpperCase() + ' app installed on your device.');
    }
 
   if(type!='amazon') location.href=link;
}


function checkUpdate_( data_){
 var r=new RegExp('{.*}','g');
 var appstores=data_.match(r);

 var data=data_.replace(new RegExp('{.*}\n?','g'),'');
  data=data.trim().split('\n');
   
 var v_=( data[0]||"").split("|");
 var v=+$.trim( v_[0] )
 var enforce=v_[1]||false;
  
 if( enforce){
   localStorage.setItem("last_update_check_result", data_);   
 }
  else{
    localStorage.removeItem("last_update_check_result");
    closeDisplayData("update-info-check");
  }
  
 if (v==(+APP_VERSION) || (+APP_VERSION)>v ){
  toast('Your ' + APP_LABEL__ + ' is up to date!',{type:'success',pos: 80});
  localStorage.removeItem("last_update_check_result");
   closeDisplayData("update-info-check");
   return false;
 }
   
  var note=data.slice(1);
  var mdata='';
   
 for( var nv=0;nv<note.length;nv++){
   mdata+='<br>' + note[nv];
  }

 var btn='<div style="width:100%; text-align: center;">';
 
 if( appstores){
   for(var x=0; x<appstores.length;x++){
   var bd=appstores[x].replace(/({|})/g,'');
   bd=bd.split('|');
   var storeName=bd[0];
   var storeLink=bd[1];
 btn+='<button class="btn btn-sm btn-success" style="text-transform: capitalize;" onclick="updateGame(\'' + storeName + '\',\'' + storeLink + '\');"><img src="file:///android_asset/images/button-icons/' + storeName + '.png"> ' + storeName + '</button>';
 }
}
 btn+='</div>';
   
 var sdata='<div class="center-div bg-white" style="max-width: 500px; font-size:90%;">';
      sdata+='<div class="center-header text-center" style="font-family: coolparty">';
   // sdata+='<img src="file:///android_asset/images/bg/close.png" style="position: absolute; left: -5px; top:-9px; height: 40px; width: 40px;" onclick="closeDisplayData(\'.update_info\');">';
      sdata+='UPDATE ' + APP_LABEL__.toUpperCase() + '</div>';
      sdata+='<div class="center-text-div" style="width:100%; padding: 0px 15px 10px 10px;">';
      sdata+=btn;
      sdata+=mdata;
    //  sdata+='<div class="text-center"><br>Click on any of the buttons above to update</div>';
   
      sdata+='</div></div>';
  if(enforce){
    displayData(sdata,{ oszindex: 1000, no_cancel: true, data_id:'update-info-check'});
  }
  else{
    displayData(sdata,{ oszindex: 1000, osclose:true, data_id:'update-info-check'})
  }
}
   


function checkForUpdate(n){   
 var tomorrow=moment(new Date()).add(3,'days').unix();
 var currentTime=moment().unix();
  
 var lu= localStorage.getItem("last_update_check_result");   

  if( lu){
     checkUpdate_( lu);
  }
  
var uc=+localStorage.getItem('update_check')||1;
 if(n) uc=1;
 if (currentTime<uc) return false;
  localStorage.setItem('update_check',tomorrow);
  
  /* 
  var dl=$("#download-levels");
      dl.click();
  */
 var chkimg= $('#checking_update_img');
 
  setTimeout( function(){
    
 $.get( check_update_url, function(data,status){
  if(  status!='success'|| !data){
    $('#checking_update_img,#check_update_img').toggle();
    toast('Couldn\'t check for update right now');
    return false;
  }
  
    checkUpdate_( data);
     
 }).done(function(){
    chkimg.hide();
    $('#check_update_img').show();
 }) .fail(function(){
    chkimg.hide();
    $('#check_update_img').show();
  //  toast('Check your internet connection');
 });
    
  },10000);    
    
    
  }
       
       
$(function(){
  checkForUpdate();
  $('body').on('click','.check_update_btn',function(){
 checkForUpdate(1);    
 $('#checking_update_img,#check_update_img').toggle();
   });
 });
       