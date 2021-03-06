const LanguageTable = new Map([
    ["Test", "This is english."],
    ["NoMeeting", "There is no meeting going on. To create one please use ~start-meeting."],
    ["PausedMeeting", "The current meeting is paused."],
    ["MeetingAlreadyExist", "There is already a meeting going on in %s."],
    ["MeetingStart", "Starting a meeting in %s."],
    ["NoVoiceChan", "Error, selected voice channel %s is not a voice channel but a text one."],
    ["NoTextChan", "Error, selected text channel %s is not a text channel."],
    ["MeetingNotFinished", "This meeting is not over yet. There is still people waiting to talk."],
    ["MeetingFinished", "Stopped a meeting in %s."],
    ["Cleared", "Cleared"],
    ["Paused", "(Paused)"],
    ["NoTalker", "There is no one talking right now."],
    ["NoDuration", "There is no speak duration set."],
    ["ExceedDuration", "<@%s> has exceed the speak maximal duration."],
    ["StillDuration", "<@%s> still has %s"],
    ["HalfDuration", "You're half way <@%s>."],
    ["LastMinute", "Last minute <@%s>."],
    ["SpeakerList", "Speaker list of %s"],
    ["CurrentSpeaker", "Currently speaking: <@%s>.\n"],
    ["NextSpeakers", "Next speakers :\n"],
    ["CanSpeak", "You can speak now <@%s>."],
    ["YourTurn", "It's your turn <@%s>."],
    ["NoWantTalk", "No one wants to talk? You can ask to talk with ~AddSpeaker or raising your hand."],
    ["MCHasMic", "MC, you have the mic <@%s>."],
    ["", ""],
    ["", ""],
])

module.exports = {
    LanguageTable,
}
