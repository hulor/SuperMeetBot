const { Command } = require('discord.js-commando');
const { Setters, Getters } = require('../../state/SpeakerState.js');
const { AddSpeakerOnMessageHelper } = require("../../helpers/SpeakerHelpers.js");
const { BotGetters } = require('../../state/BotState.js');

exports.default = class AddSpeaker extends Command
{
	constructor(Client)
	{
		super(Client, {
			name: "add-speaker",
			aliases: ["✋", "add"],
			group: "meeting",
			memberName: "add-speaker",
			description: "Add a new speaker to next speaker list",
			examples: ["~Add-Speaker @Speaker1234", "~Add-Speaker Speaker"],
			guildOnly: true,
			args:
			[
				{
					key: "Speaker",
					prompt: "Who want to speak?",
					type: "member",
					default: "",
				},
			],
		});
	}

	run(Message, { Speaker })
	{
		if (Getters.IsMeetingActiveNoPause(Message.guild) == false)
			return (Message.reply(BotGetters.GetLocalisationManager().getValue("NoMeeting")));
		if (Getters.IsMeetingActive(Message.guild) == false)
			return (Message.reply(BotGetters.GetLocalisationManager().getValue("PausedMeeting")));
		AddSpeakerOnMessageHelper(Message, Speaker);
	}
};