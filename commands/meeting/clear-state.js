const { Command } = require('discord.js-commando');
const { Setters } = require('../../state/SpeakerState.js');

exports.default = class Clear extends Command
{
	constructor(Client)
	{
		super(Client, {
			name: "clear",
			group: "meeting",
			memberName: "clear",
			description: "Clear meeting state in case of trouble.",
			examples: ["~clear"],
			guildOnly: true,
		});
	}

	run(Message)
	{
		Setters.Clear(Message.guild);
		Message.reply("Cleared.");
	}
}