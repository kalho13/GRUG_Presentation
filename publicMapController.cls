public class publicMapController {

    /** Finds all courses that are marked as active and which the parent account has a value in the latitude field */


 @RemoteAction
   public static List<Course_Detail__c> getOpenCourses(){
    return [SELECT 
                Id, 
                Name, 
                Account__r.Name, 
                Account__r.Location__Latitude__s, 
                Account__r.Location__Longitude__s,
                Account__r.ShippingStreet, 
                Account__r.ShippingCity, 
                Account__r.ShippingState, 
                Account__r.ShippingPostalCode, 
                Account__r.ShippingCountry, 
                Account__r.Website,
                Model__c, 
                Year_Built__c, 
                Status__c 
                FROM Course_Detail__c 
                WHERE Status__c='Active' and (Account__r.Location__Latitude__s != null or Account__r.Location__Longitude__s != null)];                    
   }    


   /** When querying location values you can use the compound field of Location__c, but not when filtering using the WHERE statement */

     
}