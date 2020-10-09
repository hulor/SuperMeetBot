const { Command } = require('discord.js-commando');
const { Setters, Getters } = require('../../state/SpeakerState.js');
const { StopSpeakingHelper } = require('../../helpers/SpeakerHelpers.js');

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
		if (Getters.IsMeetingActive(Message.guild) == false)
			return (Message.reply("There is no meeting."));
		if (Getters.GetCurrentSpeaker(Message.guild) != Message.member)
			return (Message.reply("lol."));
		return (StopSpeakingHelper(Message.guild, Message.member));
	}
}
