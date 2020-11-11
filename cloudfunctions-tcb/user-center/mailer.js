'use strict';

const nodemailer = require("nodemailer");
module.exports = function(email) {
	const mailer = {
		host: "smtp.163.com",
		ports: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: 'zjoin_server@163.com', // generated ethereal user
			pass: 'AKROAEFTNEKHQNRE', // generated ethereal password
		},
	};
	const randomStr = '00000' + Math.floor(Math.random() * 1000000);
	const code = randomStr.substring(randomStr.length - 6);
	const htmlTemplate =
		`
						 <div style="background-color: #f4f4f4;height: 100vh;padding-top:10vw;width: 100vw;">
						        <div style="min-height: 12vh;width: 80vw;margin:0 10vw;background-color: #fff;border-radius: 20px;">
						            <div style="padding: 20px; display: flex;align-items: center;">
						                <img style="height: 40px;width: 40px; "
						                    src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-crypto2server/87fe42b0-f987-11ea-8bd0-2998ac5bbf7e.png"
						                    alt="">
						                <h2 style="margin-left: 20px;font-weight: bold;">Z JOIN</h2>
						            </div>
						            <div
						                style="padding: 20px; display: flex;align-items: center;text-indent: 2em;font-weight: bold; font-size: 18px;">
						                <span style="word-break: break-all;padding-bottom: 7vw;">
						                    Welcome to z join, you code is :&nbsp;<code
						                        style="text-indent: 0; background-color: #eee;margin:'0px 7px'; padding: 3px 10px;border-radius: 3px;">${code}</code>&nbsp;
						                    . if
						                    you don't send, please ignore!
						                </span>
						            </div>
						        </div>
						    </div>
						`;
	return new Promise(async (resolve, reject) => {
		let testAccount = await nodemailer.createTestAccount();
		const transporter = nodemailer.createTransport(mailer);
		transporter.sendMail({
				from: 'zjoin_server@163.com', // sender address
				to: email, // list of receivers
				subject: "Z JOIN register", // Subject line
				html: htmlTemplate, // html body
			})
			.then((res) => resolve({
				...res,
				code
			}))
			.catch(err => reject(err))
	})
}
