//https://github.com/Fannon/mwbot

const MWBot = require('mwbot');

let bot = new MWBot({
	apiUrl: 'http://api-250c157acc41b2668b36bb7a241bd300.sandstorm.e-ducativa.x:6080/api.php',
	verbose: true,
	jar: true,
	json: true
});

bot.setGlobalRequestOptions({
    qs: {
        format: 'json'
    },
    headers: {
        'Authorization': 'Bearer xtXcsCD_zuqCMBXq1pOzZt23CnDWK0BnzzJGVdN43gJ'
    },
    timeout: 120000, // 120 seconds
    jar: true,
    time: true,
    json: true
})

bot.getEditToken().then((response) => {
	console.log(response);
	return bot.edit('Servicios Rabbitmq', 'Test Content3', 'Test Summary');
})
.then((response) => {
	console.log(response);
    // Success
}).catch((err) => {
	console.log(err);
    // Error
});


