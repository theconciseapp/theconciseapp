var schoolname=localStorage.getItem('companyname');

  var companyn=companyname.toUpperCase();
  var cLogo='<div style="font-weight:bold; font-size: 16px; border:0; border-radius: 100%; width: 20px; height:20px; background:#3c763d; color:#fff; text-align: center; padding-top: 2px;" class="company_logo_t">' + companyn.substr(0,1) + '</div>';
  var amazon_icon='';     
  var company_logo=new android.File(externalDir,'My-school-attendance/my-school-logo.txt');
  if(company_logo.isFile()) cLogo='<img src="' + safeToSave(company_logo.read() ) + '" style="width: 50px; height: 50px;" class="company_logo">';


function showMonthlyReport(id){
 $('.export_csv').show();
 var class_selected=localStorage.getItem('class_selected');
 var eclass_selected=class_selected? class_selected.replace(/_/g,' '):'';

  var this_month=conciseDate('month');
  var this_year=conciseDate('year');

   var month=$('.mmonth').val();
   var year=$('.myear').val();

 if(!month) month=this_month;
 if(!year) year=this_year;
  var mName=getMonthName(month);
 
 var semesterEnabled=localStorage.getItem('semesterEnabled') ? true : false;
  var semester=conciseDate('semester');
  var session=conciseDate('session');
  var this_semester=conciseDate('this_semester');
  var this_session=conciseDate('this_session');

      var show_late=localStorage.getItem('show_late');
      var show_photo=localStorage.getItem('show_photo');

  var show_late=show_late? show_late : 'YES';
  var show_photo=show_photo? show_photo : 'YES';

    var classes_directory=storage_directory + '/classes';
    var classes_directory_path=classes_directory+ '/' + class_selected;
    var workday_directory_path=classes_directory_path + '/workday';

    var workday_file_path=workday_directory_path + '/' + today_file_date + '.my';
    var classes_file_path=classes_directory+ '/classes.my';
    var classes_member_file_path=classes_directory_path+ '/members.my';

 var workday_file=new android.File(workday_file_path);
 var workday_data=workday_file.exists() ? workday_file.read() : 'false';

    id=id?id:$('.individual_id').text();
  var r=id +'([^\n]+)';
 
  var rematch=new RegExp(r,'g');
 
 var getData=localStorage.getItem('session_members_data').match(rematch).toString();
 
    var regDate='';
 
  if (getData){
  
   var gd=getData.split('==');   

   var surname=ftoUpperCase( gd[1] );
   var firstname=ftoUpperCase ( gd[2], true);
   var gender=gd[3];
   var photo=gd[4];
   var member_id=gd[5];
   var regDate=gd[6];

  $('.member_id').text(member_id);

 }

  $('.ind_print_btn').attr('data-type','monthly');
  $('.ind_print_btn').attr('data-print_name', (surname + ' ' + firstname).substr(0,20)+ '_' + mName + '-' + year + ' report');


  sessionStorage.setItem('ind_csv_name', surname+ '_' + firstname);

   var gender_image=gender=='male'?'images/m_no_tamperX_thumbnail.txt':'images/f_no_tamperX_thumbnail.txt';
   var photo_=new android.File(photo);   
   var photo_thumbnail_=new android.File(photo.replace(/new.txt/,'new_thumbnail.txt') );
   var newPhotoType=false;
  
 if ( show_photo=='YES' &&  photo && check_data('_new.txt',photo) && photo_thumbnail_.isFile()){
      newPhotoType=true;    
     var imgphoto=photo_thumbnail_.read();
  }
  else{
   var gi=new android.AssetFile(gender_image);
     var imgphoto=gi.read();
     photo='avatar_' + gender_image.replace('_thumbnail','');
     newPhotoType=true;
   }

 var photo_data='<div class="ind_photo_container" style="display:inline-block;">';
      if (newPhotoType) {
   photo_data+='<img data-id="'+id+'" id="img_'+id+'" class="enlarge person_phot" url="' + photo + '" src="'+ imgphoto + '" style="border: 0; border-radiu: 100%;">';
      } else{
   photo_data+='<canvas data-id="' + id + '" id="ind_img_' + id + '" class="ind_img_' + id + ' ind_photo" url="'+ imgphoto + '?ver=' + randomString(10) + '" width="50" height="50" style="border:0; border-radius: 100%;"></canvas>';
    }
  photo_data+='</div>';
 

 $('.monthly_table').hide();
   $('.no_report').hide();

 $('.attendance_date').html( '<table align="center"><tr><td>' + photo_data + '</td><td>' + ( surname + ' ' + firstname + '\'s Attendance Report For ' + ( mName ? mName.toUpperCase() + '/' : 'Year ') + year ).toUpperCase() + '  <span style="color: #98cb99;">[ ' + eclass_selected.toUpperCase() + ' ]</span></td></tr></table>' );
   var file=new android.File(workday_directory_path + '/' + ( month ? month + '_' : '') + year + '.my');
       
     
    if(!file.isFile()){ 
     $('.companyopen').removeClass('alert-success').addClass('alert-danger').html( ('No attendance was taken in ' + ( month ? getMonthName( month ).toLowerCase() : '') + ' Year ' + year).toUpperCase() );    
    $('.no_report').show();
  $('.export_csv').hide();
    return false;
  }
  
   var companyopen=+file.read();
      
   $('.companyopen').removeClass('alert-danger').addClass('alert-success').html( ('Attendance was taken ' + companyopen + ' times in '+ ( month ? getMonthName(month).toUpperCase() : 'Year') +' ' + year).toUpperCase() );

       var monthT='';
 
   var file=new android.File(classes_directory_path + '/' + id + '/' + ( month ? month + '_' : '') + year + '.my');

    var existed=file.exists()? file.read() :false;
    var pre=existed?existed.split('|')[0]:'0';
          //in case of pre greater than companyopen due to error
         pre=+pre;
       pre=pre>companyopen?companyopen:pre;
       var abs=(+companyopen)-(+pre);
         
      var abs=(+companyopen)-(+pre);
          abs=abs>0?abs:0;
      var perc=Math.round ( ( pre*100)/companyopen);
          perc=perc?perc:0;
     var late=existed ? existed.split('|')[1]:0;
     
  var lateness='<td>' + late.toString() + '</td>';
    
    $('.thead1').show();
    $('.thead2').hide();

  if (show_late!='YES'){
    $('.thead1').hide();
    $('.thead2').show();
    lateness='';  }

  var csv='NAME,PRESENT,ABSENT,LATE,PERCENTAGE,CID';

    monthT+='<tr>';
    monthT+='<td>' + pre + '</td>';
    monthT+='<td>' + abs + '</td>';
    monthT+=lateness;
    monthT+='<td>'+ perc + '</td>';
    monthT+='</tr>';

 csv+='\n"' + surname + ' ' + firstname.replace(' ','') + '",' + pre + ',' + abs + ',' + lateness.replace('<td>','').replace('</td>','') + ',' + perc + '%,' + id;
 
 var data_date=( mName + '-' + year ).toUpperCase();

  sessionStorage.setItem('MONTHLY-CSV-REPORT-DATE',data_date);

  csv+='\n,,,,,';
  csv+='\nATTENDANCE TAKEN:,' + companyopen + ' TIMES,,,,';
  csv+='\n,,,,' + member + ' ID:,"' + member_id + '"';
  csv+='\n,,,,CLASS:,"' + eclass_selected.toUpperCase() + '"';
  csv+='\n,,,,DATE:,"' + data_date + '"';
  csv+='\n,,,,' + COMPANYTYPE.toUpperCase() + ':,"' + companyname.toUpperCase() + '"';

  sessionStorage.setItem('MONTHLY-CSV-REPORT-DATA',csv);

    $('.export_csv').show();

   $('.monthly_table').show();
   $('.table-monthly').html(monthT);
 
   $('.text_ad_').html(text_ad);
 
}


