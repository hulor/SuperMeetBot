const { Command } = require('discord.js-commando');
const { Setters, Getters } = require('../../state/SpeakerState.js');
const { BotGetters } = require('../../state/BotState.js');
const util = require('util');

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

	run(Message, Force)
	{
		if (Getters.IsMeetingActive(Message.guild) == false)
			return (Message.reply(BotGetters.GetLocalisationManager().getValue("NoMeeting")));
		if (Getters.GetAllSpeakers(Message.guild).length != 0 && Force == false)
		{
			return (Message.reply(BotGetters.GetLocalisationManager().getValue("MeetingNotFinished")));
		}
		const VoiceChannel = Getters.GetVoiceChannel(Message.guild);
		for (const Member of VoiceChannel.members.array())
		{
			Member.voice.setMute(false);
		}
		VoiceChannel.leave();
		Message.delete();
		Setters.StopMeeting(Message.guild);
		return (Message.reply(util.format(BotGetters.GetLocalisationManager().getValue("MeetingFinished"), VoiceChannel.name)));
	}
}