const { Command } = require('discord.js-commando');
const { Setters, Getters } = require('../../state/SpeakerState.js');
const { CreateMessageCollector } = require("../../helpers/SpeakerHelpers.js")

exports.default = class Pause extends Command
{
	constructor(Client)
	{
		super(Client, {
			name: "pause-meeting",
			aliases: ["pause"],
			group: "meeting",
			memberName: "pause-meeting",
			description: "Pause the currently going meeting",
			examples: ["~pause-meeting"],
			guildOnly: true,
			args:
			[
			],
		});
	}

	run(Message)
	{
		if (Getters.IsMeetingActive(Message.guild) == false)
			return (Message.reply(`There is no meeting going on.`));
		Setters.PauseMeeting(Message.guild);
		for (const Member of Getters.GetVoiceChannel().members.array())
		{
			Member.voice.setMute(false);
		}
	}
};
