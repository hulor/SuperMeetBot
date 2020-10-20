const { Command } = require('discord.js-commando');
const { Setters, Getters } = require('../../state/SpeakerState.js');

exports.default = class RemainingTime extends Command
{
	constructor(Client)
	{
		super(Client, {
			name: "remaining-time",
			aliases: ["remain"],
			group: "meeting",
			memberName: "remaining-time",
			description: "Retrieve the remaining time for the current speaker.",
			examples: ["~remaining-time"],
			guildOnly: true,
			args:
			[
				{
					key: "Duration",
					prompt: "How long should we talk?",
					type: "string",
					default: "00:00",
				},
			],
		});
	}

	run(Message, { Duration })
	{
		if (Getters.IsMeetingActive(Message.guild) == false)
			return (Message.reply("There is no meeting going on. To create one please use ~start-meeting."));
		if (Getters.GetSpeakStartTime(Message.guild) == null)
			return (Message.reply("There is no one talking right now."));
		const TimeDelta = Date.now() - Getters.GetSpeakStartTime(Message.guild);
		const MillisecondDelta = Getters.GetSpeakDuration(Message.guild) - TimeDelta;
		if (MillisecondDelta <= 0)
		{
			return (Getters.GetTextChannel(Message.guild).send("<@" + Getters.GetCurrentSpeaker(Message.guild) + "> has exceed the speak maximal duration."));
		}
		const Hours = Math.floor(MillisecondDelta / 3600000);
		const Minutes = Math.floor((MillisecondDelta - (Hours * 3600000)) / 60000);
		const Seconds = Math.floor((MillisecondDelta - (Hours * 3600000) - (Minutes * 60000)) / 1000);

		var ResultString = "";

		if (Hours > 0)
		{
			ResultString = Hours + "h";
		}
		if (Hours > 0 || Minutes > 0)
		{
			ResultString += Minutes + "m";
		}
		ResultString += Seconds + "s";
		return (Getters.GetTextChannel(Message.guild).send("<@" + Getters.GetCurrentSpeaker(Message.guild) + "> still has " + ResultString));
	}
};