Dropzone.options.uploadStudentPhotoWidget = {
  paramName: 'file',
  maxFilesize: 3, // MB
  maxFiles: 1,
  resizeWidth: 150,
  dictDefaultMessage: 'Upload photo',
  acceptedFiles: 'image/*',
  init: function() {
var id=$('.student_photo_id').val();
 
this.on("sending", function(file, xhr, formData) {

formData.append("student_id",id);
formData.append("x-csrf-token",document.querySelectorAll('meta[name=csrf-token]')[0].getAttributeNode('content').value);
 });
  this.on('success', function(file, resp){
 if(resp.match(/__TOO_LARGE__/)){
 return toast('Photo too large');
}else
 if(resp.match(/__SUCCESS__/) ){
closeDisplayData('.upload_student_photo_form');
  
$('.student_avatar_' + id).attr('src',student_photo_url(id));

toast('Successfully uploaded.',{type:'success',pos:'50'});

 }else{
 toast('Could not upload any image at the moment.');

}
 });

  }
};

$(function(){
$('body').on('click','.upload_student_photo',function(){

 if(ISDEMO__) return toast('This is a demo.');

 var d=$(this);
 var id=d.data('id');
 
var data='<div class="center_div upload_student_photo_form" style="background:#fff;">';
data+='<div class="center_header"><input type="hidden" class="student_photo_id" value="' + id + '"></div>';
data+=' <div class="center_text_div"> <div class="dropzone text-center" id="upload-student-photo-widget"> <div class="dz-message">';
data+='<div class="col-xs-8"><div class="message"> <p><i class="fa fa-image"></i> Upload Photo</p>';

   data+='</div>';
   data+='</div>';
   data+='</div>';
   data+='<div class="fallback">';
   data+='<div class="alert alert-danger"><i class="fa fa-frown-o"></i> Sorry, this browser isn\'t supported.</div>';
   data+='</div>';
   data+='</div></div></div>';

 displayData(data,{data_class:'.upload_student_photo_form',osclose:true,oszindex:'500'});

var myDropzone = new Dropzone("div#upload-student-photo-widget", { url: _SITE_URL_ + "/admin/AJAX-PHP/upload_student_photo.php"});
 });


});



