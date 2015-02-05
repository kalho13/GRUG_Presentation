function setMouseOut(marker){
            google.maps.event.addListener(marker, "mouseout", function(event) {                           
            //create ib2 otherwise scrolling across multiple markers causes loss of focus on infobox object
                 var ib2 = new InfoBox();
                 ib2 = ib;
                 setTimeout(function(){
                    ib2.close(); },1600);
              }); //close mouseout listener
        }//close func