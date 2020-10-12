class MeetingState
{
	Guild = null;
	NextSpeakers = [];
	CurrentSpeaker = null;
	VoiceChannelId = null;
	TextChannelId = null;
	IsCurrentlyActive = false;
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

	StartMeeting(Guild, VoiceChannel, TextChannel)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		MeetingState.VoiceChannelId = VoiceChannel;
		MeetingState.TextChannelId = TextChannel;
		MeetingState.IsCurrentlyActive = true;
	},

	StopMeeting(Guild)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		MeetingState.VoiceChannelId = null;
		MeetingState.TextChannelId = null;
		MeetingState.IsCurrentlyActive = false;
	},
}

const Getters =
{
	GetCurrentSpeaker(Guild)
	{
		const MeetingState = FindOrCreateMeetingState(Guild);
		return MeetingState.CurrentSpeaker;
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

	IsMeetingActive(Guild)
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