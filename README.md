# SuperMeetBot
A simple discord bot to manage vocal meeting. You can create a meeting by giving 1 vocal channel and 1 text channel. The text channel is used to ask to speak using only emojis (the bot will only spy on this channel).

Available commands:
* **start-meeting**: Start a new meeting in a voice channel. Usage: `~start-meeting VoiceChannel #TextChannel`
* **stop-meeting**: Stop an ongoing meeting. Usage: `~stop-meeting`
* **add-speaker**: Add a new speaker to next speaker list, if there is no user provided, the author will be used. Usage: `~add-speaker [User]`
* **over-speaking**: Call it when you have finished to talk. Usage: `~over-speaking`
* **set-timer**: set a max duration for speaking. Userage: `~set-timer hh:mm:ss`
* **remaining-time**: ask how long the current speaker can still talk. Usage: `~remaining-time`
* **show-list**: Show all next speakers. Usage: `~show-list`
* **clear**: Clear meeting state in case of trouble. Usage: `~clear`
* **help**: Show all command available. Usage `~help`

## Dependencies
* NodeJs
* npm

Packages:
* discord.js
* discord.js-commando

## Installation
Clone the repository anywhere you want, then go at the root of the repository then proceed by a `npm install`. This should deploy any module dependencies from the bot.
Once this is done, you can boot the bot by simply use `node .`.

## Usage

### Start
You must start by starting a meeting with `~start-meeting VoiceChannel #TextChannel`. You have to provid a voice channel as first argument, which will be where you will talk, and a text channel, where people will be able to ask to talk, show some link, any thing usefull during a meeting.
When the meeting start everyone is mutem you have to ask to talk before being unmute by the bot.

### Loop
When you want to talk you can simply ask it with `~add-speaker` or `~add` or even simplier, by :raising_hand: or reacting to "start meeting" message from the bot.
If you have ask to talk with a message, the bot will react on it to let you know that he have received the request.
You can add a reaction to your message when you have finished talking or using `~over-speaking` (or `~over`). If you choosed to add a reaction to the bot's message to aks to talk, you can remove it to say that you have finished.
If you use any "over" command or reaction before you have talked you will be removed of the waiting list.

### Finish it
When your meeting is over you can stop everything with the command `~stop-meeting`. Don't worry if you send it before it was really finished, if the waiting list is not empty, the bot will let you know.

## Last words
Feel free to clone, add, change anything in this bot. In case of trouble using it, please let me know.
