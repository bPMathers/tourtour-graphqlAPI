import nodemailer from 'nodemailer';

const sendEmailToAdmin = (info) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tourcues@gmail.com',
      pass: process.env.ADMIN_EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: 'tourcues@gmail.com',
    to: 'tourcues@gmail.com, benjaminproulxmathers@gmail.com',
    subject: 'New TourCues user created',
    text: `name: ${info.name}, email: ${info.email}`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}

export default sendEmailToAdmin