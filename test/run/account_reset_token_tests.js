/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var test = require('tap').test
var crypto = require('crypto')
var log = { trace: function() {} }

var tokens = require('../../tokens')(log)
var AccountResetToken = tokens.AccountResetToken

var ACCOUNT = {
  uid: 'xxx'
}


test(
  're-creation from tokendata works',
  function (t) {
    var token = null;
    AccountResetToken.create(ACCOUNT)
      .then(
        function (x) {
          token = x
        }
      )
      .then(
        function () {
          return AccountResetToken.fromHex(token.data, ACCOUNT)
        }
      )
      .then(
        function (token2) {
          t.equal(token.data, token2.data)
          t.equal(token.id, token2.id)
          t.equal(token.authKey, token2.authKey)
          t.equal(token.bundleKey, token2.bundleKey)
          t.equal(token.uid, token2.uid)
        }
      )
      .done(
        function () {
          t.end()
        },
        function (err) {
          t.fail(JSON.stringify(err))
          t.end()
        }
      )
  }
)


test(
  'bundle / unbundle of account data works',
  function (t) {
    var token = null;
    var wrapKb = crypto.randomBytes(32).toString('hex')
    var verifier = crypto.randomBytes(256).toString('hex')
    AccountResetToken.create(ACCOUNT)
      .then(
        function (x) {
          token = x
          return token.bundleAccountData(wrapKb, verifier)
        }
      )
      .then(
        function (b) {
          return token.unbundleAccountData(b)
        }
      )
      .then(
        function (ub) {
          t.equal(ub.wrapKb, wrapKb)
          t.equal(ub.verifier, verifier)
        }
      )
      .done(
        function () {
          t.end()
        },
        function (err) {
          t.fail(JSON.stringify(err))
          t.end()
        }
      )
  }
)
