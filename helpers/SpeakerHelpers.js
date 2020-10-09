const { Getters, Setters } = require('../state/SpeakerState.js');

const DisplaySpeakerList = (Guild) =>
{
	let text = '';

	text = "Speaker list of " + Getters.GetVoiceChannel(Guild).name + "\n";
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

const AddSpeakerHelper = (Message, Speaker) =>
{
	if (!Speaker)
		Speaker = Message.member;
	Message.react('✔️').catch(()=> Message.error("Failed to react"));
	const ReactionFilter = (reaction, user) => { return (user.id == Speaker.id)};
	Message.awaitReactions(ReactionFilter, {max:1}).then(collected =>
	{
		StopSpeakingHelper(Message.guild, Message.member);
	})
	Setters.Add(Message.guild, Speaker);
	if (Speaker == Getters.GetCurrentSpeaker(Message.guild))
		Speaker.voice.setMute(false);
}

const StopSpeakingHelper = (Guild, Speaker) =>
{
	const PreviousTalker = Getters.GetCurrentSpeaker(Guild);
	// there is no more meeting or we ask to finish the talking turn to someone else, that's bad, really bad.
	if (Getters.IsMeetingActive(Guild) == false ||
		PreviousTalker != Speaker)
		return;
	// in case the previous talker has left the meeting.
	if (PreviousTalker.voice != null)
		PreviousTalker.voice.setMute(true);

	const NewSpeaker = Setters.PopNextSpeaker(Guild);
	if (NewSpeaker != null)
	{
		NewSpeaker.voice.setMute(false);
		Getters.GetTextChannel(Guild).send("It's your turn <@" + NewSpeaker.user.id + ">.");
	}
	else
	{
		Getters.GetTextChannel(Guild).send("No one wants to talk? You can ask to talk with ~AddSpeaker or raising your hand.");
	}
}

module.exports = {
	DisplaySpeakerList,
	AddSpeakerHelper,
	StopSpeakingHelper,
};
