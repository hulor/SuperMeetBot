const { Command } = require('discord.js-commando');
const { DisplaySpeakerList, CreateMessageCollector } = require('../../helpers/SpeakerHelpers.js');
const { Getters } = require('../../state/SpeakerState.js');
const { BotGetters } = require('../../state/BotState.js');

class ShowList extends Command
{
	constructor(client)
	{
		super(client, {
			name: "show-list",
			aliases: ["show"],
			group: "meeting",
			memberName: "show-list",
			description: "Show all next speakers",
			examples: ["~Show-List"],
			guildOnly: true,
		});
	}

	run(Message)
	{
		Message.delete();
		if (Getters.IsMeetingActiveNoPause(Message.guild) == false)
			return (Message.reply(BotGetters.GetLocalisationManager().getValue("NoMeeting")));
		return (Message.reply(DisplaySpeakerList(Message.guild)).then(CreateMessageCollector).catch(() => console.log('failed to await for show-list reaction.')));
	}
};

exports.default = ShowList;
