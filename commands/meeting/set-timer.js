const { Command } = require('discord.js-commando');
const { Setters, Getters } = require('../../state/SpeakerState.js');
const { BotGetters } = require('../../state/BotState.js');

exports.default = class SetTimer extends Command
{
	constructor(Client)
	{
		super(Client, {
			name: "set-timer",
			aliases: [],
			group: "meeting",
			memberName: "set-timer",
			description: "Set the maximum speak duration. Set it to 00 to have infinite time.",
			examples: ["~set-timer 10:00", "~set-timer mm:ss"],
			guildOnly: true,
			args:
			[
				{
					key: "Duration",
					prompt: "How long should we talk?",
					type: "string",
					default: "00:00",
				},
			],
		});
	}

	run(Message, { Duration })
	{
		if (Getters.IsMeetingActive(Message.guild) == false)
			return (Message.reply(BotGetters.GetLocalisationManager().getValue("NoMeeting")));
		const TimeStr = Duration.split(':');
		var Time = Math.abs(parseInt(TimeStr[TimeStr.length - 1]) * 1000); // seconds

		if (TimeStr.length >= 3)
		{
			Time += Math.abs(parseInt(TimeStr[TimeStr.length - 3]) * 60 * 60 * 1000); // hours
		}
		if (TimeStr.length >= 2)
		{
			Time += Math.abs(parseInt(TimeStr[TimeStr.length - 2]) * 60 * 1000); // minutes
		}

		Setters.SetSpeakDuration(Message.guild, Time);

		Message.react('✔️').catch(()=> Message.error("Failed to react"));
	}
};