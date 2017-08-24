//https://github.com/Fannon/mwbot

const MWBot = require('mwbot'),
			Moo = require("mootools"),
			fs = require('fs');

var wikitiva = require('./config/wikitiva.js'),
		sandstorm = require('./config/sandstorm.js');


let wikitiva_bot = new MWBot(wikitiva.config);
let sandstorm_bot = new MWBot(sandstorm.config);

sandstorm_bot.setGlobalRequestOptions(sandstorm.request)


wikitiva_bot.login({
	username: wikitiva.credentials.username,
	password: wikitiva.credentials.password
}).then((response) => {
	console.log(response);
	
	Array.each(wikitiva.pages, function(page){
		
		read(page, function(text){
			//console.log(text);
			write(page, text, function(resp){
				console.log(resp);
			});
		});
		
	})
	
})
.catch((err) => {
	console.log(err);
    // Error
});

function write(page, text, callback){
	
	fs.stat('./docs/'+page, function(err, stat) {
		
		if(err == null) {
			console.log('WRITE File: '+page+' exists');
			write_to_wiki(page, text, callback);
		}
		else{
			console.log('WRITE File: '+page+' DOESN\'T exists');
			
			var wstream = fs.createWriteStream('./docs/'+page);
			wstream.on('finish', function () {
				write_to_wiki(page, text, callback);
			})
			.on('error', function (error) {
				//console.log(error);
				callback(error);
			})
			
			wstream.write(text);
			wstream.end();
		}
		
	});
	
};

function write_to_wiki(page, text, callback){
	page = page.replace(/_/g, ' ');
	
	page = page.replace(/Infra Servidores Externos /g, '');
	//console.log(page);
	
	text = text.replace(/Infra_Servidores_Externos_/g, '');
	//console.log(text);
	
	sandstorm_bot.getEditToken().then((response) => {
		//console.log(response);
		return sandstorm_bot.edit(page, text);
	})
	.then((response) => {
		//console.log(response);
		callback(response);
	}).catch((err) => {
		callback(err);
	});

};
	
function read(page, callback){
	fs.stat('./docs/'+page, function(err, stat) {
		
		if(err == null) {
			console.log('File: '+page+' exists');
			var data = '';

			var readStream = fs.createReadStream('./docs/'+page, 'utf8');

			readStream.on('data', function(chunk) {  
					data += chunk;
			})
			.on('error', function(error) {
				read_from_wiki(page, callback);
			})
			.on('end', function() {
				//console.log(data);
				callback(data);
			});
		}
		else{
			console.log('File: '+page+' DOESN\'T exists');
			read_from_wiki(page, callback);
		}
		//else if(err.code == 'ENOENT') {
			//// file does not exist
			////fs.writeFile('log.txt', 'Some log\n');
			//console.log('File DOESN\'T exists');
		//}
		//else {
			//console.log('Some other error: ', err.code);
		//}
		
	});
};

function read_from_wiki(page, callback){
	wikitiva_bot.read(page).then((response) => {
		console.log(response);
		var page = Object.keys(response.query.pages)[0];
		//console.log(response.query.pages[page]['revisions'][0]['*']);
			// Success
		callback(response.query.pages[page]['revisions'][0]['*']);
	})
	.catch((err) => {
		console.log(err);
			// Error
	});
};
