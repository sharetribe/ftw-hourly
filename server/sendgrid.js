const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

const sendZoomMeetingInvitation = ({ to }) => {
  const msg = {
    to: to,
    from: 'deverpham@gmail.com',
    subject: 'Savante.me zoom meeting information',
    html: `
    
        <div>
        
        </div>
    `,
  };
};
