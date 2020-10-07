# SuperMeetBot
A simple discord bot to manage vocal meeting. You can create a meeting by giving 1 vocal channel and 1 text channel. The text channel is used to ask to speak using only emojis (the bot will only spy on this channel).

Available commands:
* **start-meeting**: Start a new meeting in a voice channel. Usage: `~start-meeting VoiceChannel #TextChannel`
* **stop-meeting**: Stop an ongoing meeting. Usage: `~stop-meeting`
* **add-speaker**: Add a new speaker to next speaker list, if there is no user provided, the author will be used. Usage: `~add-speaker [User]`
* **over-speaking**: Call it when you have finished to talk. Usage: `~over-speaking`
* **show-list**: Show all next speakers. Usage: `~show-list`
* **clear**: Clear meeting state in case of trouble. Usage: `~clear`
* **help**: Show all command available. Usage `~help`
