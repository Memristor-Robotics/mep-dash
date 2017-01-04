const Server = require('./Server');
const spawn = require('child_process').spawn;
const OpenUrl = require('openurl');
const FindExternalIP = require('./utils/FindExternalIP');


// Check arguments
let enableElastic = true;
let enableKibana = true;
if (process.argv.indexOf('--disable-kibana') >= 0) {
    enableKibana = false;
}
if (process.argv.indexOf('--server-only') >= 0) {
    enableElastic = false;
    enableKibana = false;
}

function startElasticsearch(onStartedCallback) {
    let started = false;

    const elastic = spawn('./es/elasticsearch/bin/elasticsearch');
    elastic.stdout.on('data', (data) => {
        if (started === false && data.toString().indexOf('bound_addresses') >= 0) {
            started = true;
            onStartedCallback();
        }
    });
    elastic.stderr.on('data', (data) => {
        console.error(data.toString());
    });
}

function startKibana(onStartedCallback) {
    let started = false;

    const kibana = spawn('./es/kibana/bin/kibana');
    kibana.stdout.on('data', (data) => {
        if (started === false && data.toString().indexOf('Server running') >= 0) {
            started = true;
            onStartedCallback();
        }
    });
    kibana.stderr.on('data', (data) => {
        console.error(data.toString());
    });
}

console.log('External IP:', FindExternalIP());

if (enableElastic === true) {
    // Start Elasticsearch
    console.log('Starting Elasticsearch...');
    startElasticsearch(() => {
        console.log('Elastisearch started (HEAD: http://127.0.0.1:9200/_plugin/head/)');

        // Start Kibana
        if (enableKibana === true) {
            console.log('Starting Kibana...');
            startKibana(() => {
                console.log('Kibana started at: http://127.0.0.1:5601/');
                OpenUrl.open('http://127.0.0.1:5601/');
            });
        }
    });
}

// Start mep-server
new Server();