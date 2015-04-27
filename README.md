# RegulatedRepeaters

This package provides base classes to create objects which repeat a give process.
The scheduling of the repetition is encoded in a Policy which can be arbitrarily complex.

For example, the definition of a schedule with a linear backoff on failure look like this:

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
