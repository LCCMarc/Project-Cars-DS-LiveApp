/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var _ = require('lodash');

module.exports = {

  profile: function(req, res) {
    User
      .findOne(req.session.me)
      .populate('drivers')
      .exec(function(err, user) {
        if (err) return res.negotiate(err);

        res.view('User/profile', {
          user: user,
          flash: {
            content: ''
          }
        });
      });
  },

  /**
   * `UserController.logout()`
   */
  logout: function(req, res) {
    var user = req.session;
    sails.sockets.blast({
      msg: user.username + ' Disconnected',
      class: 'alert-danger'
    });

    req.session.me = req.session.user = null;

    // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
    // send a simple response letting the user agent know they were logged out
    // successfully.
    if (req.wantsJSON) return res.ok('Logged out successfully!');

    res.redirect('/');
  }

};
