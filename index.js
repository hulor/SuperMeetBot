const { CommandoClient } = require("discord.js-commando");
const { Getters, Setters } = require("./state/SpeakerState.js");
const { AddSpeakerOnMessageHelper } = require("./helpers/SpeakerHelpers.js")
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

Client.registry.registerDefaultTypes().registerGroup("meeting", "Meeting commands").registerDefaultGroups().registerDefaultCommands().registerCommandsIn(Path.join(__dirname, "commands"));

Client.on("message", message =>
{
	// private message
	if (message.guild == null)
		return;
	if (Getters.IsMeetingActive(message.guild) == false ||
		message.channel != Getters.GetTextChannel(message.guild))
		return;

	for (const Emoji of EmojiSpeaker)
	{
		if (message.content.includes(Emoji))
		{
			AddSpeakerOnMessageHelper(message);
			break;
		}
	}
});


Client.login(Token);
