/*
  _success := function which sets the waitTime upon success
  _failure := function which sets the waitTime upon failure
  _wait := given in seconds
*/
function Base( _success, _failure, _wait){
  this.success = _success
  this.failure = _failure
  this.standardWaitTime = _wait * 1000
}


module.exports = {

  Base: Base,

}
