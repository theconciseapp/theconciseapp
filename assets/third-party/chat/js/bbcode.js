function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const htmlFormat =[
    { symbol: '*', tag: 'strong',  regex: '(?<=[ >~`\^_.\+-]|^)\\*(?:(?!\\s)).*?[^ ]\\*(?=[\\W_]|$)' },
    { symbol: '_',   tag: 'em',    regex: '(?<=[ >~`\^\*.\+-]|^)_(?:(?!\\s)).*?[^ ]_(?=[\\W_]|$)'},
    { symbol: '~',   tag: 's',     regex: '(?<=[ >`\^\*_.\+-]|^)~(?:(?!\\s)).*?[^ ]~(?=[\\W_]|$)' },
    { symbol: '--',  tag: 'u',     regex: '(?<=[ >~`\^\*_.\+]|^)(?:--)(?:(?!\\s)).*?[^ ](?:--)(?=[\\W_]|$)' },
    { symbol: '```', tag: 'tt',    regex: '(?<=[\\^> ]|^)(?:```)(?:(?! ))([^]*)[^ ](?:```)(?=[\\W_]|$)' },
  .chat_id=chat_id||randomNumber(10);
  
string=string.replace(vRegex, function(m, link, poster){  
  if( show_symbol ){   
   return '<osbv>[video=' + link + ']' + poster + '[/video]</osbv>';
   } else return '<osbv src="' + link + '" poster="' + poster + '">' + videoLayout( chat_id, fuser, chat_from, chat_id, "", link, "350_380", "" , poster, 0, "external") + '</osbv>';
 }).replace(aRegex, function(m, link, title){  
   if(show_symbol)  {
     return '<osba>[audio=' + link + ']' + title + '[/audio]</osba>';
   } else return '<osba src="' + link + '" title="' + title + '">' + audioLayout( chat_id, fuser, chat_from, chat_id, "", link , title, 0, "external") + '</osba>';
 }).replace(iRegex, function(m, link, title){
  if(show_symbol) {
    return '<osbi>[img=' + link + ']' + title + '[/img]</osbi>';
  }else return '<osbi src="' + link + '" title="' + title + '">' + photoLayout( chat_id, fuser, chat_from, chat_id, "", link, "350_350", title, 0, "external") + '</osbi>';
 }).replace(fRegex, function(m, link, title, ext){
  if(show_symbol) {
    return '<osbf>[file=' + link + ']' + title + '/' + ext + '[/file]</osbf>';
  }else {
    return '<osbf src="' + link + '" title="' + title + '" ext="' + ext + '">' + fileLayout( (ext||"unk"), chat_id, fuser, chat_from,chat_id, "" , link, title, 0, "external") + '</osbf>';
  }
 })
  

  return string;
}

function removebbCode(text){
 
return text.replace(/<strong>(.*?)<\/strong>/g,'*$1*')
           .replace(/<em>(.*?)<\/em>/g,'_$1_')
           .replace(/<s>(.*?)<\/s>/g,'~$1~')
           .replace(/<u>(.*?)<\/u>/g,'--$1--')
           .replace(/<tt>([\s\S]*)<\/tt>/g,"```$1```")
       .replace(/<code>([\s\S]*)<\/code>/g,"^$1^")      
       .replace(/<a href="(.*?)"(?:(.*?))>(.*?)<\/a>/g,"$1")
  
  .replace(/<re>(.*?)<\/re>/g,  '+r+$1+r+')
  .replace(/<bl>(.*?)<\/bl>/g,  '+b+$1+b+')
  .replace(/<gr>(.*?)<\/gr>/g,  '+g+$1+g+')
  .replace(/<big>(.*?)<\/big>/g,'+l+$1+l+')
  .replace(/<small>(.*?)<\/small>/g,'+s+$1+s+')
  .replace(/<span class="j([^>]*)>(.*?)<\/span>/g,'$2')
  .replace(/<span class="p([^>]*)>(.*?)<\/span>/g,'@$2')
  .replace(/<osbv src="(.*?)" poster="(.*?)">(.*?)<\/osbv>/g,'[video=$1]$2[/video]')
  .replace(/<osba src="(.*?)" title="(.*?)">(.*?)<\/osba>/g,' [audio=$1]$2[/audio]')
  .replace(/<osbi src="(.*?)" title="(.*?)">(.*?)<\/osbi>/g,' [img=$1]$2[/img]')
  .replace(/<osbf src="(.*?)" title="(.*?)" ext="(.*?)">(.*?)<\/osbf>/g,' [file=$1]$2/$3[/file]')

}


function go_textFormatter(text){
  
 text= parsemd__(text);
  text=text.replace(/(?<=\s|^)@([\w_-]+)(?=\s|^)/gi, '<span class="post-chat-user" data-fuser="$1">$1</span>')
     .replace(/\[follow=(.*?)\](.*?)\[\/follow\]/g,'<span class="go-follow-btn go-post-follow-btn" data-pin="$1">$2</span>')
     .replace(/\[\[([\w_-]+):(.*?)\]\]/gi, '<span class="fa fa-lg fa-$1 ext-social-button" data-site="$1" data-account="$2"> $2</span>')
     .replace(/\[img=(.*?)\](.*?)\[\/img\]/g, '<img class="go-post-image go-post-photo" src="$1" alt="">')
     .replace(/\[link=(.*?)\](.*?)\[\/link\]/g,'<span class="go-nice-link" data-link="$1">$2</span>')

 return text;
}
