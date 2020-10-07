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
	text += "Currently speaking: " + Getters.GetCurrentSpeaker(Guild).user.username + "\n";
	text += "Next speakers :\n";

	for (const Speaker of Getters.GetAllSpeakers(Guild))
		text += "@" + Speaker.user.username + "\n";
	return (text);
};

const AddSpeakerHelper = (Message, Speaker) =>
{
	if (!Speaker)
		Speaker = Message.member;
	Message.react('✔️').catch(()=> Message.error("Failed to react"));
	Setters.Add(Message.guild, Speaker);
	if (Speaker == Getters.GetCurrentSpeaker(Message.guild))
		Speaker.voice.setMute(false);
}

module.exports = {
	DisplaySpeakerList,
	AddSpeakerHelper,
};