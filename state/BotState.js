const BotState =
{
    LocalisationManager: null,
    Client: null,
    VoiceConnexion: null,
	Lol: false,
}

const BotSetters =
{
    SetLocalisationManager(LocalisationManager)
    {
        BotState.LocalisationManager = LocalisationManager;
    },

    SetClient(Client)
    {
        BotState.Client = Client;
    },

    SetVoiceConnexion(VoiceConnexion)
    {
        BotState.VoiceConnexion = VoiceConnexion;
    },
	SetLol(Lol)
	{
		BotState.Lol = Lol;
	},
}

const BotGetters =
{
    GetLocalisationManager()
    {
        return (BotState.LocalisationManager);
    },
    GetClient()
    {
        return (BotState.Client);
    },
    GetVoiceConnexion()
    {
        return (BotState.VoiceConnexion);
    },
	GetLol()
	{
		return (BotState.Lol);
	},
}

module.exports = { BotGetters, BotSetters }