function showYearlyReport(id){

var class_selected=localStorage.getItem('class_selected');
var eclass_selected=class_selected? class_selected.replace(/_/g,' '):'';

   $('.export_csv').show();

  var this_month=conciseDate('month'); 
  var this_year=conciseDate('year');

      var show_late=localStorage.getItem('show_late');
      var show_photo=localStorage.getItem('show_photo');

  var show_late=show_late? show_late : 'YES';
  var show_photo=show_photo? show_photo : 'YES';

   var classes_directory=storage_directory + '/classes';
    var classes_directory_path=classes_directory+ '/' + class_selected;
    var workday_directory_path=classes_directory_path + '/workday';

    var workday_file_path=workday_directory_path + '/' + today_file_date + '.my';
    var classes_file_path=classes_directory+ '/classes.my';
    var classes_member_file_path=classes_directory_path+ '/members.my';

 var workday_file=new android.File(workday_file_path);
 var workday_data=workday_file.exists() ? workday_file.read() : 'false';


     id=id?id:$('.individual_id').text();
  var r=id +'([^\n]+)';
 
  var rematch=new RegExp(r,'g');
 
 var getData=localStorage.getItem('session_members_data').match(rematch).toString();
 
    var regDate='';
 
  if (getData){
  
   var gd=getData.split('==');
   
   var surname=ftoUpperCase( gd[1] );
   var firstname=ftoUpperCase ( gd[2], true);
   var member_id=gd[5];
   var regDate=gd[6];

 }

   $('.yearly_table,.no_report').hide();
 
   var year=$('.year').val();
  if(!year) year=this_year;

  $('.ind_print_btn').attr('data-type','yearly');
  $('.ind_print_btn').attr('data-print_name', (surname + ' ' + firstname).substr(0,20)+ '_Year ' + year + ' report');

  $('.yattendance_date').html('<table align="center"><tr><td><div class="cloned_photo"></div></td><td>' + ( surname + ' ' + firstname + '\'s Attendance Report For Year ' + year ).toUpperCase() + ' <span style="color: #98cb99;">[ ' + eclass_selected.toUpperCase() + ' ]</span></td></tr></table>' );
   var file=new android.File(workday_directory_path + '/' + year + '.my');
   
   if(!file.isFile()){   
     $('.ycompanyopen').removeClass('alert-success').addClass('alert-danger').html( ( 'No attendance was taken in Year ' + year).toUpperCase() );
     $('.no_report').show();
 $('.export_csv').hide();
 return false;
  }
  
  var companyopen=+file.read();
      
   $('.ycompanyopen').removeClass('alert-danger').addClass('alert-success').html( ('Attendance was taken ' + companyopen + ' times in Year ' + year).toUpperCase() );

          var yearT='';
 
   var file=new android.File(classes_directory_path + '/' + id + '/' + year + '.my');

    var existed=file.isFile()? file.read() :false;

     var pre=existed?existed.split('|')[0]:'0';
          //in case of pre greater than companyopen due to error
         pre=+pre;
       pre=pre>companyopen?companyopen:pre;
       var abs=(+companyopen)-(+pre);
         
      var abs=(+companyopen)-(+pre);
          abs=abs>0?abs:0;
      var perc=Math.round ( ( pre*100)/companyopen);
          perc=perc?perc:0;
      var late=existed ? existed.split('|')[1]:0;
     
  var lateness='<td>' + late.toString() + '</td>';
    if (show_late!='YES') {
  lateness='';
  }

var csv='NAME,PRESENT,ABSENT,LATE,PERCENTAGE,CID';

    yearT+='<tr>';
    yearT+='<td>' + pre + '</td>';
    yearT+='<td>' + abs + '</td>';
    yearT+=lateness;
    yearT+='<td>'+ perc + '</td>';
    yearT+='</tr>';

csv+='\n"' + surname + ' ' + firstname.replace(' ','') + '",' + pre + ',' + abs + ',' + lateness.replace('<td>','').replace('</td>','') + ',' + perc + '%,' + id;
 
var data_date= year.toUpperCase();

  sessionStorage.setItem('YEARLY-CSV-REPORT-DATE',data_date);

  csv+='\n,,,,,';
  csv+='\nATTENDANCE TAKEN:,' + companyopen + ' times,,,,';
  csv+='\n,,,,' + member + ' ID:,"' + member_id + '"';
  csv+='\n,,,,CLASS:,"' + eclass_selected.toUpperCase() + '"';
  csv+='\n,,,,DATE:,"' + data_date + '"';
  csv+='\n,,,,' + COMPANYTYPE.toUpperCase() + ':,"' + companyname.toUpperCase() + '"';

  sessionStorage.setItem('YEARLY-CSV-REPORT-DATA',csv);

   $('.export_csv').show();

   $('.table-yearly').html(yearT);
  $('.yearly_table').show();
 
  $('.text_ad').html(text_ad);

 $('.cloned_photo').empty();
$('.ind_photo_container').clone().appendTo('.cloned_photo');
 
  $('.ind_photo').each(function(){
 
  var did=$(this).data('id');
  var id='ind_img_' + did;
  var url=$(this).attr('url');

  cropImage(url,id,55,55,'true');
  });

}


 function showSemesterReport(id){
 $('.export_csv').show();

 var class_selected=localStorage.getItem('class_selected');
 var eclass_selected=class_selected? class_selected.replace(/_/g,' '):'';

  var this_month=conciseDate('month');
  var this_year=conciseDate('year');

  var semester=conciseDate('semester');
  var session=conciseDate('session');
  var this_semester=conciseDate('this_semester');
  var this_session=conciseDate('this_year');

      var show_late=localStorage.getItem('show_late');
      var show_photo=localStorage.getItem('show_photo');

  var show_late=show_late? show_late : 'YES';
  var show_photo=show_photo? show_photo : 'YES';

   var classes_directory=storage_directory + '/classes';
    var classes_directory_path=classes_directory+ '/' + class_selected;
    var workday_directory_path=classes_directory_path + '/workday';

    var workday_file_path=workday_directory_path + '/' + today_file_date + '.my';
    var classes_file_path=classes_directory+ '/classes.my';
    var classes_member_file_path=classes_directory_path+ '/members.my';

 var workday_file=new android.File(workday_file_path);
 var workday_data=workday_file.exists() ? workday_file.read() : 'false';

   id=id?id:$('.individual_id').text();
  var r=id +'([^\n]+)';
 
  var rematch=new RegExp(r,'g');
 
 var getData=localStorage.getItem('session_members_data').match(rematch).toString();
 
    var regDate='';
 
  if (getData){
  
   var gd=getData.split('==');
   
   var surname=ftoUpperCase( gd[1] );
   var firstname=ftoUpperCase ( gd[2], true);
   var member_id=gd[5];
   var regDate=gd[6];
   
 }

  $('.semester_table,.no_report').hide();
 
  var s=$('.semester_form').val();
  var se=$('.session_form').val();

  var sem=this_semester;

   if( s && se) sem=s + '_' + se;

 $('.ind_print_btn').attr('data-type','semester');
  $('.ind_print_btn').attr('data-print_name', (surname + ' ' + firstname).substr(0,20)+ '_' + format_semester(sem) + ' session report');

 $('.sattendance_date').html('<table align="center"><tr><td><div class="cloned_photo"></div></td><td>' + ( surname + ' ' + firstname + '\'s Attendance Report For ' + format_semester(sem) + ' Session ').toUpperCase() + '  <span style="color: #98cb99;">[ ' + eclass_selected.toUpperCase() + ' ]</span></td></tr></table>' );

   if (!semesterEnabled){
    $('.scompanyopen').removeClass('alert-success').addClass('alert-danger').html( (semester_text + ' attendance disabled.').toUpperCase() );
  $('.no_report').show();
 $('.export_csv').hide();
   return false;
    }
  

   var file=new android.File(workday_directory_path + '/' + sem + '.my');
   
      if(!file.isFile()){   
     $('.scompanyopen').removeClass('alert-success').addClass('alert-danger').html( ('No attendance was taken in ' +  format_semester( sem) + ' session').toUpperCase() );
   $('.no_report').show();
 $('.export_csv').hide(); 
    return false;
 }
  
      var companyopen=+file.read();
      
   $('.scompanyopen').removeClass('alert-danger').addClass('alert-success').html( ('Attendance was taken '  + companyopen + ' times in ' + format_semester(sem) + ' session').toUpperCase());

      var semesterT=''; 
  
  var file=new android.File(classes_directory_path + '/' + id + '/' + sem + '.my');

    var existed=file.isFile()? file.read() :false;

     var pre=existed?existed.split('|')[0]:'0';
          //in case of pre greater than companyopen due to error
         pre=+pre;
        pre=pre>companyopen?companyopen:pre;
       var abs=(+companyopen)-(+pre);
         
      var abs=(+companyopen)-(+pre);
          abs=abs>0?abs:0;
      var perc=Math.round ( ( pre*100)/companyopen);
          perc=perc?perc:0;
      var late=existed ? existed.split('|')[1]:0;
      var lateness='<td>' + late.toString() + '</td>';
  
  if (show_late!='YES'){
  lateness='';   }

var csv='NAME,PRESENT,ABSENT,LATE,PERCENTAGE,CID';

    semesterT+='<tr>';
    semesterT+='<td>' + pre + '</td>';
    semesterT+='<td>' + abs + '</td>';
    semesterT+=lateness;
    semesterT+='<td>'+ perc + '</td>';
    semesterT+='</tr>';

 csv+='\n"' + surname + ' ' + firstname.replace(' ','') + '",' + pre + ',' + abs + ',' + lateness.replace('<td>','').replace('</td>','') + ',' + perc + '%,' + id;
  

   var type=TERM_TYPE=='term'?'TERMLY-CSV-REPORT':'SEMESTER-CSV-REPORT';
  
  var data_date=(TERM_TYPE=='term'?sem.replace('semester','term'):sem ).replace(/_/g,' ') + ' SESSION';
  sessionStorage.setItem(type + '-DATE',data_date);


  csv+='\n<!-,,,,,--!>';
  csv+='\nATTENDANCE TAKEN:,' + companyopen + ' TIMES,,,,';
  csv+='\n,,,,' + member + ' ID:,"' + member_id + '"';
  csv+='\n,,,,CLASS:,"' + eclass_selected.toUpperCase() + '"';
  csv+='\n,,,,DATE:,"' + data_date.replace(' SESSION','').toUpperCase().replace(/ ([^ ]*)$/, '/$1') + ' SESSION"';
  csv+='\n,,,,' + COMPANYTYPE.toUpperCase() + ':,"' + companyname.toUpperCase() + '"';
 
  sessionStorage.setItem(type+ '-DATA',csv);

   $('.export_csv').show();

  $('.table-semester').html(semesterT);
   $('.semester_table').show(); 

  $('.text_ad').html(text_ad);

 $('.cloned_photo').empty();
 $('.ind_photo_container').clone().appendTo('.cloned_photo');
 
 $('.ind_photo').each(function(){
 
  var did=$(this).data('id');
  var id='ind_img_' + did;
  var url=$(this).attr('url');

  cropImage(url,id,55,55,'true');
  });
  }
 
 
