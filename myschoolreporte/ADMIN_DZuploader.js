tt

  Dropzone.options.uploadWidget = {
  paramName: 'file',
  maxFilesize: 1, // MB
  maxFiles: 1,
  resizeWidth: 300,
  dictDefaultMessage: 'Upload logo',
  acceptedFiles: 'image/*',
  init: function() {
this.on("sending", function(file, xhr, formData) {

formData.append("csrf", CSRF__);
 });
  this.on('success', function(file, resp){
 if(resp.match(/__SUCCESS__/) ){
closeDisplayData('.upload_school_logo_form');
$('.school_avatar').attr('src',_SITE_URL_+'/schools/'+ _SCHOOL_ALIAS_ + '/photos/logo.jpg?t=' + randomString(10) );
toast('Successfully uploaded.',{type:'success',pos:'50'});

Dropzone.forElement('#upload-widget').removeAllFiles(true);

   }
else{
 toast('Could not upload any image at the moment.');

}
 });

  }
};


Dropzone.options.uploadProprietorPhotoWidget = {
  paramName: 'file',
  maxFilesize: 1, // MB
  maxFiles: 1,
  resizeWidth: 150,
  dictDefaultMessage: 'Upload photo',
  acceptedFiles: 'image/*',
  init: function() {
this.on("sending", function(file, xhr, formData) {

formData.append("csrf", CSRF__);
 });
  this.on('success', function(file, resp){
 if(resp.match(/__SUCCESS__/) ){
closeDisplayData('.upload_proprietor_photo_form');
$('.proprietor_avatar').attr('src',_SITE_URL_+'/schools/'+ _SCHOOL_ALIAS_ + '/photos/proprietor.jpg?t=' + randomString(10) );
toast('Successfully uploaded.',{type:'success',pos:'50'});

Dropzone.forElement('#upload-proprietor-photo-widget').removeAllFiles(true);

   }
else{
 toast('Could not upload any image at the moment.');

}
 });

  }
};


Dropzone.options.uploadTeacherPhotoWidget = {
  paramName: 'file',
  maxFilesize: 1, // MB
  maxFiles: 1,
  resizeWidth: 150,
  dictDefaultMessage: 'Upload photo',
  acceptedFiles: 'image/*',
  init: function() {

this.on("sending", function(file, xhr, formData) {

   var id=$('.teacher_photo_id').val();
formData.append("teacher_username",id);
formData.append("csrf",CSRF__);
 });
  this.on('success', function(file, resp){
 var id=$('.teacher_photo_id').val();
 if(resp.match(/__SUCCESS__/) ){
closeDisplayData('.upload_teacher_photo_form');
$('.teacher_photo_' + id).attr('src',_SITE_URL_+'/schools/'+ _SCHOOL_ALIAS_ + '/' + id + '/' + id + '.jpg?t=' + randomString(10) );

toast('Successfully uploaded.',{type:'success',pos:'50'});

//Dropzone.forElement('#upload-teacher-photo-widget').removeAllFiles(true);
 }else{
 toast('Could not upload any image at the moment.');

}

 });

  }
};


$(function(){
$('body').on('click','.upload_school_logo',function(){
 var d=$(this);
 var id=d.data('id');

if(ISDEMO__) return toast('This is a demo.');
close_school_avatar();

var data='<div class="center_div upload_school_logo_form" style="background:#fff;">';


data+='<div class="center_header"></div>';
data+=' <div class="center_text_div">';
 data+='<div class="dropzone text-center" id="upload-widget">';
data+='<div class="dz-message">';
data+='<div class="col-xs-12"><div class="message"> <p>Upload school logo</p>';

   data+='</div>';
   data+='</div>';
   data+='</div>';
   data+='<div class="fallback">';
   data+='<input class="d-none" type="file" name="file" /> <div class="warning">Sorry, your browser is not supported!</div>';
   data+='</div>';
   data+='</div></div></div>';

 displayData(data,{ data_class:'.upload_school_logo_form',osclose:true,oszindex:'500' });

var myDropzone = new Dropzone("div#upload-widget", { url: "AJAX-PHP/upload_school_logo.php"});

 });

$('body').on('click','.upload_proprietor_photo',function(){
 var d=$(this);
 var id=d.data('id');

if(ISDEMO__) return toast('This is a demo.');

var data='<div class="center_div upload_proprietor_photo_form" style="background:#fff;">';
data+='<div class="center_header"></div>';
data+=' <div class="center_text_div"> <div class="dropzone text-center" id="upload-proprietor-photo-widget"> <div class="dz-message">';
data+='<div class="col-xs-12"><div class="message"> <p>Upload proprietor\'s photo</p>';

   data+='</div>';
   data+='</div>';
   data+='</div>';
   data+='<div class="fallback">';
   data+='<input class="d-none" type="file" name="file" /> <div class="warning">Sorry, your browser is not supported!</div>';
   data+='</div>';
   data+='</div></div></div>';

 displayData(data,{data_class:'.upload_proprietor_photo_form',osclose:true,oszindex:'500'});

var myDropzone = new Dropzone("div#upload-proprietor-photo-widget", { url: "AJAX-PHP/upload_proprietor_photo.php"});
 });

$('body').on('click','.upload_teacher_photo',function(){

if(ISDEMO__) return toast('This is a demo.');
 var d=$(this);
 var id=d.data('id');

var data='<div class="center_div upload_teacher_photo_form" style="background:#fff;">';
data+='<div class="center_header"><input type="hidden" class="teacher_photo_id" value="' + id + '"></div>';
data+=' <div class="center_text_div"> <div class="dropzone text-center" id="upload-teacher-photo-widget"> <div class="dz-message">';
data+='<div class="col-xs-12"><div class="message"> <p>Upload Photo</p>';

   data+='</div>';
   data+='</div>';
   data+='</div>';
   data+='<div class="fallback">';
   data+='<input class="d-none" type="file" name="file" /> <div class="warning">Sorry, your browser is not supported!</div>';
   data+='</div>';
   data+='</div></div></div>';

 displayData(data,{data_class:'.upload_teacher_photo_form',osclose:true,oszindex:'500'});

var myDropzone = new Dropzone("div#upload-teacher-photo-widget", { url: "AJAX-PHP/upload_teacher_photo.php"});


 });


});








