const { Command } = require('discord.js-commando');
const { Setters, Getters } = require('../../state/SpeakerState.js');
const { CreateMessageCollector } = require("../../helpers/SpeakerHelpers.js")
const { BotGetters } = require('../../state/BotState.js');

exports.default = class PauseMeeting extends Command
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
			return (Message.reply(BotGetters.GetLocalisationManager().getValue("NoMeeting")));
		Message.react('✔️').catch(()=> Message.error("Failed to react"));
		Setters.PauseMeeting(Message.guild);
		for (const Member of Getters.GetVoiceChannel(Message.guild).members.array())
		{
			Member.voice.setMute(false);
		}
	}
};
