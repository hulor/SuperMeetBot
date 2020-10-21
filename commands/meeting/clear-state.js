const { Command } = require('discord.js-commando');
const { Setters } = require('../../state/SpeakerState.js');
const { BotGetters } = require('../../state/BotState.js');

exports.default = class Clear extends Command
{
	constructor(Client)
	{
		super(Client, {
			name: "clear-state",
			group: "meeting",
			memberName: "clear-state",
			description: "Clear meeting state in case of trouble.",
			examples: ["~clear-state"],
			guildOnly: true,
		});
	}

	run(Message)
	{
		Setters.Clear(Message.guild);
		Message.reply(BotGetters.GetLocalisationManager().getValue("Cleared."));
	}
}