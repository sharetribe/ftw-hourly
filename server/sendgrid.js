const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

const sendZoomMeetingInvitation = async ({ to, zoomLink, password }) => {
  const msg = {
    to: to,
    from: 'deverpham@gmail.com',
    subject: 'Savante.me zoom meeting information',
    html: `
        <div>
            <a href ="${zoomLink}">${zoomLink}</a>
            <p>Password: ${password}</p>
        </div>
    `,
  };
  await sgMail.send(msg);
};

module.exports = { sendZoomMeetingInvitation };
