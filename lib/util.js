var util = require('util');
var moment = require('moment')

var logMsg = function( _name, _msg){
  console.log( "["+moment.utc().format()+"] "+_name+" : "+_msg);
}


var def = function( arg, def){
  return (typeof arg !== 'undefined') ? arg : def
};

var I = function(x){ return util.inspect(x, false, null)}


module.exports = {

  logMsg: logMsg,
  def: def,
  I: I

}

