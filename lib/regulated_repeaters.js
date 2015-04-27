var moment = require('moment');
var rUtil = require('./util.js')
var BasePolicy = require('./base_policy.js').Base

/* RegulatedProcess

     _process := function that returns a Promise, takes the repeater as an argument
     _policy := a Policy
*/
function RegulatedRepeater( _name, _process, _policy, verbose){
  if( typeof _process != 'function') {
    return new Error( "Must define process as a function (that returns a promise).")
  }
  if( !BasePolicy.prototype.isPrototypeOf( _policy)) {
    return new Error('_policy must inherit from BasePolicy.')
  }

  this.name = _name;
  this.process = _process
  this.policy = _policy
  this.verbose = rUtil.def( verbose, false)

  this.standardWaitTime = this.policy.standardWaitTime
  this.waitTime = this.standardWaitTime

  this.started = false

  this.lastRunStart = moment.utc()
  this.lastRunStop = moment.utc()
  this.sinceLastStop = moment.utc().valueOf() - this.lastRunStart.valueOf()
  this.sinceLastStart = moment.utc().valueOf() - this.lastRunStart.valueOf()
  this.lastSuccess = true

  var self = this; // for closure
  this.next = function(){
    var recurser = arguments.callee
    var time = moment.utc()
    self.sinceLastStop = time.valueOf() - self.lastRunStop.valueOf()
    self.sinceLastStart = time.valueOf() - self.lastRunStart.valueOf()
    self.lastRunStart = time

    //if(verbose) console.log( self.name, "sinceLastStart: "+self.sinceLastStart+" sinceLastStop: "+self.sinceLastStop+" starting...")

    self.process( self)
    .then( function(v){
      self.lastSuccess = true;
      self.policy.success(self);
      if(this.verbose) rUtil.logMsg( self.name," SUCCEEDED with: "+ rUtil.I(v));
    })
    .catch( function(v){
      self.lastSuccess = false;
      self.policy.failure(self);
      if(this.verbose) rUtil.logMsg( self.name, " FAILED (waiting for "+self.waitTime+") with: "+ rUtil.I(v)+"\n"+v.stack);
    })
    .finally( function(){
      self.lastRunStop = moment.utc();
      self.timeToken = setTimeout( recurser, self.waitTime);
    })
  }
}

RegulatedRepeater.prototype.start = function(){
  if( this.started) return new Error( "Already started!")

  this.next()
  this.started = true

  if( this.verbose) console.log( "Started "+this.name)
}

RegulatedRepeater.prototype.stop = function(){

  if( !this.started) return new Error( "Not started!")

  clearTimeout( this.timeToken)
  this.started = false

  if( this.verbose) console.log( "Stopped "+this.name)
}

module.exports = {

  RegulatedRepeater: RegulatedRepeater

}
