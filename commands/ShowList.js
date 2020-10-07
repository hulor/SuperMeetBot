const { Command } = require('discord.js-commando');
const { DisplaySpeakerList } = require('../helpers/SpeakerHelpers.js');
const { Getters } = require('../state/SpeakerState.js')

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
		if (Getters.IsMeetingActive(Message.guild) == false)
			return (Message.reply("There is no meeting going on. To create one please use ~start-meeting."));
		return (Message.reply(DisplaySpeakerList(Message.guild)));
	}
};

exports.default = ShowList;
