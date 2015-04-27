var _ = require('lodash')
var Promise = require('bluebird')
var RR = require('../lib/regulated_repeaters.js')
var Policies = require('../lib/simple_policies.js')

describe( 'Repeaters', function() {

  var simple = new Policies.Repeater( 1)

  it( 'should fail on bad _process', function(done) {
    var actual = new RR.RegulatedRepeater( "NAME", 7, simple)
    actual.should.be.an.instanceOf(Error)
    actual.message.should.startWith( "Must define process")

    done()
  })

  it( 'should fail on bad _policy', function(done) {
    var actual = new RR.RegulatedRepeater( "NAME", function(){}, 7)

    actual.should.be.an.instanceOf(Error)
    actual.message.should.startWith( "_policy must inherit")

    done()
  })

  var thriceCount = 0
  var thrice = function(proc, cb){
    if( thriceCount > 2) {
      proc.stop()
      cb()
    }
    return Promise.resolve( thriceCount++)
  }
  it( 'should actually run', function(done) {   this.timeout( 20000)

    var end = function(){
      actual.stop()
      thriceCount.should.be.equal( 3)
      done()
    }
    var actual = new RR.RegulatedRepeater( "NAME", _.partial( thrice, _, end), simple, true)

    actual.start()
  })

})