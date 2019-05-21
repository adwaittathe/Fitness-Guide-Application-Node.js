const mongoose=require('mongoose');
let schema= mongoose.Schema;

let userDataSchema = new schema({
  userId : {type:Number, required:true},
  password: {type:String, required:true},
  firstName : {type:String, required:true},
  lastName :{type:String, required:true},
  email : String,
  address1 : String,
  address2 : String,
  city: String,
  state: String,
  zipcode : String,
  country : String
},{collection:'User'});




let user=function(id,fname,lname,email,address1,address2,city,state,zip,country){
let userModel=
{
  userId : id,
  firstName : fname,
  lastName : lname,
  email : email,
  address1 : address1,
  address2 : address2,
  city: city,
  state: state,
  zipcode : zip,
  country : country

}
return userModel;
};


module.exports.user=user;
module.exports.userDataSchema=mongoose.model('User',userDataSchema,'User');
