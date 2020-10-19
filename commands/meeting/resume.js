const { Command } = require('discord.js-commando');
const { Setters, Getters } = require('../../state/SpeakerState.js');
const { CreateMessageCollector } = require("../../helpers/SpeakerHelpers.js")

exports.default = class StartMeeting extends Command
{
	constructor(Client)
	{
		super(Client, {
			name: "resume-meeting",
			aliases: ["resume"],
			group: "meeting",
			memberName: "resume-meeting",
			description: "Resume a paused meeting",
			examples: ["~resume-meeting"],
			guildOnly: true,
			args:
			[
			],
		});
	}

	run(Message, { VoiceChannel, TextChannel })
	{
		if (Getters.IsMeetingActiveNoPause(Message.guild) == false)
			return (Message.reply(`There is no meeting going on.`));
		Setters.ResumeMeeting(Message.guild);
		for (const Member of Getters.GetVoiceChannel().members.array())
		{
			if (CurrentSpeaker == null || Member != CurrentSpeaker)
				Member.voice.setMute(true);
		}
		return (Message.reply(DisplaySpeakerList(Message.guild)).then(CreateMessageCollector).catch(() => console.log('failed to await for show-list reaction.')));
	}
};
