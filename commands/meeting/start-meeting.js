const { Command } = require('discord.js-commando');
const { Setters, Getters } = require('../../state/SpeakerState.js');
const { CreateMessageCollector } = require("../../helpers/SpeakerHelpers.js")
const { BotGetters } = require('../../state/BotState.js');
const util = require('util');

exports.default = class StartMeeting extends Command
{
	constructor(Client)
	{
		super(Client, {
			name: "start-meeting",
			aliases: ["start", "meet"],
			group: "meeting",
			memberName: "start-meeting",
			description: "Start a new meeting in [channel]",
			examples: ["~start-meeting #channel-name", "~start-meeting channel-name"],
			guildOnly: true,
			args:
			[
				{
					key: "VoiceChannel",
					prompt: "Where should we discuss?",
					type: "channel",
				},
				{
					key: "TextChannel",
					prompt: "Where should we ask for the speech turn?",
					type: "channel",
				},
			],
		});
	}

	run(Message, { VoiceChannel, TextChannel })
	{
		if (Getters.IsMeetingActiveNoPause(Message.guild))
			return (Message.reply(util.format(BotGetters.GetLocalisationManager().getValue("MeetingAlreadyExist"), Getters.GetVoiceChannel(Message.guild).name)));
		if (Getters.IsMeetingActive(Message.guild))
			return (Message.reply(BotGetters.GetLocalisationManager().getValue("PausedMeeting")));
		if (VoiceChannel.type !== "voice")
			return (Message.reply(util.format(BotGetters.GetLocalisationManager().getValue("NoVoiceChan"), VoiceChannel.name)));
		if (TextChannel.type !== "text")
			return (Message.reply(util.format(BotGetters.GetLocalisationManager().getValue("NoTextChan"), TextChannel.name)));
		Message.delete();
		Setters.StartMeeting(Message.guild, VoiceChannel, TextChannel, Message.member);
		VoiceChannel.join();
		const CurrentSpeaker = Getters.GetCurrentSpeaker(Message.guild);
		for (const Member of VoiceChannel.members.array())
		{
			if (CurrentSpeaker == null || Member != CurrentSpeaker)
				Member.voice.setMute(true);
		}
		Getters.GetTextChannel(Message.guild).send(util.format(BotGetters.GetLocalisationManager().getValue("MeetingStart"), TextChannel.name)).then(CreateMessageCollector).catch(() => console.log('failed to await for start meeting message.'));
	}
};
