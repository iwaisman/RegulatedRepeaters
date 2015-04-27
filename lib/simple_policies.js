var util = require('util')
var BasePolicy = require('./base_policy.js').Base


/*
  Simply repeats after _wait seconds regardless of success/failure
*/
function Repeater( _wait){
  BasePolicy.call( this,
    function(proc){},
    function(proc){},
    _wait
  )
}
util.inherits( Repeater, BasePolicy)


/*
  Immediately repeats upon failure, otherwise waits _wait seconds
*/
function ImmediateOnFail( _wait){
  BasePolicy.call( this,
    function(proc){ proc.waitTime = proc.standardWaitTime},
    function(proc){ proc.waitTime = 0 },
    _wait
  )
}
util.inherits( ImmediateOnFail, BasePolicy)

/* Demonstrates a stateful policy
  Upon failure the wait time is lengthened by _wait seconds until (_maxFactor * _wait)
  Upon success wait time is reduced to 0 (immediate repetition)
*/
function LinearBackoff( _wait){
  BasePolicy.call( this,
    function(proc){
      this.backoffFactor = 0
      proc.waitTime = 0
    },
    function(proc){
      this.backoffFactor = this.backoffFactor === this.maxFactor ? this.backoffFactor : this.backoffFactor + 1
      proc.waitTime = proc.standardWaitTime * this.backoffFactor
    },
    _wait
  )

  this.maxFactor = 10
  this.backoffFactor = 0
}
util.inherits( LinearBackoff, BasePolicy)

module.exports = {

  Repeater: Repeater,
  ImmediateOnFail: ImmediateOnFail,
  LinearBackoff: LinearBackoff

}
