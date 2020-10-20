const { Getters, Setters } = require('../state/SpeakerState.js');

const DisplaySpeakerList = (Guild) =>
{
	let text = '';

	text = "Speaker list of " + Getters.GetVoiceChannel(Guild).name;
	if (Getters.IsMeetingActive(Guild) == false &&
		Getters.IsMeetingActiveNoPause(Guild) == true)
	{
		text += " (paused).\n";
	}
	else
	{
		text += ".\n";
	}
	// we don't have a current speaker so we won't have next speaker too.
	if (Getters.GetCurrentSpeaker(Guild) == null)
	{
		text += "No speaker for the moment.";
		return (text);
	}
	text += "Currently speaking: <@" + Getters.GetCurrentSpeaker(Guild).user.id + ">\n";
	text += "Next speakers :\n";

	for (const Speaker of Getters.GetAllSpeakers(Guild))
		text += "<@" + Speaker.user.id + ">\n";
	return (text);
};

const CreateMessageCollector = (Message) =>
{
	const Filter = (reaction, user) => true;
	const Collector = Message.createReactionCollector(Filter, {});
	Collector.options.dispose = true;
	Collector.on('collect', (reaction, user) => { AddSpeakerHelper(reaction.message.guild, reaction.message.guild.member(user)); }); // on receive a reaction
	Collector.on('remove', (reaction, user) => { StopSpeakingHelper(reaction.message.guild, reaction.message.guild.member(user)); }); // on remove a reaction
	Setters.AddMessageCollector(Message.guild, Collector);
}

const SendMessageToGuild = (Guild, Message) =>
{
	Getters.GetTextChannel(Guild).send(Message);
}

const UnmuteSpeakerHelper = (Guild, Speaker) =>
{
	const SpeakDuration = Getters.GetSpeakDuration(Guild);

	// to avoid redundant message
	if (SpeakDuration / 2 != SpeakDuration - 60000)
	{
		Setters.AddMessageTimer(Guild, setTimeout(SendMessageToGuild, SpeakDuration / 2, Guild, "You're half way <@" + Speaker.user.id + ">."));
	}
	Setters.AddMessageTimer(Guild, setTimeout(SendMessageToGuild, SpeakDuration - 60000, Guild, "Last minute <@" + Speaker.user.id + ">."));
	Speaker.voice.setMute(false);
}

const MuteSpeakerHelper = (Guild, Speaker) =>
{
	for (const Timer of Getters.GetAllMessageTimers(Guild))
	{
		clearTimeout(Timer);
	}
	if (Speaker.voice != null)
		Speaker.voice.setMute(true);
}

const AddSpeakerHelper = (Guild, Speaker) =>
{
	Setters.Add(Guild, Speaker);
	if (Speaker == Getters.GetCurrentSpeaker(Guild))
	{
		UnmuteSpeakerHelper(Guild, Speaker);
		const ReactionFilter = (reaction, user) => { return (user.id == Speaker.id)};
		// timeout set at 1h, max 1 reaction.
		Getters.GetTextChannel(Guild).send("You can speak now <@" + Speaker.user.id + ">.").then(
		Message => {
			Message.awaitReactions(ReactionFilter, {max:1, time:3600000}).then(collected =>
			{
				StopSpeakingHelper(Message.guild, Message.member);
			})
		}).catch(() => console.log('failed to await for reaction on a new turn message.'));
	}
};

const AddSpeakerOnMessageHelper = (Message, Speaker) =>
{
	if (!Speaker)
		Speaker = Message.member;
	Message.react('✔️').catch(()=> Message.error("Failed to react"));
	const ReactionFilter = (reaction, user) => { return (user.id == Speaker.id)};
	// timeout set at 1h, max 1 reaction.
	Message.awaitReactions(ReactionFilter, {max:1, time:3600000}).then(collected =>
	{
		StopSpeakingHelper(Message.guild, Message.member);
	});
	AddSpeakerHelper(Message.guild, Speaker);
};

const SpeakerIsWaiting = (Guild, Speaker) =>
{
	const AllSpeakers = Getters.GetAllSpeakers(Guild);
	return (AllSpeakers.indexOf(Speaker) != -1);
};

const StopSpeakingHelper = (Guild, Speaker) =>
{
	const PreviousTalker = Getters.GetCurrentSpeaker(Guild);
	// there is no more meeting or we ask to finish the talking turn to someone else, that's bad, really bad.
	if (Getters.IsMeetingActive(Guild) == false)
		return;
	if (PreviousTalker != Speaker &&
		SpeakerIsWaiting(Guild, Speaker))
	{
		Setters.RemoveSpeakerFromWaitList(Guild, Speaker);
		return;
	}
	// in case the previous talker has left the meeting.
	MuteSpeakerHelper(Guild, PreviousTalker);

	const NewSpeaker = Setters.PopNextSpeaker(Guild);
	if (NewSpeaker != null)
	{
		UnmuteSpeakerHelper(Guild, Speaker);
		const ReactionFilter = (reaction, user) => { return (user.id == Speaker.id)};
		// timeout set at 1h, max 1 reaction.
		Getters.GetTextChannel(Guild).send("It's your turn <@" + NewSpeaker.user.id + ">.").then(
		Message => {
			Message.awaitReactions(ReactionFilter, {max:1, time:3600000}).then(collected =>
			{
				StopSpeakingHelper(Message.guild, Message.member);
			})
		}).catch(() => console.log('failed to await for reaction on a new turn message.'));
	}
	else
	{
		Getters.GetTextChannel(Guild).send("No one wants to talk? You can ask to talk with ~AddSpeaker or raising your hand.").then(CreateMessageCollector).catch(() => console.log('failed to await on no-one want to talk.'));
		const MC = Getters.GetMC(Guild);
		if (MC != null)
		{
			Getters.GetTextChannel(Guild).send("MC, you have the mic <@" + Speaker.user.id + ">.").then(
			Message => {
				Message.awaitReactions(ReactionFilter, {max:1, time:3600000}).then(collected =>
				{
					StopSpeakingHelper(Message.guild, MC);
				})
			}).catch(() => console.log('failed to await for reaction on a new turn message.'));
			Setters.Add(Guild, MC);
			MC.voice.setMute(false);
		}
	}
};

module.exports = {
	DisplaySpeakerList,
	CreateMessageCollector,
	SpeakerIsWaiting,
	AddSpeakerHelper,
	AddSpeakerOnMessageHelper,
	StopSpeakingHelper,
};
