const { CommandoClient } = require("discord.js-commando");
const { Getters, Setters } = require("./state/SpeakerState.js");
const { BotGetters, BotSetters } = require("./state/BotState.js");
const { AddSpeakerOnMessageHelper } = require("./helpers/SpeakerHelpers.js");
const Path = require("path");

const {
 	Prefix,
 	Id,
 	Token,
 	Owner,
	EmojiSpeaker,
} = require("./config.js");

const Client = new CommandoClient({
	commandPrefix: Prefix,
	owner: Owner,
	disableEveryone: true,
	unkownCommandResponse: true,
});

const LocaSystem = require('./localisation/LocalisationManager.js');

const Loca = new LocaSystem.LocalisationManager();

Loca.init('languages');
BotSetters.SetLocalisationManager(Loca);
BotSetters.SetClient(Client);

Client.registry.registerDefaultTypes().registerGroup("meeting", "Meeting commands").registerDefaultGroups().registerDefaultCommands().registerCommandsIn(Path.join(__dirname, "commands"));

Client.on("message", message =>
{
	if (message.content === "pouet")
		{
			message.reply("Voice = " + (message.member.hasPermission("SPEAK")));
		}
	// private message
	if (message.guild == null)
		return;
	if (Getters.IsMeetingActive(message.guild) == false ||
		message.channel != Getters.GetTextChannel(message.guild))
		return;

	for (const Emoji of EmojiSpeaker)
	{
		if (message.content === Emoji)
		{
			AddSpeakerOnMessageHelper(message);
			break;
		}
	}
});

Client.on("voiceStateUpdate", (OldState, NewState) =>
{
	if (OldState == NewState)
		return ;
	if (Getters.IsMeetingActive(NewState.guild) == false)
		return;
	if (NewState.channel != null &&
		NewState.channel == Getters.GetVoiceChannel(NewState.guild))
	{
		if (NewState.member != Getters.GetCurrentSpeaker(NewState.guild) &&
			NewState.mute == false)
		{
			NewState.setMute(true);
		}
	}
	else if (OldState.channel != null &&
			 OldState.channel == Getters.GetVoiceChannel(OldState.guild))
	{
		if (OldState.mute == true)
		{
			// fail to unmute
			OldState.member.voice.setMute(false).then().catch((error) => console.log("error during user disconnection : " + error));
			OldState.member.edit({ mute : false }, "Bot unmute before leaving.");
			//Client.muteMember()
		}
	}
})


Client.login(Token);
