const { Command } = require('discord.js-commando');
const { Setters, Getters } = require('../../state/SpeakerState.js');
const { CreateMessageCollector, DisplaySpeakerList } = require("../../helpers/SpeakerHelpers.js")
const { BotGetters } = require('../../state/BotState.js');

exports.default = class ResumeMeeting extends Command
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
			return (Message.reply(BotGetters.GetLocalisationManager().getValue("NoMeeting")));
		Message.react('✔️').catch(()=> Message.error("Failed to react"));
		Setters.ResumeMeeting(Message.guild);
		const CurrentSpeaker = Getters.GetCurrentSpeaker(Message.guild);
		for (const Member of Getters.GetVoiceChannel(Message.guild).members.array())
		{
			if (Member.user.bot == true)
				continue;
			if (CurrentSpeaker == null || Member != CurrentSpeaker)
				Member.voice.setMute(true);
		}
		return (Message.reply(DisplaySpeakerList(Message.guild)).then(CreateMessageCollector).catch(() => console.log('failed to await for show-list reaction.')));
	}
};
