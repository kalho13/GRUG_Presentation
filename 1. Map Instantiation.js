    //global variables
    var map;
    var infoWindow = new google.maps.InfoWindow({});
    var ib = new InfoBox();
    var $j = jQuery.noConflict(); 

    //initialize to create the base map  
    $j(document).ready(function() {
      function initialize() { 

        //initialization variable   
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

    });//close ready
