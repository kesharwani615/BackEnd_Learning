import nodemailer from 'nodemailer'

const send_Mail=(req, res) => {
    const { to, subject, text } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "kesharwanishivam615@gmail.com",
            pass:"govx ecmn rseo gfbq"

        }
    });

    let mailOptions = {
        from: `"Your Name" <kesharwanishivam615@gmail.com>`,
        to: to,
        subject: subject,
        text: text,
        html: `<p>${text}</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
}

export {send_Mail};
