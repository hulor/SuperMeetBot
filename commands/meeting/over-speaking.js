const { Command } = require('discord.js-commando');
const { Setters, Getters } = require('../../state/SpeakerState.js');
const { StopSpeakingHelper } = require('../../helpers/SpeakerHelpers.js');
const { BotGetters } = require('../../state/BotState.js');

exports.default = class OverSpeaking extends Command
{
	constructor(Client)
	{
		super(Client, {
			name: "over-speaking",
			aliases: ["over"],
			group: "meeting",
			memberName: "over-speaking",
			description: "Call it when you have finished to talk.",
			examples: ["~over-speaking"],
			guildOnly: true,
		});
	}

	run(Message)
	{
		if (Getters.IsMeetingActiveNoPause(Message.guild) == false)
			return (Message.reply(BotGetters.GetLocalisationManager().getValue("NoMeeting")));
		if (Getters.IsMeetingActive(Message.guild) == false)
			return (Message.reply(BotGetters.GetLocalisationManager().getValue("PausedMeeting")));

		Message.react('✔️').catch(()=> Message.error("Failed to react"));
		return (StopSpeakingHelper(Message.guild, Message.member));
	}
}
