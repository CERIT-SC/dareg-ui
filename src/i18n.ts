import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    initImmediate: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          NewTemplate: {
            addTemplate: "Add template",
            save: "Save",
            uploadJson: "Upload JSON",
            name: "Name",
            description: "Description",
            schemaPreview: "schema preview",
            uploadNewJson: "upload a new JSON",
          },
          LeftBar: {
            home: "Home",
            projects: "Projects",
            templates: "Templates",
            logout: "Logout",
            account: "Account",
            settings: "Settings"
          },
          TopBar: {
            newest: "Newest first",
            oldest: "Oldest first",
            az: "A - Z",
            za: "Z - A",
            searchProj: "Search projects…",
            searchTemp: "Search templates…",
          },
          ListCard: {
            save: "Save",
            revertChanges: "Revert changes",
            editHeader: "Edit header",
            duplicate: "Duplicate",
            useTemplate: "Use template",
            delete: "Delete",
            editForm: "Edit form", 
            downloadJSON: "Download JSON data",
            using: "using",
            newVersion: "New version"
          },
          Settings: {
            language: "Language",
            appearance: "Appearance",
            system: "System",
            light: "Light",
            dark: "Dark"
          },
          NewProjGuide: {
            hero: "How to add a new project",
            first: "1. Go to the templates section.",
            second: "2. Select a template which the project is going to be based on.",
            third: "3. Click \"Use template\"."
          },
          NewProj: {
            addProject: "Add project",
            name: "Name",
            description: "Description",
            using: "using",
            save: "Save"
          },
          auth: {
            welcome: "Welcome",
            logout: "Log out"
          },
          profile: {
            name: "Name",
            organization: "Organization",
            email: "E-mail",
            logged: "Logged in as"
          }
        }
      },
      cs: {
        translation: {
          NewTemplate: {
            addTemplate: "Nová šablona",
            save: "Uložit",
            uploadJson: "Nahrát JSON",
            name: "Název",
            description: "Popis",
            schemaPreview: "náhled šablony",
            uploadNewJson: "nahrát jiný JSON",
          },
          LeftBar: {
            home: "Domov",
            projects: "Projekty",
            templates: "Šablony",
            logout: "Odhlásit se",
            account: "Účet",
            settings: "Nastavení"
          },
          TopBar: {
            newest: "Nejnovější",
            oldest: "Nejstarší",
            az: "A - Z",
            za: "Z - A",
            searchProj: "Hledat projekt…",
            searchTemp: "Hledat šablonu…",
          },
          ListCard: {
            save: "Uložit",
            revertChanges: "Vrátit změny",
            editHeader: "Editovat záhlaví",
            duplicate: "Duplikovat",
            useTemplate: "Použít šablonu",
            delete: "Smazat",
            editForm: "Editovat data", 
            downloadJSON: "Stáhnout JSON data",
            using: "využívá",
            newVersion: "Nová verze"
          },
          Settings: {
            language: "Jazyk",
            appearance: "Motiv",
            system: "Podle systému",
            light: "Světlý",
            dark: "Tmavý"
          },
          NewProjGuide: {
            hero: "Jak vytvořit nový projekt",
            first: "1. Přejděte na sekci šablon.",
            second: "2. Vyberte šablonu, na které bude projekt založen.",
            third: "3. Klikněte na \"Použít šablonu\"."
          },
          NewProj: {
            addProject: "Nový projekt",
            name: "Název",
            description: "Popis",
            using: "využívá",
            save: "Uložit"
          },
          auth: {
            welcome: "Vítejte",
            logout: "Odhlásit se"
          },
          profile: {
            name: "Jméno",
            organization: "Organizace",
            email: "E-mail",
            logged: "Přihlášen pomoci"
          }
        }
      }
    }
  });

export default i18n;