function showSessionReport(id){
 $('.export_csv').show();

var class_selected=localStorage.getItem('class_selected');
var eclass_selected=class_selected? class_selected.replace(/_/g,' '):'';

  var this_month=conciseDate('month');
  var this_year=conciseDate('year');

  var semester=conciseDate('semester');
  var session=conciseDate('session');
  var this_semester=conciseDate('this_semester');
  var this_session=conciseDate('this_session');

      var show_late=localStorage.getItem('show_late');
      var show_photo=localStorage.getItem('show_photo');

  var show_late=show_late? show_late : 'YES';
  var show_photo=show_photo? show_photo : 'YES';

   var classes_directory=storage_directory + '/classes';
    var classes_directory_path=classes_directory+ '/' + class_selected;
    var workday_directory_path=classes_directory_path + '/workday';

    var workday_file_path=workday_directory_path + '/' + today_file_date + '.my';
    var classes_file_path=classes_directory+ '/classes.my';
    var classes_member_file_path=classes_directory_path+ '/members.my';

 var workday_file=new android.File(workday_file_path);
 var workday_data=workday_file.exists() ? workday_file.read() : 'false';

   id=id?id:$('.individual_id').text();
  var r=id +'([^\n]+)';
 
  var rematch=new RegExp(r,'g');
 
 var getData=localStorage.getItem('session_members_data').match(rematch).toString();
 
    var regDate='';
 
  if (getData){
  
   var gd=getData.split('==');
   
   var surname=ftoUpperCase( gd[1] );
   var firstname=ftoUpperCase ( gd[2], true);
   var member_id=gd[5];
   var regDate=gd[6];
 }

  $('.session_table,.no_report').hide(); 
  var ses=$('.ssession_form').val();
 
  $('.ind_print_btn').attr('data-type','session');
  $('.ind_print_btn').attr('data-print_name', (surname + ' ' + firstname).substr(0,20)+ '_session ' + ses + ' report');

    $('.seattendance_date').html('<table align="center"><tr><td><div class="cloned_photo"></div></td><td>' +   ( surname + ' ' + firstname + '\'s Attendance Report For ' + ses.replace(/_([^_]*)$/, '/$1')  .replace(/_/g,' ') + ' Session  ').toUpperCase() + ' <span style="color: #98cb99;">[ ' + eclass_selected.toUpperCase() + ' ]</span></td></tr></table>' );

  if (!semesterEnabled){

    $('.secompanyopen').removeClass('alert-success').addClass('alert-danger').html('SESSION ATTENDANCE DISABLED.');
   $('.no_report').show();
 $('.export_csv').hide();
  return false;
    }

   var file=new android.File(workday_directory_path + '/' + ses + '.my');
   
  if(!file.isFile()){
    
     $('.secompanyopen').removeClass('alert-success').addClass('alert-danger').html( ('No attendance was taken in ' + ses .  replace(/_([^_]*)$/, '/$1') .replace(/_/g,' ') + ' session').toUpperCase() );
  $('.no_report').show();
 $('.export_csv').hide();
    return false;
   
  }


   var companyopen=+file.read();
      
   $('.secompanyopen').removeClass('alert-danger').addClass('alert-success').html( ('Attendance was taken ' + companyopen + ' times in ' + ses .  replace(/_([^_]*)$/, '/$1').replace(/_/g,' ') + ' session').toUpperCase() );
     var sessionT='';
  
  var file=new android.File(classes_directory_path + '/' + id + '/' + ses + '.my');
    var existed=file.exists()?file.read() :false;

       var pre=existed?existed.split('|')[0]:'0';
          //in case of pre greater than companyopen due to error
         pre=+pre;
       pre=pre>companyopen?companyopen:pre;
       var abs=(+companyopen)-(+pre);
           abs=abs>0?abs:0;
      var perc=Math.round ( ( pre*100)/companyopen);
          perc=perc?perc:0;
      var late=existed ? existed.split('|')[1]:0;
     
  var lateness='<td>' + late.toString() + '</td>';
    if (show_late!='YES') {
  lateness='';
  }

var csv='NAME,PRESENT,ABSENT,LATE,PERCENTAGE,CID';

    sessionT+='<tr>';
    sessionT+='<td>' + pre + '</td>';
    sessionT+='<td>' + abs + '</td>';
    sessionT+=lateness;
    sessionT+='<td>'+ perc + '</td>';
    sessionT+='</tr>';


csv+='\n"' + surname + ' ' + firstname.replace(' ','') + '",' + pre + ',' + abs + ',' + lateness.replace('<td>','').replace('</td>','') + ',' + perc + '%,' + id;
 
var data_date= ses.toUpperCase();

  sessionStorage.setItem('SESSION-CSV-REPORT-DATE',data_date);

  csv+='\n,,,,,';
  csv+='\nATTENDANCE TAKEN:,' + companyopen + ' TIMES,,,,';
  csv+='\n,,,,' + member + ' ID:,"' + member_id + '"';
  csv+='\n,,,,CLASS:,"' + eclass_selected.toUpperCase() + '"';
  csv+='\n,,,,DATE:,"' + data_date.replace(/_/g,'/') + ' SESSION"';
  csv+='\n,,,,' + COMPANYTYPE.toUpperCase() + ':,"' + companyname.toUpperCase() + '"';

  sessionStorage.setItem('SESSION-CSV-REPORT-DATA',csv);

   $('.export_csv').show();


     $('.table-session').html(sessionT);
     $('.session_table').show();

    $('.text_ad').html(text_ad);

 $('.cloned_photo').empty();
 $('.ind_photo_container').clone().appendTo('.cloned_photo');
 
 $('.ind_photo').each(function(){
 
  var did=$(this).data('id');
  var id='ind_img_' + did;
  var url=$(this).attr('url');

  cropImage(url,id,55,55,'true');
  });
  }
