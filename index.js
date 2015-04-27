var RR = require('./lib/regulated_repeaters.js')
var BasePolicy = require('./lib/base_policy.js').BasePolicy
var SP = require('./lib/simple_policies.js')

module.exports = {

    RegulatedRepeater: RR.RegulatedRepeater,
    BasePolicy: BasePolicy,
    simplePolicies: SP

}