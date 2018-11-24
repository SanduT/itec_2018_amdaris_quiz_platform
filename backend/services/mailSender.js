const handlebars = require("handlebars");
const fs = require("fs");
const nodemailer = require("nodemailer");
const path = require("path");
const config = require("../config");

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "mail.webamboos.ro",
  port: 587,
  secure: false, // true for 465, false for other ports
  requireTLS: true,
  auth: {
    user: "quizzard@webamboos.ro",
    pass: "quizzard2018"
  }
});

// verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("[SMTP-INFO] Server is ready to take our messages");
  }
});

const sendActions = {
  sendInviteEmail: user => {
    const html = fs.readFileSync(
      path.join(__dirname, "/templates/welcome_email.html")
    );
    const template = handlebars.compile(html.toString());

    const htmlToSend = template({
      name: user.name || "User",
      action_url: `${config.origin.url}/activate/${user.accessToken}`,
      support_email: "quizzard@webamboos.ro"
    });

    let mailOptions = {
      from: "The Quizzard Team <quizzard@webamboos.ro>",
      to: user.email,
      subject: "You shall not pass! without validating your email.",
      html: htmlToSend
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return reject(error);
        }
        return resolve("[SMTP-INFO] Message sent: " + info.messageId);
      });
    }).then(message => {
      return Promise.resolve(message);
    });
  }
};

module.exports = sendActions;
