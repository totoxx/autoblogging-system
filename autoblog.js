

/*
=============== Configuration setting ===============
*/

// before you running the script you need to setup the following setting: 

//blogger email to send articles.
var bloggerEmail = "username.secretcode@blogger.com"; 

// Max article to post ( more than 5 post not recommanded)
 maxPost = 5;
// configure  translatation for rss feed availaible language: 
// liste of available language here: https://developers.google.com/translate/v2/using_rest#language-params
// translate (1)
 var inputLang1 = "";
 var outputLang1 = "fr";
 
 // translate (2)
 var inputLang2 = outputLang1;
 var outputLang2 = "es";
 
 // translate (3)
 var inputLang3 = outputLang2;
 var outputLang3 = "de";
 
 // translate (4)
 var inputLang4 = outputLang3;
 var outputLang4 = "en";


// RSS feed
var rssFeed = "http://exemple.com/feed";

// check for duplicate post
var checkPost = true; // check if the post is already posted, if you want to turn it true, put your blog RSS in myBloggerRSS  

// your blogger RSS feed, change just blog name in the following url: blogName.blogspot....
var myBloggerRSS = "http://yourblogname.blogspot.com/feeds/posts/default?alt=rss";

/*
=============== End of configuration setting ===============
*/




// main function to run the project.
function main() {
     
  parseRSS(rssFeed);    
  
}



// function to send html email
 function htmlEmail(email, subject, content) {
   MailApp.sendEmail({
     to: email,
     subject: subject,
     htmlBody: content,
   });
 }
 
 
 
 // this function check for duplicate posts
 function ckeckForDuplicatePosts(title){
 var duplicated = false;
 var item;
 var maxParse=0;

//check for rss blog posts
  var txt = UrlFetchApp.fetch(myBloggerRSS).getContentText();
  var doc = Xml.parse(txt, false);  
  
  var items = doc.getElement().getElement("channel").getElements("item");
  
  //check if the blog rss is empty
   if(items.length==0 ){
    return false;
  }
 
 // to avoid waste of resources we limit number of iteration
 if(items.length>10){
    maxParse=10;
  }
  else{
  maxParse = items.length;
  }
  
  //compare title of new post with all my blog posts 
  for (var i=0; i<maxParse; i++) {

    try {
      
        item  = items[i];
      
        var myBlogTitle = item.getElement("title").getText();
      
        if(myBlogTitle==title){
          duplicated = true;
          break;
        }
    } 
    
    catch (e) {
      Logger.log(e);
    }
    
  }
  
  
 return duplicated;
 }
 
 
 
 // Function to translate RSS
 function translateRSS(content, type){
 if(type=="html"){
 //firste translate
 content_trs1 = LanguageApp.translate(content, inputLang1, outputLang1, {contentType: "html"});
 
 //second translate
 content_trs2 = LanguageApp.translate(content_trs1, inputLang2, outputLang2, {contentType: "html"});
 
 //third translate
  content_trs3 = LanguageApp.translate(content_trs2, inputLang3, outputLang3, {contentType: "html"});

// last translate
  content_trs4 = LanguageApp.translate(content_trs3, inputLang4, outputLang4, {contentType: "html"});
  }
  else{
   //firste translate
 content_trs1 = LanguageApp.translate(content, inputLang1, outputLang1);
 
 //second translate
 content_trs2 = LanguageApp.translate(content_trs1, inputLang2, outputLang2);
 
 //third translate
  content_trs3 = LanguageApp.translate(content_trs2, inputLang3, outputLang3);

// last translate
  content_trs4 = LanguageApp.translate(content_trs3, inputLang4, outputLang4);
  }

 return content_trs4;
 }
 
 
 
 
 
 // parse and translate RSS feeds.
function parseRSS(feed) {
     
  var item, titleTrans, title, desc ; 
  
  var txt = UrlFetchApp.fetch(feed).getContentText();
  var doc = Xml.parse(txt, false);  
  
  title = doc.getElement().getElement("channel").getElement("title").getText();
    
  var items = doc.getElement().getElement("channel").getElements("item");   
 
 //if the rss feed is empty:
  if(items.length==0 ){
    return 0;
  }
 
 if((maxPost>10) || (maxPost<=0) || (maxPost>items.length) ){
    maxPost=items.length;
  }
  
  for (var i=0; i<maxPost; i++) {

    try {
      
      item  = items[i];
      
      title = item.getElement("title").getText();
      desc  = item.getElement("description").getText();
      titleTrans = translateRSS(title, "text");
      desc  = translateRSS(desc, "html");
       if(checkPost==true){
       
          if(ckeckForDuplicatePosts(titleTrans)==false){
              htmlEmail(bloggerEmail, titleTrans, desc);
          }
        
          else{
          continue;
          }
       }
       else{
      htmlEmail(bloggerEmail, titleTrans, desc);
      }
    
    } catch (e) {
      Logger.log(e);
    }
  }
  
  return 0;
}


