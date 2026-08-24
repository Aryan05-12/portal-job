const nodemailer = require("nodemailer");

const SendEmai = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
            
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log("Mail Sent:", info.response);

  } catch (error) {
    console.log("Mail Error:", error);
    throw error;
  }
};

module.exports = SendEmai;