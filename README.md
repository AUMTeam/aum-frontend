# Authorization Manager
Repository ufficiale della web-app di Authorization Manager, realizzata con React e Redux.  
Si raccomanda di leggere le [guidelines di contribuzione](https://github.com/AUMTeam/aum-frontend/blob/devel/CONTRIBUTING.md) prima di cominciare a lavorare al codice.

## Prerequisiti
- **Node.js** (che include il package manager NPM)

## Installazione
Dopo aver clonato il repository, è necessario installare le dipendenze eseguendo il comando `npm install` nella root directory del repository.  
Tale azione va ripetuta ogni qualvolta il file *package.json* viene aggiornato.

## Testing in locale
Per poter testare localmente il software è sufficiente eseguire il comando `npm start` nella root directory del repository.  
Tale comando esegue un server locale sulla porta 3000 attraverso il quale è possibile accedere alla web-app, che si aggiornerà ogni qualvolta viene modificato uno dei file sorgente.
### Endpoint server
Al fine di agevolare le procedure di testing, nelle build di sviluppo è possibile utilizzare il comando *Ctrl + E* in qualunque momento per cambiare la URL del server al quale vengono effettuate le richieste API (per default è configurato per utilizzare il server di Altervista).

## Deployment
Per creare un bundle da caricare su un web server, eseguire `npm run build` nella root directory del repository. L'operazione produrrà i file da caricare sul server nella sottocartella `build/`.  
Prima di eseguire il comando potrebbe essere opportuno effettuare i passaggi seguenti:
### Impostazione della URL della homepage
A seconda del sito su cui andrà effettuato il deployment, va impostata all'interno del file *package.json* la URL alla homepage del sito nel parametro `homepage`, in modo tale che in caso di percorsi relativi gli script vengano importati correttamente.
### Impostazione della URL del server
Se nella build in produzione si vuole utilizzare un server diverso da quello su Altervista, è necessario cambiare la URL modificando la costante `API_ENDPOINT_URL` nel file [src/constants/api.js](https://github.com/AUMTeam/aum-frontend/blob/7a45e50481c2cfa64bb91e67f7027ad0a1466b20/src/constants/api.js#L1).

**Importante:** Non committare **mai** tali modifiche sul branch `devel`, altrimenti il continuous deployment su GitHub Pages smetterà di funzionare!

## Ulteriori informazioni
Per informazioni dettagliate sullo sviluppo dell'applicazione React, si rimanda al readme di [Create React App](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md).
