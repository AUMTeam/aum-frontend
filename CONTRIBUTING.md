# Guidelines

## Branching
- Il branch **master** contiene la build dell'applicativo attualmente presente in produzione, pertanto la configurazione dei file *src/constants/api.js* e *package.json* (vedi sezione *Deployment* nel Readme) dovrebbe corrispondere con quella del server usato in produzione.
- Lo sviluppo delle nuove funzionalità avviene sul branch **devel**, pertanto ogni volta che si vuole portare in produzione le feature più recenti sarà necessario fare il merge del branch in master. L'utilizzo di feature branch è a discrezione del programmatore.  
Su questo branch è configurato un meccanismo di continuous deployment al fine di poter utilizzare la versione di sviluppo più recente attraverso [GitHub Pages](https://aumteam.github.io/aum-frontend); pertanto è importante non modificare i parametri di deployment come descritto nel Readme.

## Formattazione
Per formattare il codice viene utilizzato il plugin di Visual Studio Code **Prettier** (disponibile anche in versione standalone via npm), con le seguenti modifiche alle opzioni di default:
- *Print Width: 120*
- *Single Quote: true*
