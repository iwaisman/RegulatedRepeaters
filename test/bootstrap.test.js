require('should')

// Global before hook
before(function (done) {
  this.timeout( 20000)

  done()
});

// Global after hook
after(function (done) {
  done()
});
