function upgraded( bid){
if( PACKAGE_NAME.match(/\.pro/) ){
   return true;
 }
 return localStorage.getItem( "pro_activated");
}

   var env = new android.JavaObject("android.os.Environment");
   var externalDir= env.getExternalStorageDirectory().getAbsolutePath();
   var EXTERNAL_DIR=android.files.getExternalFilesDir();
   var INTERNAL_DIR=android.files.getFilesDir();
   var STORAGE_DIR= INTERNAL_DIR + "/main";
 // var STORAGE_DIR= EXTERNAL_DIR + "/main";
   var TEMP_DIR=    EXTERNAL_DIR + "/TEMP-DIR";
       
   var SCHOOL_DIR = EXTERNAL_DIR +  "/school";
   var CLASSES_DIR= STORAGE_DIR  +  "/classes";
   var PHOTO_DIR=   STORAGE_DIR +   "/photos";
   
   var TEMPLATES_DIR= EXTERNAL_DIR + "/templates";
   var AEFOLDER= EXTERNAL_DIR +  "/True attendance"; //Internal external dir (App's external dir)
   var EFOLDER= externalDir +  "/True attendance";

   var BACKUP_DIR=AEFOLDER + "/Backups";
 
var config={
   "pro": upgraded(),
   "pro_link": amazonProLink,
   "max_class": 4,
   "max_students": 20,
   "max_activity_field": 10,
   "max_activity_field_textlength": 200,
}

 var isPro=upgraded();
  var proPrice=0.99;
  var proDollarRate=750;
