const { DefaultLanguage } = require('../config.js');

class LocalisationManager
{
    LanguagesFolder = "./";
    CurrentLanguage = DefaultLanguage;
    Languages = new Map();

    Constructor()
    {
    }

    loadLanguageFromFile(Language, File)
    {
        const LanguageTable = require('../' + this.LanguagesFolder + '/' + File);
        this.Languages.set(Language, LanguageTable);
    }

    init(Folder)
    {
        this.LanguagesFolder = Folder;

        var filesystem = require('fs');
        
        filesystem.readdirSync(this.LanguagesFolder).forEach( ( file ) => {
                if (file.endsWith('.js'))
                    this.loadLanguageFromFile(file.split('.')[0], file);
            }, this);
    }

    reloadLanguage(Language)
    {
        if (Languages.has(Language))
        {
            this.Languages.delete(Language);
        }
        this.loadLanguageFromFile(Language, Language + '.js');
    }

    setCurrentLanguage(Language)
    {
        if (this.Languages.has(Language) == false)
            return ("Language not found.");
        this.CurrentLanguage = Language;
    }

    getValue(Key)
    {
        return (this.Languages.get(this.CurrentLanguage).LanguageTable.get(Key));
    }
}

module.exports.LocalisationManager = LocalisationManager;
