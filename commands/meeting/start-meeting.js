const { Command } = require('discord.js-commando');
const { Setters, Getters } = require('../../state/SpeakerState.js');
const { AddSpeakerHelper, StopSpeakingHelper } = require("../../helpers/SpeakerHelpers.js")

exports.default = class StartMeeting extends Command
{
	constructor(Client)
	{
		super(Client, {
			name: "start-meeting",
			aliases: ["start", "meet"],
			group: "meeting",
			memberName: "start-meeting",
			description: "Start a new meeting in [channel]",
			examples: ["~start-meeting #channel-name", "~start-meeting channel-name"],
			guildOnly: true,
			args:
			[
				{
					key: "VoiceChannel",
					prompt: "Where should we discuss?",
					type: "channel",
				},
				{
					key: "TextChannel",
					prompt: "Where should we ask for the speech turn?",
					type: "channel",
				},
			],
		});
	}

	run(Message, { VoiceChannel, TextChannel })
	{
		if (Getters.IsMeetingActive(Message.guild))
			return (Message.reply(`There is already a meeting going on in ${Getters.GetVoiceChannel(Message.guild).name}.`));
		if (VoiceChannel.type !== "voice")
			return (Message.reply("Error, selected voice channel " + VoiceChannel.name + " is not a voice channel but a text one."));
		if (TextChannel.type !== "text")
			return (Message.reply("Error, selected text channel " + VoiceChannel.name + " is not a text channel."));
		Message.delete();
		Setters.StartMeeting(Message.guild, VoiceChannel, TextChannel);
		VoiceChannel.join();
		const CurrentSpeaker = Getters.GetCurrentSpeaker(Message.guild);
		for (const Member of VoiceChannel.members.array())
		{
			if (CurrentSpeaker == null || Member != CurrentSpeaker)
				Member.voice.setMute(true);
		}
		Getters.GetTextChannel(Message.guild).send(`Starting a meeting in ${VoiceChannel.name}.`).then(
		Message => {
			const Filter = (reaction, user) => true;
			const Collector = Message.createReactionCollector(Filter, {});
			Collector.options.dispose = true;
			Collector.on('collect', (reaction, user) => { AddSpeakerHelper(reaction.message.guild, reaction.message.guild.member(user)); }); // on receive a reaction
			Collector.on('remove', (reaction, user) => { StopSpeakingHelper(reaction.message.guild, reaction.message.guild.member(user)); }); // on remove a reaction
			Setters.SetStartMeetingCollector(Message.guild, Collector);
		}).catch(console.log('failed to await for start meeting message.'));
	}
};
