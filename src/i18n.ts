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
            projects: "Collections",
            datasets: "Datasets",
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
          },
          PermissionsTable: {
            owner: "Owner",
            editor: "Editor",
            viewer: "Viewer",
            lastActivity: "Last activity",
            permissions: "Permissions",
            transferOwnership: "Transfer ownership",
            addUser: "Add user/group",
            account: "Account",
            role: "Role",
            activity: "Activity",
            add: "Add",
            user: "User",
            transferWarning1: "Don't forget to add permissions for yourself after",
            transferWarning2: "transfering if you don't want to completely lose access. ",
            cancel: "Cancel",
            transfer: "Transfer"
          },
          TemplateEditor: {
            editingTemplate: "Editing template",
            discard: "Discard",
            save: "Save",
            schema: "Schema",
            uiSchema: "UI Schema",
            sideBySide: "Side-by-side",
            renderPreview: "Render preview"
          },
          DatasetList: {
            name: "Name",
            description: "Description",
            creator: "Creator",
            creation: "Created",
            actions: "Actions",
            view: "View",
            datasets: "Datasets"
          },
          DatasetView: {
            edit: "Edit",
            projectName: "Project name",
            facilityAbbreviation: "Facility abbreviation",
            createdAt: "Created at",
            author: "Author",
            datasetName: "Dataset name",
            datasetDescription: "Dataset description",
            selectTemplate: "Select template",
            metadata: "Metadata",
            files: "Files",
            settings: "Settings",
            switchEditor: "Switch editor",
            metadataProblem: "There might be a problem with metadata! Switch to the text editor instead?",
            switch: "Switch",
            filesPreview: "Files preview",
            autoRefresh: "Auto refresh",
            openOnedata: "Open folder in Onedata",
            onedataSettings: "Onedata settings",
            save: "Save",
            downloadMetadata: "Download metadata"
          },
          FilesActiveArea: {
            head: "",
            yTail: " y ago",
            monTail: " mon ago",
            dTail: " d ago",
            hTail: " h ago",
            minTail: " min ago",
            sTail: " s ago",
            myFiles: "Dataset files",
            newFolder: "New folder",
            upload: "Upload",
            rename: "Rename",
            share: "Share",
            openWithExternal: "Open with external application",
            paste: "Paste",
            cancelSelection: "Cancel selection",
            cut: "Cut",
            copy: "Copy",
            delete: "Delete",
            download: "Download",
            name: "Name",
            dateAdded: "Date added",
            size: "Size",
            detail: "Detail",
            dateModified: "Date modified",
            loading: "Loading"
          },
          WindowTextInput: {
            newFolder: "New folder",
            rename: "Rename",
            submit: "Submit",
            cancel: "Cancel"
          },
          ProjectEdit: {
            name: "Name",
            description: "Description",
            tags: "Tags",
            creator: "Creator",
            created: "Created",
            actions: "Actions",
            view: "View",
            collection: "Collection",
            edit: "Edit",
            save: "Save",
            collectionName: "Collection name",
            collectionDescription: "Collection description",
            datasets: "Datasets",
            settings: "Settings",
            newDataset: "New dataset",
            selectFacility: "Select facility",
            selectDefaultTemplate: "Select default template"
          },
          ProjectList: {
            name: "Name",
            description: "Description",
            facility: "Facility",
            creator: "Creator",
            creation: "Creation",
            actions: "Actions",
            view: "View",
            collections: "Collections",
            addNew: "Add new"
          },
          TemplateList: {
            name: "Name",
            description: "Description",
            facility: "Facility",
            creator: "Creator",
            creation: "Creation",
            actions: "Actions",
            view: "View",
            templates: "Templates",
            addNew: "Add new"
          },
          TemplatesEdit: {
            template: "Template",
            templateName: "Template name",
            templateDescription: "Template description",
            editTemplates: "Edit templates",
            templatesEditor: "Templates editor",
            preview: "Preview",
            noSchema: 'No schema defined, use "Edit templates" section',
            save: "Save",
            edit: "Edit",
            templateView: "Template: view"
          },
          mode: {
            view: "view",
            edit: "edit",
            new: "new"
          },
          DaregTable: {
            search: "Search",
            noData: "No data available",
            of: "of",
            moreThan: "more than",
            rowsPerPage: "Rows per page: "
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
            projects: "Kolekce",
            datasets: "Datasety",
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
          },
          PermissionsTable: {
            owner: "Vlastník",
            editor: "Editor",
            viewer: "Pouze čtení",
            lastActivity: "Poslední aktivita",
            permissions: "Práva přístupu",
            transferOwnership: "Změnit vlastníka",
            addUser: "Přidat uživatele/skupinu",
            account: "Účet",
            role: "Práva",
            activity: "Aktivita",
            add: "Přidat",
            user: "Uživatel",
            transferWarning1: "Nezapomeňte si po změně vlastníka přidat oprávnění",
            transferWarning2: "pro sebe, jinak ztratíte přistup. ",
            cancel: "Zrušit",
            transfer: "Použít"
          },
          TemplateEditor: {
            editingTemplate: "Upravit šablonu",
            discard: "Zahodit",
            save: "Uložit",
            schema: "Schéma",
            uiSchema: "UI Schéma",
            sideBySide: "Side-by-side",
            renderPreview: "Zobrazit náhled"
          },
          DatasetList: {
            name: "Název",
            description: "Popis",
            creator: "Vytvořil",
            creation: "Vytvořeno",
            actions: "Akce",
            view: "Zobrazit",
            datasets: "Datasety"
          },
          DatasetView: {
            edit: "Upravit",
            projectName: "Název projektu",
            facilityAbbreviation: "Zkratka facility",
            createdAt: "Vytvořeno",
            author: "Autor",
            datasetName: "Název datasetu",
            datasetDescription: "Popis datasetu",
            selectTemplate: "Vybrat šablonu",
            metadata: "Metadata",
            files: "Soubory",
            settings: "Nastavení",
            switchEditor: "Přepnout editor",
            metadataProblem: "Pravděpodobně nastal problém s metadaty! Přepnout na textový editor?",
            switch: "Přepnout",
            filesPreview: "Náhled souborů",
            autoRefresh: "Auto obnova",
            openOnedata: "Otevřít složku ve Onedata",
            onedataSettings: "Onedata nastavení",
            save: "Uložit",
            downloadMetadata: "Stáhnout metadata"
          },
          FilesActiveArea: {
            head: "před ",
            yTail: " lety",
            monTail: " měs",
            dTail: " d",
            hTail: " h",
            minTail: " min",
            sTail: " s",
            myFiles: "Soubory datasetu",
            newFolder: "Nová složka",
            upload: "Nahrát",
            rename: "Přejmenovat",
            share: "Sdílení",
            openWithExternal: "Otevřít s externí aplikací",
            paste: "Vložit",
            cancelSelection: "Zrušit výběr",
            cut: "Vyjmout",
            copy: "Kopírovat",
            delete: "Smazat",
            download: "Stáhnout",
            name: "Název",
            dateAdded: "Přidáno",
            size: "Velikost",
            detail: "Informace",
            dateModified: "Změněno",
            loading: "Načítání"
          },
          WindowTextInput: {
            newFolder: "Nová složka",
            rename: "Přejmenovat",
            submit: "Uložit",
            cancel: "Zrušit"
          },
          ProjectEdit: {
            name: "Název",
            description: "Popis",
            tags: "Značky",
            creator: "Vytvořil",
            created: "Vytvořeno",
            actions: "Akce",
            view: "Zobrazit",
            collection: "Kolekce",
            edit: "Upravit",
            save: "Uložit",
            collectionName: "Název kolekce",
            collectionDescription: "Popis kolekce",
            datasets: "Datasety",
            settings: "Nastavení",
            newDataset: "Nový dataset",
            selectFacility: "Vybrat facilitu",
            selectDefaultTemplate: "Vybrat výchozí šablonu"
          },
          ProjectList: {
            name: "Název",
            description: "Popis",
            facility: "Facilita",
            creator: "Vytvořil",
            creation: "Vytvořeno",
            actions: "Akce",
            view: "Zobrazit",
            collections: "Kolekce",
            addNew: "Vytvořit"
          },
          TemplateList: {
            name: "Název",
            description: "Popis",
            facility: "Facilita",
            creator: "Vytvořil",
            creation: "Vytvořeno",
            actions: "Akce",
            view: "Zobrazit",
            templates: "Šablony",
            addNew: "Vytvořit"
          },
          TemplatesEdit: { // and view
            template: "Šablona",
            templateName: "Název šablony",
            templateDescription: "Popis šablony",
            editTemplates: "Upravit šablonu",
            templatesEditor: "Editor šablon",
            preview: "Náhled",
            noSchema: 'Schéma není definované, použijte sekci "Upravit šablonu"',
            save: "Uložit",
            edit: "Upravit",
            templateView: "Šablona: zobrazit"
          },
          mode: {
            view: "zobrazit",
            edit: "upravit",
            new: "vytvořit"
          },
          DaregTable: {
            search: "Hledat",
            noData: "Žádná data",
            of: "z",
            moreThan: "více než",
            rowsPerPage: "Počet položek na stránce: "
          }


        }
      }
    }
  });

export default i18n;
