import { MAILGUN_DOMAIN, MAILGUN_API_KEY } from '../util/secrets'

var mailgun = require('mailgun-js')({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN })

const mailer = (email: any, token: any) => {
  var data = {
    from: 'Chiranjibi <chiranjibichapagain@gmail.com>',
    to: email,
    subject: 'Change Password',
    text: `To change the password click in this link => http://localhost:3000/changepass/${token}`,
  }

  mailgun.messages().send(data, function (error: any, body: any) {
    console.log(body)
  })
}

export default mailer
