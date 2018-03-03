/************************************************************************************************************

     FILENAME:      index.js
     PROGRAM:       Coin Line (skill)
     VERSION:       1.0
     DATE:          1/9/2018
     AUTHOR:        Stephen Casica (stevecasica.com)
     TYPE:          Platform: Alexa Voice Services (Skill)
     DESCRIPTION:   Utility to check current cyptocurrency (i.e. Bitcoin, Ether, Litecoin) information

************************************************************************************************************/

'use strict';
const Alexa = require('alexa-sdk');

const APP_ID = "";

exports.handler = function (event, context, callback) {
     var alexa = Alexa.handler(event, context);
     alexa.appId = APP_ID;
     alexa.registerHandlers(newSessionHandlers, mainMenuHandlers);
     alexa.execute();
};

/******************************
     STATE DECLARATIONS 
******************************/
const states = {
     MAIN_MENU: '_MAINMENU',
};

/******************************
     VARIABLES
******************************/
var output = "";
var currencies = [];
var coin = "";
var request = "";


/******************************
     VOICE MESSAGE CONSTANTS
******************************/
const WELCOME = "Welcome to Coin Line, which currency would you like to know more about?";
const WELCOME_REPROMPT = "Is there a currency that I can tell you about?"
const YES_RESPONSE = "Which currency are you interested in?"
const CONTINUE = "Can I help you with anything else?";
const HELP = "You can tell me a name of a cryptocurrency, such as bitcoin or litecoin, and I can update you on it."
                    + "or you can ask for specific details about a currency, such as price, marketcap or rank."
                    + "I currently have information on over 100 currencies.";
const HELP_REPROMPT = "Try saying - 'what are the top coins?' - or try saying 'bitcoin price'.";
const TRY_AGAIN = "Im sorry, I did not hear what you just said. Can you please repeat it?";
const END = "Thanks for choosing Coin Line, buh bye";


/******************************
     HANDLERS 
******************************/

// New Session Launched
var newSessionHandlers = {
     'LaunchRequest': function () {
          this.handler.state = states.MAIN_MENU;
          this.emit(':ask', WELCOME, WELCOME_REPROMPT);
     },
     'topIntent': function () {                   //user wants top currencies
          this.handler.state = states.MAIN_MENU;
          this.emitWithState('topIntent');
     },
     'coinIntent': function () {                  //user says name of coin
          this.handler.state = states.MAIN_MENU;
          this.emitWithState('coinIntent');
     },
     'priceIntent': function () {                 //user wants price of coin
          this.handler.state = states.MAIN_MENU;
          this.emitWithState('priceIntent');
     },
     'rankIntent': function () {                  //user wants rank of coin
          this.handler.state = states.MAIN_MENU;
          this.emitWithState('rankIntent');
     },
     'AMAZON.YesIntent': function () {
          this.emit(':ask', YES_RESPONSE);
     },
     'AMAZON.NoIntent': function () {
          this.emitWithState('AMAZON.StopIntent');
     },
     'AMAZON.HelpIntent': function () {
          this.emit(':ask', HELP, HELP_REPROMPT);
     },
     'AMAZON.StopIntent': function () {
          this.emit(':tell', END);
     },
     'AMAZON.CancelIntent': function () {
          this.emit(':ask', CONTINUE);
     },
     'SessionEndedRequest': function () {
          this.emit('AMAZON.StopIntent');
     },
     'Unhandled': function () {
          this.handler.state = states.MAIN_MENU;
          this.emitWithState('Unhandled');
     }
};

// Main Menu
var mainMenuHandlers = Alexa.CreateStateHandler(states.MAIN_MENU, {
     'topIntent': function () {                   //user wants top currencies
          this.emit(':tell', );
          this.emit(':ask', CONTINUE);
     },
     'coinIntent': function () {                  //user says name of coin

     },
     'priceIntent': function () {                 //user wants price of coin
          this.emit(':tell', );
          this.emit(':ask', CONTINUE);
     },
     'rankIntent': function () {                  //user wants rank of coin

     },
     'AMAZON.YesIntent': function () {
          this.emit(':ask', YES_RESPONSE);
     },
     'AMAZON.NoIntent': function () {
          this.emitWithState('AMAZON.StopIntent');
     },
     'AMAZON.HelpIntent': function () {
          this.emit(':ask', HELP, HELP_REPROMPT);
     },
     'AMAZON.StopIntent': function () {
          this.emit(':tell', END);
     },
     'AMAZON.CancelIntent': function () {
          this.emit(':ask', CONTINUE);
     },
     'SessionEndedRequest': function () {
          this.emit('AMAZON.StopIntent');
     },
     'Unhandled': function () {
          this.emit(':ask', TRY_AGAIN_MESSAGE, WELCOME_REPROMPT);
     }
});


/******************************
     SUPPORTING FUNCTIONS 
******************************/

/*
NAME:            getInfo()
DESCRIPTION:     calls API to retrieve info about currency
@PARAM:          addr(type:string): the address of the api
RETURN TYPE:     Void (adds elements to var currencies)
*/
function getInfo() {
     var request = new XMLHttpRequest();
     request.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
               var response = JSON.parse(this.responseText);
               for (var i = 0; i < 50; i++) {
                    currencies.push({
                         name: String(response[i].name),
                         price: String(response[i].price_usd),
                         change: String(response[i].percent_change_24h),
                         rank: String(i + 1)
                         //retrieves image(not implemented)
                         //symbol_element.appendChild(document.createTextNode("(" + response[rank].symbol + ")"));
                         // logo_element.setAttribute("src", "assets/" + response[rank].name + ".png");
                    })
               }
          }
     };
     request.open("GET", "https://api.coinmarketcap.com/v1/ticker/", true);
     request.send();
}

/*
NAME:            parseRequest()
DESCRIPTION:     Parses users request
@PARAM:          coin(type:string): the name of the coin requested
@PARAM:          request(type:string): the details requested
RETURN TYPE:     String
*/

function parseRequest(coin, request) {
     
}



/*
NAME:            parseResponse(value)
DESCRIPTION:     Parses user response into string type
@PARAM:          Value(type:string): the response
RETURN TYPE:     String
*/

function parseResponse(value) {
     let slots = value;
     for (let slot in slots) {
          if (slots[slot].value != undefined) {
               return slots[slot].value.toString().toLowerCase();
          }
     }
}

