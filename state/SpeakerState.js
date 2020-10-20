const { MaxBufferMessageCollector } = require("../config.js");

class MeetingState
{
	Guild = null;
	MessageCollectors = [];
	MessageTimers = [];
	NextSpeakers = [];
	MC = null;
	CurrentSpeaker = null;
	VoiceChannelId = null;
	TextChannelId = null;
	SpeakDuration = 0;
	IsCurrentlyActive = false;
	IsPaused = false;
}

const MeetingStates = [];

const FindOrCreateMeetingState = (Guild) =>
{
	for (const State of MeetingStates)
	{
		if (State.Guild.id === Guild.id)
			return (State);
	}
	const NewState = new MeetingState;
	NewState.Guild = Guild;
	MeetingStates.push(NewState);
	return (NewState);
};

const Setters =
{
	Add(Guild, Speaker)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		// no speaker so this one will be the current speaker.
		if (MeetingState.CurrentSpeaker == null)
		{
			MeetingState.CurrentSpeaker = Speaker;
			return;
		}
		else if (MeetingState.CurrentSpeaker == Speaker)
		{
			// current speaker ask to speak again, we don't add.
			return;
		}
		if (MeetingState.NextSpeakers.includes(Speaker) == false)
			MeetingState.NextSpeakers.push(Speaker);
	},

	PopNextSpeaker(Guild)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		MeetingState.CurrentSpeaker =  MeetingState.NextSpeakers.shift();
		return MeetingState.CurrentSpeaker;
	},

	RemoveSpeakerFromWaitList(Guild, Speaker)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		const Index = MeetingState.NextSpeakers.indexOf(Speaker);
		MeetingState.NextSpeakers.splice(Index, 1);
	},

	Clear(Guild)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		MeetingState.remove(MeetingState);
		MeetingState.NextSpeakers = [];
		for (const Collector of MeetingState.MessageCollectors)
			Collector.stop();
		for (const Timer of MeetingState.MessageTimers)
			clearTimeout(Timer);
		CurrentSpeaker = null;
		VoiceChannelId = null;
		TextChannelId = null;
		IsCurrentlyActive = false;
	},

	SetVoiceChannel(Guild, VoiceId)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		MeetingState.VoiceChannelId = VoiceId;
	},

	SetTextChannel(Guild, TextId)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		MeetingState.TextChannelId = TextId;
	},

	SetSpeakDuration(Guild, Duration)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		MeetingState.SpeakDuration = Duration;
	},

	AddMessageTimer(Guild, Timer)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		MeetingState.MessageTimers.push(Timer);
	},

	AddMessageCollector(Guild, Collector)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		if (MeetingState.MessageCollectors.length > MaxBufferMessageCollector)
		{
			const OldestCollector = MeetingState.MessageCollectors.shift();
			OldestCollector.stop();
		}
		MeetingState.MessageCollectors.push(Collector);
	},

	StartMeeting(Guild, VoiceChannel, TextChannel, User)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		MeetingState.MC = User;
		MeetingState.CurrentSpeaker = User;
		MeetingState.VoiceChannelId = VoiceChannel;
		MeetingState.TextChannelId = TextChannel;
		MeetingState.IsCurrentlyActive = true;
	},

	StopMeeting(Guild)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		for (const Collector of MeetingState.MessageCollectors)
			Collector.stop();
		for (const Timer of MeetingState.MessageTimers)
			clearTimeout(Timer);
		MeetingState.VoiceChannelId = null;
		MeetingState.TextChannelId = null;
		MeetingState.IsCurrentlyActive = false;
	},

	PauseMeeting(Guild)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		MeetingState.IsPaused = true;
	},

	ResumeMeeting(Guild)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		MeetingState.IsPaused = false;
	}
}

const Getters =
{
	GetCurrentSpeaker(Guild)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		return MeetingState.CurrentSpeaker;
	},

	GetMC(Guild)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		return (MeetingState.MC);
	},

	GetAllSpeakers(Guild)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		return MeetingState.NextSpeakers;
	},

	GetVoiceChannel(Guild)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		return MeetingState.VoiceChannelId;
	},

	GetTextChannel(Guild)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		return MeetingState.TextChannelId;
	},

	GetSpeakDuration(Guild)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		return MeetingState.SpeakDuration;
	},
	
	GetAllMessageTimers(Guild)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		return MeetingState.MessageTimers;
	},

	IsMeetingActive(Guild)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		return MeetingState.IsCurrentlyActive && MeetingState.IsPaused == false;
	},

	IsMeetingActiveNoPause(Guild)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		return MeetingState.IsCurrentlyActive;
	},
}

module.exports =
{
	Getters,
	Setters
}