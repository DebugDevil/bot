const winston = require("winston");
const chalk 	= require("chalk");
const moment 	= require("moment");
require("winston-daily-rotate-file");

const config = require("./../Configurations/config.js");

module.exports = class Console {
	constructor(type) {
		return new winston.Logger({
			transports: [
				new winston.transports.Console({
					level: config.consoleLevel,
					colorize: true,
					/* Shard-based labels?
					 * Could have something like GAB Master Process for that, or GAB Shard?
					 * We can then make a special winston for master sharder, and log them separately
					 */
					label: `GAwesomeBot | ${type === "master" ? "Master" : type}`,
					timestamp: () => `[${chalk.grey(moment().format("HH:mm:ss"))}]`,
				}),
				new winston.transports.DailyRotateFile({
					level: "silly",
					colorize: false,
					datePattern: `dd-MM-yyyy.`,
					prepend: true,
					json: false,
					// eslint-disable-next-line no-unused-vars
					formatter: ({ level, message = "", meta = {}, formatter, depth, colorize }) => {
						const ts = moment().format("DD-MM-YYYY HH:mm:ss");
						const obj = Object.keys(meta).length ? `\n\t${meta.stack ? meta.stack : require("util").inspect(meta, false, depth || 2, colorize)}` : ``;
						return `(${ts}) (${level.toUpperCase()}) (${type === "master" ? "MASTER" : type.toUpperCase()}) ${chalk.stripColor(message)} ${obj}`;
					},
					filename: require("path").join(process.cwd(), `logs/gawesomebot.log`),
				}),
				new winston.transports.File({
					level: "silly",
					json: true,
					colorize: false,
					filename: require("path").join(process.cwd(), `logs/verbose.gawesomebot.log`),
				}),
			],
		});
	}
};