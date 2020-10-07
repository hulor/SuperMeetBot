const { Command } = require('discord.js-commando');
const { Setters, Getters } = require('../state/SpeakerState.js');

exports.default = class StopMeeting extends Command
{
	constructor(Client)
	{
		super(Client, {
			name: "stop-meeting",
			group: "meeting",
			memberName: "stop-meeting",
			description: "Stop an ongoing meeting",
			examples: ["~stop-meeting"],
			guildOnly: true,
			args:
			[
				{
					key: "Force",
					prompt: "Do you really want to kill this meeting?",
					type: "boolean",
					default: false,
				},
			]
		});
	}

	run(Message)
	{
		if (Getters.IsMeetingActive(Message.guild) == false)
			return (Message.reply("There is no meeting to stop."));
		if (Getters.GetAllSpeakers(Message.guild).length != 0 && Force == false)
		{
			return (Message.reply("This meeting is not over yet. There is still people waiting to talk."));
		}
		const VoiceChannel = Getters.GetVoiceChannel(Message.guild);
		for (const Member of VoiceChannel.members.array())
		{
			Member.voice.setMute(false);
		}
		VoiceChannel.leave();
		Message.delete();
		Setters.StopMeeting(Message.guild);
		return (Message.reply(`Stopped a meeting in ${VoiceChannel.name}.`));
	}
}