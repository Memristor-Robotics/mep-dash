const Server = require('./Server');
const OpenUrl = require('openurl');
const FindExternalIP = require('./utils/FindExternalIP');
const Elastic = require('./Elastic');


// Save Kibana settings
if (process.argv.indexOf('--save-settings') >= 0) {
    console.log('Starting Elasticsearch...');
    Elastic.startElasticsearch(() => {
        console.log('Exporting data...');
        try {
            Elastic.saveKibanaSettings();
            console.log('Data exported');
        } catch(e) {
            console.error('Data is not exported, please try again');
        }
        Elastic.stopElasticsearch();
    });
    return;
}

// Load Kibana settings
if (process.argv.indexOf('--load-settings') >= 0) {
    console.log('Starting Elasticsearch...');
    Elastic.startElasticsearch(() => {
        console.log('Importing data...');
        Elastic.loadKibanaSettings();
        console.log('Data imported');
        Elastic.stopElasticsearch();
    });
    return;
}


// Start server
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
    Elastic.startElasticsearch(() => {
	    console.log('Elastisearch started (HEAD: http://' + FindExternalIP() + '/_plugin/head/)');

	    // Start Kibana
	    if (enableKibana === true) {
	        console.log('Starting Kibana...');
            Elastic.startKibana(() => {
	            console.log('Kibana started at: http://' + FindExternalIP() + ':5601/');
	            OpenUrl.open('http://127.0.0.1:5601/');
	        });
	    }
	});
}

// Start mep-server
new Server();




