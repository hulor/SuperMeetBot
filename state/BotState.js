const BotState =
{
    LocalisationManager: null,
    Client: null,
    VoiceConnexion: null,
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
}

module.exports = { BotGetters, BotSetters }
