
let addItemRating = function(db,userId,item , rating, madeIt)
{
  return new Promise((resolve, reject) => {
  db.findOneAndUpdate({ $and: [{ userId:userId}, { 'item.itemCode': item.itemCode }] },
       { $set: {userId: userId, item:item, rating:rating, madeIt:madeIt }},
       { }, function (err, data) {
         console.log(data);
         resolve(data);
       }).catch(err => {
          console.log(err);
          return reject(err); });
  });
}

let addMadeIt = function(db,userId,item , rating, madeIt)
{
  return new Promise((resolve, reject) => {
  db.findOneAndUpdate({ $and: [{ userId:userId}, { 'item.itemCode': item.itemCode }] },
       { $set: {userId: userId, item:item, rating:rating, madeIt:madeIt }},
       { }, function (err, data) {
         console.log(data);
         resolve(data);
       }).catch(err => {
          console.log(err);
          return reject(err); });
  });
}



module.exports.addItemRating=addItemRating;
module.exports.addMadeIt=addMadeIt;
