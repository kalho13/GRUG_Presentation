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
                     city = result[i]['city'];
                     state = result[i]['state'];
                     country =  result[i]['country'];
                     web = result[i]['website'];

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