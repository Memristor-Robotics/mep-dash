const Server = require('./Server');
const OpenUrl = require('openurl');
const FindExternalIP = require('./utils/FindExternalIP');
const ES = require('./ES');



let enableElastic = true;
let enableKibana = true;
if (process.argv.indexOf('--disable-kibana') >= 0) {
	enableKibana = false;
}
if (process.argv.indexOf('--server-only') >= 0) {
	enableElastic = false;
	enableKibana = false;
}

console.log('External IP:', FindExternalIP());
if (enableElastic === true) {
	// Start Elasticsearch
	console.log('Starting Elasticsearch...');
	ES.startElasticsearch(() => {
	    console.log('Elastisearch started (HEAD: http://127.0.0.1:9200/_plugin/head/)');

	    // Start Kibana
	    if (enableKibana === true) {
	        console.log('Starting Kibana...');
	        ES.startKibana(() => {
	            console.log('Kibana started at: http://127.0.0.1:5601/');
	            OpenUrl.open('http://127.0.0.1:5601/');
	        });
	    }
	});
}

// Start mep-server
new Server();




