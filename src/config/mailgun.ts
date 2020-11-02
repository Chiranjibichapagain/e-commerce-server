var api_key = '4c0f80a3e94a3759cd2332a6386ed01b-2fbe671d-af985bf6'

var domain = 'sandboxd6efefb904e44202a135d0df8259d356.mailgun.org'
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain })

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
