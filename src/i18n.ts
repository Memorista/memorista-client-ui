import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources: Resource = {
  de: {
    translation: {
      'Leave an entry': 'Eintrag erstellen',
      'Please leave this field blank as it is used for spam protection.':
        'Bitte dieses Feld leer lassen, da es als Spam-Schutz dient.',
      Author: 'Autor',
      'Please enter your name.': 'Bitte geben Sie Ihren Namen ein.',
      'e.g. Jon Doe': 'z.B. Max Mustermann',
      'Please enter your message.': 'Bitte geben Sie Ihre Nachricht ein.',
      'Hi from Jon Doe': 'Hallo von Max Mustermann',
      Submit: 'Abschicken',
      'Well done!': 'Gut gemacht!',
      'You successfully posted an entry.': 'Sie haben erfolgreich einen Eintrag erstellt.',
      Entries: 'Einträge',
      You: 'Sie',
      by: 'von',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  keySeparator: false,
  interpolation: { escapeValue: false },
});
