const express= require('express');
const Mongoose=require('mongoose');
const schoolModel=require('./school.js')
const moment = require('moment');


Mongoose.connect("mongodb://localhost:27017/mongodb-102", function(err, db) {   
    if(err) { return console.dir(err); }
    else{console.log("connection established")}   
  });
 
//------------> array of all capital district
  var capitalDistrict=['PORT BLAIR','HYDERABAD','ITANAGAR','DISPUR','PATNA','CHANDIGARH','RAIPUR','SILVASSA',
                   'DAMAN','NEW DELHI','PANAJI','GANDHINAGAR','SHIMLA','RANCHI','BANGLORE','THIRUVANANTHAPURAM',
                    'KAVARATTI','BHOPAL','MUMBAI','IMPHAL','SHILLONG','AIZAWL','KOHIMA','BHUBANESWAR','PUDUCHERRY',
                  'JAIPUR','GANGTOK','CHENNAI','HYDERABAD','AGARTALA','LUCKNOW','DEHRADUN','KOLKATA'];
               
  console.log(capitalDistrict);
  var counter =0 

//------------>2. Find the names of all school trusts & associated schools which have schools in 5 or more ----------------------->capital districts | find cities ///////////////////////////

function trustInMoraThan5CapitalDistrict(){  
  schoolModel.aggregate([                             // finding trust with all their information
    {
      $group:{
        _id:"$data.name-of-trust-society-managing-committee", 
        Numberofschools:{$sum:1}, 
        cities: {$addToSet: "$data.district"},
        schools:{$addToSet:"$data.name-of-institution"},
        states:{$addToSet:"$data.state"}
      }
    },
    {
      $project: {                                                  //  project these values in output 
        _id: 0,      
        "trustname":"$_id",
         "states":"$states",
        "cities":"$cities",              
      }
    }   
  ],  function (err, detailsOfTrust) {
        finalTrust=[];                                             // trust array which are in 5 or more capital district         
        if (!err){
          detailsOfTrust.forEach( function(Element){              
            if(Element.trustname != ""){
              var cities=Element['cities']                         //  only cities from element in cities 
              cities.forEach(function (cityElement){               // capitalelement is single value of capitaldistrict array
                var capitals = [];
                eIndex=capitalDistrict.indexOf(cityElement)        // checking value match in cityelement 
                if(eIndex!=-1){                                    // if match 
                  counter+=1;                                      // increase counter with 1
                  if(counter == 5 ){                               //if its mathches 5 times then push the element in array
                    finalTrust.push(Element);                      // push the element in array if it have trust in 5 or more                                                                     
                  }                                                // capital  districts
                  capitals.push();                
                }
              });
              counter=0;                                           // set counter 0 for next iteration 
            }
          });    
        }
        else{
          return console.log(err);
        }     
        console.log(finalTrust);                                    // final result
  }) 
}
trustInMoraThan5CapitalDistrict();