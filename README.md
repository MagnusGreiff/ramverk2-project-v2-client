[![Build Status](https://travis-ci.org/MagnusGreiff/ramverk2-project-v2-client.svg?branch=master)](https://travis-ci.org/MagnusGreiff/ramverk2-project-v2-client)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/MagnusGreiff/ramverk2-project-v2-client/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/MagnusGreiff/ramverk2-project-v2-client/?branch=master)
[![Build Status](https://scrutinizer-ci.com/g/MagnusGreiff/ramverk2-project-v2-client/badges/build.png?b=master)](https://scrutinizer-ci.com/g/MagnusGreiff/ramverk2-project-v2-client/build-status/master)
[![Maintainability](https://api.codeclimate.com/v1/badges/8c79c7408d4f15a37ef9/maintainability)](https://codeclimate.com/github/MagnusGreiff/Ramverk2-client/maintainability)
# Applikationen och teknikval
Jag har valt att bygga en chatt som består av både en klient som är byggd med hjälp av Electron samt en server som använder sig utav express och websocket. Jag valde att använda mig utav Electron för klienten då det verkar vara ett ramverk som är väldigt populärt och att man enkelt kan göra en desktop applikation. För servern valde jag express för att jag har använt det i tidigare kurser och jag kände att jag ville fortsätta lära mig att använda express. För realtid valde jag att använda mig utav WebSocket för att det var det som lärdes ut i kursen och jag kände inte jag ville testa något annat. När det kommer till databas valde jag att använda mig utav MongoDB av samma anledning som jag valde express och det är för att MongoDB användes i kursen.

### Inkluderade krav för chatten är:

* Möjlighet att se vilka användare som är online.
* Möjlighet att se när en användare loggar in / loggar ut.
* Möjlighet att se vem det är som har skrivit vad.
* Använda StackOverflows API för att länka till användare och inlägg på StackOverflow. `[post]<:id>[/post]`
används för att länka till ett inlägg och `[user]<:id>[/user]` används för att länka till en användare.

### Exkluderade krav för chatten är:

* Skicka personliga meddelande (PM)
* /me
* Inloggning


# Installation
Först behöver du ladda ner koden för klienten, servern samt chat-functions. Det gör du enklast via respektive GitHub repo: [Klient](https://github.com/MagnusGreiff/ramverk2-project-v2-client), [Server](https://github.com/MagnusGreiff/ramverk2-project-v2-server), [Chat-functions](https://github.com/MagnusGreiff/ramverk2-project-v2-chat-functions).
När du har laddat ner alla repon behöver du gå in i respektive repo och skriva `npm install` för att ladda ner alla dependencies.
Du behöver lägga till en konfigurationsfil i servern/config som heter token.json om du vill göra mer än 100 request och den ska innehålla:



```
{
    "key": "example-key", //API key from StackOverflow
    "type": "public" //Private or public
}
```

* För att starta servern och mongodb i en Docker-kontainer skriver du `npm run start-docker`

* För att stänga av servern och mongoDb skriver du `npm run stop-docker`.

* För att starta servern behöver du skriva `npm start`.

* För att starta klienten behöver du skriva `npm start`.


### Konfiguration
Du kan välja själv om du vill använda någon annan Port eller DSN genom att lägga till:

* `export DBWEBB_PORT=your port`
* `export DBWEBB_DSN=your dsn`

i din version av `.bashrc` eller `.bash_profile`.




# Testning
Jag har valt att använda mig utav [Mocha](https://mochajs.org/) och [Chai](http://www.chaijs.com/)

Min kodtäckning är 77.78% för servern och för chat-functions 45.36%. Jag har bara haft möjlighet att testa min server och chat-functions då jag har märkt att det är väldigt svårt att testa min klient. Jag försökte testa klienten men gav upp för att jag inte fick det att fungera. Att testa servern var inte några problem då jag använde mig utav Chai som gör att man kan testa routes och se så att allt fungerar.

För att köra mina tester lokalt använder du kommandot `npm test`.

För att se kodtäckning i terminal går det att köra: `test-nyc`.

För att se kodtäckningen i webbläsaren behöver du köra följande kommando: `npm run test-browser`.

Du kan också köra testerna i flera olika Docker-containrar med följande kommandon:

* `npm run test-docker-1` med node 8.6.0
* `npm run test-docker-2` med node 8.3.0
* `npm run test-docker-3` med node 8.1.0


### CI

För varje repo (klient, server, chat-functions) finns det CI kopplat. Varje repo har följande kopplat:
##### Byggtjänst:
* Travis

#### Kodtäckning och kodkvalite:
* Scrutinizer
* CodeClimate


Jag valde följade tjänster för att jag har använt dem innan och jag vet att man kan få ut bra information från dem. Med Travis testar jag att mina repon byggs korrekt samt att alla mina tester passerar. Scrutizer och Codeclimat använder jag för att kolla på kvaliten av koden. Om det finns några buggar, onödiga kommentarer m.m. För att få en bättre kvalite på koden. Scrutinizer använder jag även för att få kodtäckning för mina enhetstester.

Nu när jag använder mig utav CI-tjänster har jag blivit bättre på att undvika buggar/slarvfel för att nu vet jag hur dessa tjänster kollar på koden och det har gjort att kvaliten har blivit bättre.

Jag har använt mig utav olika CI-tjänster ett bra tag nu och jag är nöjd med informationen man få från dem. De har verkligen hjälpt mig att bli en bättre programmerare.



# Realtid
För realtid valde jag att använda mig utav något som heter WebSocket och det gör att man kan t.ex skicka meddelande till andra människor i världen direkt (allså realtid). Jag valde WebSocket för att det var det som gicks igenom i kursen. Jag hade haft möjlighet att använda något annat för realtid men hände att jag vill fortsätta jobba med WebSocket. I min applikation kan man använda realtid genom att skicka ett meddelande via klienten till någon annan människa som använder klienten och då ser dem det direkt.


# Databas
För databas valde jag att använda mig utav något som heter MongoDB. Dels pågrund att det lärdes ut i kursen men också för att det var enkelt att jobba med. Jag använder databasen för att lagra alla meddelande. När man ansluter till servern via klienten laddas de x senaste meddelanden in och man får se en liten historik av vad som har sagt tidigare.

När det kommer till traditionella relationsdatabaser tror jag att de kommer att få en fortsatt plats i mitt hjärta. Jag tycker om hur man använder sig utav relationsdatabaser. Jag har använt dem mycket under tiden här på BTH och jag tycker att man får en bra struktur på hur man bygger upp sin databas. Nu när jag har använt mig utav en icke-SQL baserad databas har jag märkt att jag saknar strukturen som kommer med en relationsdatabas och jag vill fortsätta jobba med relationsdatabaser i framtiden.

#Modul
Jag gjorde en modul som innehåller funktioner som hanterar utskriften av meddelande som finns i databasen samt när man skickar iväg ett nytt meddelande. När det kommer till NPM ser jag väldigt stora möjligheter. Att man kan ladda upp en modul är väldigt enkelt och att man sen kan ladda ner den sen med ett kommando har nog gjort att många använder tjänsten. Själv tycker jag om NPM. Det har varit smidigt att jobba med och jag kommer troligvis jobba med det i framtiden. Min modul hittar ni här: [Modul](https://www.npmjs.com/package/chat-functions)
