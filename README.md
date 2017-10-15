# Home Automation - Notifications API
Back-end server that handles outgoing communications. Main functions are:
* It sends emails using [Mailgun][mailgun] if garage door is left open, garage door is opening or motion is detected while alarm is armed.
* It sends text messages using [Twilio][twilio] if one of the previous conditions are met.
* It makes phone calls using [Twilio][twilio] if one of the previous conditions are met.

[![JavaScript Style Guide][standard-image]][standard-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![DevDependencies][dependencies-dev-image]][dependencies-dev-url]

I suggest you first [read][overview-url] about the different components of the home automation application.  
This will help you understand better the general architecture and different functions of the system.

## Installation instructions
Click [here][server-installation-instruction-url] and follow the installation instructions for the server micro-service, before moving to the next step.

## Environment variables (configuration)

__AUTH\_PUBLIC\_KEY__ (required): content of auth server's publickey.  
__DATABASE\_URL__ (required):  url to postgres database.  Default: `postgres://postgres:@localhost/home_automation`  
__KEEP\_HISTORY\_IN\_DAYS__ (required): days to keep history in database.  Default: `30`  
__NODE\_ENV__ (required): set up the running environment.  Default: `production`.  `production` will enforce encryption using SSL and other security mechanisms.  
__POSTGRESPOOLMIN__ (required): postgres pool minimum size.  Default: `2`  
__POSTGRESPOOLMAX__ (required): postgres pool maximum size.  Default: `10`  
__POSTGRESPOOLLOG__ (required): postgres pool log. Values: `true`/`false`. Default: `true`  

__Mailgun integration__ - this integration is optional. In order to activate it, all the required environment variables below must be set.  
    * __MAILGUN\_API\_KEY__ (required): mailgun api key.  
    * __MAILGUN\_DOMAIN__ (required): domain name validated and used by mailgun. Example: `my-website.com`  
    * __EMAIL\_ALERT\_SENDER__ (required): Alert sender's email. Example: `sender@mydomain.com`  
    * __SEND\_EMAIL__ (required): defines whether email alerts should be sent.  Values: `true` / `false`.  Default: `true`  

__Twilio integration__ - this integration is optional. In order to activate it, all the required environment variables below must be set.
    * __TWILIO\_ACCOUNT\_SID__ (required): twilio account sid.  
    * __TWILIO\_AUTH\_TOKEN__ (required): twilio auth token.  
    * __TWILIO\_FROM__ (required): phone number that will be used to send SMS or make phone calls.  
    * __SEND\_SMS__ (required): defines whether sms alerts should be sent.  Values: `true` / `false`.  Default: `true`  
    * __MAKE\_CALL__ (required): defines whether phone call alerts should be made.  Values: `true` / `false`.  Default: `true`  

### License
[AGPL-3.0](https://spdx.org/licenses/AGPL-3.0.html)

### Author
[Oron Nadiv](https://github.com/OronNadiv) ([oron@nadiv.us](mailto:oron@nadiv.us))

[dependencies-image]: https://david-dm.org/OronNadiv/notifications-api/status.svg
[dependencies-url]: https://david-dm.org/OronNadiv/notifications-api
[dependencies-dev-image]: https://david-dm.org/OronNadiv/notifications-api/dev-status.svg
[dependencies-dev-url]: https://david-dm.org/OronNadiv/notifications-api?type=dev
[travis-image]: http://img.shields.io/travis/OronNadiv/notifications-api.svg?style=flat-square
[travis-url]: https://travis-ci.org/OronNadiv/notifications-api
[coveralls-image]: http://img.shields.io/coveralls/OronNadiv/notifications-api.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/OronNadiv/notifications-api
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com

[twilio]: https://twilio.com
[mailgun]: https://mailgun.com

[overview-url]: https://oronnadiv.github.io/home-automation
[client-installation-instruction-url]: https://oronnadiv.github.io/home-automation/#installation-instructions-for-the-raspberry-pi-clients
[server-installation-instruction-url]: https://oronnadiv.github.io/home-automation/#installation-instructions-for-the-server-micro-services
[private-public-keys-url]: https://oronnadiv.github.io/home-automation/#generating-private-and-public-keys

[alarm-url]: https://github.com/OronNadiv/alarm-system-api
[auth-url]: https://github.com/OronNadiv/authentication-api
[camera-url]: https://github.com/OronNadiv/camera-api
[garage-url]: https://github.com/OronNadiv/garage-door-api
[notifications-url]: https://github.com/OronNadiv/notifications-api
[storage-url]: https://github.com/OronNadiv/storage-api
[ui-url]: https://github.com/OronNadiv/home-automation-ui
