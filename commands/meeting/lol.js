const { Command } = require('discord.js-commando');
const { BotGetters, BotSetters } = require('../../state/BotState.js');

class Lol extends Command
{
	constructor(client)
	{
		super(client, {
			name: "lol",
			aliases: [],
			group: "meeting",
			memberName: "lol",
			description: "fun time",
			examples: ["~lol"],
			ownerOnly: true,
		});
	}

	run(Message)
	{
        BotSetters.SetLol(!BotGetters.GetLol());
	}
};

exports.default = Lol;
