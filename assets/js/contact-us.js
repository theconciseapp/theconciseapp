function contactForm(){
  var data='<div class="center-div bg-white">';
      data+='<div class="center-text-div" style="padding: 30px 16px 0 16px;">';
      data+='Click on any of the social platforms below to contact us directly if you have any question, suggestions or your experience about ' + APP_LABEL__;
      data+='<br><br><table class="table text-center"><tr>';
 if( whatsappLink){
    data+='<td><button class="btn btn-white-black" onclick="triggerWhatsapp();"><img src="file:///android_asset/images/button-icons/whatsapp-blue.png" style="width: 17px; height: 17px;"> Whatsapp</button></td>';
  }
 if( telegramLink ){
   data+='<td><button class="btn btn-white-black" onclick="triggerTelegram();"><img src="file:///android_asset/images/button-icons/telegram-blue.png" style="width: 17px; height: 17px;"> Telegram</button></td>';
 }
      data+='</tr></table>';
      data+='</div></div>';
    
   displayData( data, { no_cancel: true, osclose: false, data_id:"contact"});
   return
}


$(function(){
   $(".app-label").text( APP_LABEL__);
    if( telegramLink||whatsappLink ){
      contactForm();
    }
});
