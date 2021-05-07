const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

const sendZoomMeetingInvitation = async ({
  to,
  zoomLink,
  password,
  start,
  providerName,
  userName,
}) => {
  try {
    const msg = {
      to: to,
      from: 'info@savante.me',
      subject: 'Your Savante appointment is confirmed! ',
      html: `
        <div>
          <p>To begin the online consultation, please click on the Zoom meeting link below on the day and time of the appointment.</p>
          <p>Topic: Savante Appointment between ${providerName} and ${userName}</p>
          <p>Time: <b>${start}</b></p>
          <p>Join Zoom Meeting</p>
          <a href="${zoomLink}" clicktracking="off"><b>${zoomLink}</b></a>
          <p>Passcode: <b>${password}</b></p>   
          <p>Savante Team</p>
        </div>
    `,
    };
    await sgMail.send(msg);
  } catch (err) {
    console.log('send mail error', err);
  }
};

module.exports = { sendZoomMeetingInvitation };
