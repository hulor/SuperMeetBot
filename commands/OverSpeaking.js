const { Command } = require('discord.js-commando');
const { Setters, Getters } = require('../state/SpeakerState.js');

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
		const PreviousTalker = Getters.GetCurrentSpeaker(Message.guild);
		PreviousTalker.voice.setMute(true);

		const NewSpeaker = Setters.PopNextSpeaker(Message.guild);
		if (NewSpeaker != null)
		{
			NewSpeaker.voice.setMute(false);
			Getters.GetTextChannel(Message.guild).send("It's your turn @" + NewSpeaker.user.username + ".");
		}
		else
		{
			Getters.GetTextChannel(Message.guild).send("No one wants to talk? You can ask to talk with ~AddSpeaker or raising your hand.");
		}
	}
}
