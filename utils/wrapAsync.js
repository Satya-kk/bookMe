// module.exports = (fn) => {
//   return (req, res, next) => {
//     fn(req, res).catch(next);
//   };
// };

// utils/wrapAsync.js
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res,next).catch(next); // Only req,res, errors go to Express
  };
};
