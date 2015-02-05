<apex:page controller="publicMapController" showHeader="false"  standardStylesheets="false">
<head>
  <link href='https://fonts.googleapis.com/css?family=Tenor+Sans|Open+Sans+Condensed:300' rel='stylesheet' type='text/css' />
  <style type="text/css">
    html { height: 100% }
    body { height: 100%; margin: 0; padding: 0;}
    #map_canvas { 
      height: 100%;
      width:100%; 
    }               
    .info {
      font:12px optima, arial,sans-serif;
      border-style:solid;
      border-color:#faf4cb;
      border-spacing:20px 20px;
      border-radius:10px;
      background-color:#faf4cb; 
      line-height: 1.5;
      letter-spacing:1px; 
    }  
  </style>          
  <script type="text/javascript"  src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>  
  <script type="text/javascript" src="https://google-maps-utility-library-v3.googlecode.com/svn/tags/infobox/1.1.9/src/infobox_packed.js"></script>   
  <script type="text/javascript">   
    
    /** Written by K.Howell @ Ropes Courses Inc.  December 2013.  */
    var map;
    var infoWindow = new google.maps.InfoWindow({});
    var ib = new InfoBox();
    var $j = jQuery.noConflict();    
    //initialize to create the base map  
    $j(document).ready(function() {
      function initialize() {    
        var courseList=[];
               
        //set the center of the map to the center of the U.S.
        var myLatLng = new google.maps.LatLng(40.707123,  -99.033065);
                 
        //setting map options
        var mapOptions = {
          zoom: 3,
          center: myLatLng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
                
        //adding the map to the div tag
        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);   

          Visualforce.remoting.Manager.invokeAction(
            '{!$RemoteAction.publicMapController.getOpenCourses}',
            function(records, e){
              $j.each(records,function(index, course){             
              var c = {
                  key :       course.Account__r.Location__Latitude__s + ':' + course.Account__r.Location__Longitude__s,
                  lat :       course.Account__r.Location__Latitude__s,
                  lon :       course.Account__r.Location__Longitude__s,
                  customer :  course.Account__r.Name,
                  model :     course.Model__c,
                  city :      course.Account__r.ShippingCity,
                  state :     course.Account__r.ShippingState,
                  country :   course.Account__r.ShippingCountry,
                  website :   course.Account__r.Website
                };

                courseList.push(c);
              });  //ends the $j.each loop through the values returned from salesforce creating a list of objects for adding the the map as markers
        
              //using the list of locations add the event listeners, infoBox details and other attributes
              processCourses(courseList);
          }, //close callback function
          
            {escape: true} //prevent malicious client side code injection.  Defeault is true.  Here as an example
          ); //close RemoteAction

            //add to the logo to the upper right of the page
            var logoControlDiv = document.createElement('DIV');
            var logoControl = new addLogoControl(logoControlDiv);
            logoControlDiv.index = 0; // used for ordering
            map.controls[google.maps.ControlPosition.RIGHT_TOP].push(logoControlDiv);            
      } //close initialize

            //trigger the initialize code
      google.maps.event.addDomListener(window, 'load', initialize);

    });//close ready

        function processCourses(courseList){
          var processedCourses=[];
          $j.each(courseList, function(key, value) {  
            
            //if this course location (defined by a key of lat & long) is not part of the processedCourses list go ahead and add to the list      
            if( $j.inArray(value['key'], processedCourses) == -1 ) {
            //return all of the course records with the same key.  The result will contain 1 to many recordss
              var result = $j.grep(courseList, function(v,i) {                    
                  return v['key'] === value.key;
              });
                                              
              // Create the marker                
              var marker = new google.maps.Marker({
                position: new google.maps.LatLng(result[0]['lat'], result[0]['lon']),
                map: map,
                title:"",
                url:""
              }); 

              //set the mouse listener event for each marker                                
              setMouseOver(result, marker);
              setMouseOut(marker);
              setMouseClick(marker);
              processedCourses.push(value.key); 
            } //end $j.inArray
          });//end $j.each  courseList 
        }//close processCourses
 
        
        function openPage(url){
                window.open(url,'_blank');      
        }   
        
        function setMouseOver(result, marker){
          //start by parsing out data from the result(s) and customizing the format

            var model;
            var location;       
            var weburl;

             //there may be multipe records passed in from the result                   
             for(var i = 0; i< result.length; i++) { 
                //the first result is used to set the base values                            
                if(i==0){
                     customer = result[i]['customer'];  
                     city =     result[i]['city'];
                     state =    result[i]['state'];
                     country =  result[i]['country'];
                     web =      result[i]['website'];

                     //for some models the Registered Trademark symbol needs to be added
                     if( result[i]['model'].indexOf("Sky Trail")>= 0){
                        model = result[i]['model'].replace("Sky Trail", "Sky Trail&#174;"); 
                     }else{
                      	model = result[i]['model'];
                     }                  
                }else{
                
                  //if this is not the first record in the result set, just append the additional course details to the existing variables
                 if( result[i]['model'].indexOf("Sky Trail")>= 0){
                        model = model + ', ' + result[i]['model'].replace("Sky Trail", "Sky Trail&#174;");  
                     }else{
                      model =  model + ', ' + result[i]['model'];
                     }
                }   //end if i==0                                                
          } //end for results                                                           
                               
            //manipulate the data to be displayed in the infoBox 
            //city and state if US or CA.  For rest the of global city and country
          if((country !='US')&&(country !='USA')&&(country !='United States') &&(country !='CA')&&(country !='Canada')&&(country !=null)){
            location = city + ', ' + country;           
          }else{
            location = city + ', ' + state;             
          }     
                                  
          //if the account record contains a url then create the site name (customer) as a hyperlink
          if(web==null){
                weburl = '<b>Site: </b>'+ customer + '<br>';
          } else {
                weburl =  '<b>Site: </b><a href="javascript:openPage(' + "'"+ web+ "'" + ')">' + customer+ '</a><br>';
          }     
                                  
         //add mouseover event listener using variables defined above
          google.maps.event.addListener(marker, "mouseover", function(event) {
            //Using the InfoBox api create a layout containing the information for the result to be displayed when on the mouseOver event of the marker
            var boxText = document.createElement("div");
                //add the style inline because of inconsistencies when trying to apply .css class.  Would not noramlly take this approach
                boxText.style.cssText = "font:12px optima;border-style:solid; border-color:#faf4cb; border-spacing:20px 20px; border-padding:20px; border-radius:10px; background-color:#faf4cb;";                              
                boxText.innerHTML =  '<div class="info">'+ weburl + '<b>Location: </b>'+ location + '<br>'+'<b>Course(s): </b>' + model +'<br>' + '</div>';
             
            //add the infoBoxOptions to the marker along with some fine tuning of the parameters                                                                        
            var infoBoxOptions = {
                   content: boxText  //applying the boxText variable defined above
                   ,disableAutoPan: false
                   ,maxWidth: 0
                   ,pixelOffset: new google.maps.Size(-140, 0)
                   ,zIndex: null
                   ,boxStyle: {opacity:1 ,width: "280px"}
                   ,closeBoxMargin: "10px 2px 2px 2px"
                   ,closeBoxURL: ""                                 
                   ,infoBoxClearance: new google.maps.Size(1, 1)
                   ,isHidden: false
                   ,pane: "floatPane"
                   ,enableEventPropagation: false
                };   
                
             //this was a little tricky               
            ib = new InfoBox(infoBoxOptions);                     
                 if (ib) {ib.open(map, this);}                                                          
         });  //close mouseover listener            
        
        }//close function setMouseOver
        
        function setMouseOut(marker){
            google.maps.event.addListener(marker, "mouseout", function(event) {                           
            //create ib2 otherwise scrolling across multiple markers causes loss of focus on infobox object
                 var ib2 = new InfoBox();
                 ib2 = ib;
                 setTimeout(function(){
                    ib2.close(); },1600);
              }); //close mouseout listener
        }//close function setMouseOut
        
        function setMouseClick(marker){     
          google.maps.event.addListener(marker, "click", function(event) {
             map.setZoom(9);
             map.setCenter(marker.getPosition());
          });//close click listener
        }//close function setMouseClick
        
        function addLogoControl(controlDiv) {            
            controlDiv.style.padding = '5px';
            var logo = document.createElement('IMG');
            logo.src = "{!URLFOR($Resource.Logo)}"
            logo.style.cursor = 'pointer';
            controlDiv.appendChild(logo);
        }
    </script>
    
    </head>
    <body>
     <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
     <div id="map_canvas"></div>      
    </body>
</apex:page>