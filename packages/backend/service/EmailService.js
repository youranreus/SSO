/**
 * @author 季悠然
 * @date 2022-05-10
 */

const EmailCaptcha = require("../models/EmailCaptcha");
const { Result, md5Crypto } = require("../utils");
const { mailConfig, MINUTE } = require("../config");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const EmailCaptchaConfig = {
	host: mailConfig.host,
	port: mailConfig.port,
	auth: {
		user: mailConfig.user,
		pass: mailConfig.pass,
	},
};

/**
 * 校验邮箱验证码
 * @param captcha
 * @param email
 * @returns {Promise<Result>}
 */
async function validate(captcha, email) {
	const ec = await EmailCaptcha.findOne({ where: { captcha: captcha } });
	if (ec === null || ec.email !== email) return new Result("无效验证码", 400);
	else if (Math.abs(new Date(ec.updatedAt).getTime() - Date.now()) > MINUTE * 5)
		return new Result("验证码已过期", 400);

	try {
		return new Result("success", 200, { capt: ec });
	} catch (e) {
		return new Result(e + "", 500);
	}
}

/**
 * 删除验证码
 * @param captcha
 * @returns {Promise<Result>}
 */
async function destroy(captcha) {
	try {
		await captcha.destroy();
		return new Result("success", 200);
	} catch (e) {
		return new Result(e + "", 500);
	}
}

/**
 * 发送注册验证码
 * @param email
 * @returns {Promise<Result>}
 */
async function sendReg(email) {
	try {
        User.sync();
		if ((await User.findAndCountAll({ where: { email } })).count !== 0)
			return new Result("邮箱已被注册", 400);

		return await send(email, "注册SZTU-ACM账号");
	} catch (e) {
        return new Result(e.message, 500);
	}
}

/**
 * 发送修改密码邮箱
 * @param email
 * @returns {Promise<Result>}
 */
async function sendReset(email) {
	if ((await User.findAndCountAll({ where: { email } })).count === 0)
		return new Result("邮箱不存在", 400);

	return await send(email, "修改密码");
}

/**
 * 发送邮件
 * @param email
 * @param message
 * @returns {Promise<Result>}
 */
async function send(email, message) {
	// 生成验证码
	const capt = md5Crypto(`${email}-${Date.now().toString()}`).slice(0, 8);
	const EmailOption = {
		from: {
			name: mailConfig.name,
			address: mailConfig.user,
		},
		to: email,
		subject: "请验证您的邮箱",
		html: `<p>你好！${email}</p>
              <p>您正在${message}</p>
              <p>注册验证码为：${capt}</P>
              <P>有效时间为5分钟</p>`,
	};
	const transporter = nodemailer.createTransport(EmailCaptchaConfig);

    EmailCaptcha.sync();
	const ec = await EmailCaptcha.findOne({ where: { email } });
	if (ec !== null) {
		if (Math.abs(new Date(ec.updatedAt).getTime() - Date.now()) < MINUTE)
			return new Result("太频繁辣", 400);

		try {
			ec.captcha = capt;
			await transporter.sendMail(EmailOption);
			await ec.save();
			return new Result("success", 200);
		} catch (e) {
			return new Result(e + "", 500);
		}
	} else {
		try {
			await transporter.sendMail(EmailOption);
			await EmailCaptcha.create({ email, captcha: capt });
			return new Result("success", 200);
		} catch (e) {
			return new Result(e + "", 500);
		}
	}
}

module.exports = {
	sendReg,
	validate,
	sendReset,
	destroy,
};
