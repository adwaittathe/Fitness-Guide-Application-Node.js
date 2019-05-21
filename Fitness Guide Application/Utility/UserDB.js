
let getUsers=function(db)
{


  return new Promise((resolve, reject) => {
      db.find({}).then(data => {
        resolve(data);
      }).catch(err => { return reject(err); })
    })



};

let getUser=function(db, userId ,password)
{


  return new Promise((resolve, reject) => {
      db.findOne({email:userId , password:password}).then(data => {
        resolve(data);
      }).catch(err => { return reject(err); })
    })



};

module.exports.getUsers=getUsers;
module.exports.getUser=getUser;
