const { Getters, Setters } = require('../state/SpeakerState.js');
const { BotGetters } = require('../state/BotState.js');
const util = require('util');

const DisplaySpeakerList = (Guild) =>
{
	let text = util.format(BotGetters.GetLocalisationManager().getValue("SpeakerList"), Getters.GetVoiceChannel(Guild).name);

	if (Getters.IsMeetingActive(Guild) == false &&
		Getters.IsMeetingActiveNoPause(Guild) == true)
	{
		text += util.format(" %s.\n", BotGetters.GetLocalisationManager().getValue("Paused"));
	}
	else
	{
		text += ".\n";
	}
	// we don't have a current speaker so we won't have next speaker too.
	if (Getters.GetCurrentSpeaker(Guild) == null)
	{
		text += BotGetters.GetLocalisationManager().getValue("NoTalker");
		return (text);
	}
	text += util.format(BotGetters.GetLocalisationManager().getValue("CurrentSpeaker"), Getters.GetCurrentSpeaker(Guild).user.id);
	text += BotGetters.GetLocalisationManager().getValue("NextSpeakers");

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

	if (SpeakDuration > 0)
	{
		// to avoid redundant message
		if (SpeakDuration / 2 != SpeakDuration - 60000)
		{
			Setters.AddMessageTimer(Guild, setTimeout(SendMessageToGuild, SpeakDuration / 2, Guild,
													  util.format(BotGetters.GetLocalisationManager().getValue("HalfDuration"), Speaker.user.id)));
		}
		Setters.AddMessageTimer(Guild, setTimeout(SendMessageToGuild, SpeakDuration - 60000, Guild,
													  util.format(BotGetters.GetLocalisationManager().getValue("LastMinute"), Speaker.user.id)));
	}
	Setters.SetSpeakStartTime(Guild, Date.now());
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
		Getters.GetTextChannel(Guild).send(util.format(BotGetters.GetLocalisationManager().getValue("CanSpeak"), Speaker.user.id)).then(
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
		Getters.GetTextChannel(Guild).send(util.format(BotGetters.GetLocalisationManager().getValue("YourTurn"), Speaker.user.id)).then(
		Message => {
			Message.awaitReactions(ReactionFilter, {max:1, time:3600000}).then(collected =>
			{
				StopSpeakingHelper(Message.guild, Message.member);
			})
		}).catch(() => console.log('failed to await for reaction on a new turn message.'));
	}
	else
	{
		Getters.GetTextChannel(Guild).send(BotGetters.GetLocalisationManager().getValue("NoWantTalk")).then(CreateMessageCollector).catch(() => console.log('failed to await on no-one want to talk.'));
		const MC = Getters.GetMC(Guild);
		if (MC != null)
		{
			Getters.GetTextChannel(Guild).send(util.format(BotGetters.GetLocalisationManager().getValue("MCHasMic"), Speaker.user.id)).then(
			Message => {
				Message.awaitReactions(ReactionFilter, {max:1, time:3600000}).then(collected =>
				{
					StopSpeakingHelper(Message.guild, MC);
				})
			}).catch(() => console.log('failed to await for reaction on a new turn message.'));
			Setters.Add(Guild, MC);
			Setters.SetSpeakStartTime(Guild, null);
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
