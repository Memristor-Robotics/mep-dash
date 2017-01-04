const Server = require('./Server');
const spawn = require('child_process').spawn;
const OpenUrl = require('openurl');


function startElasticsearch(onStartedCallback) {
    let started = false;

    const elastic = spawn('./es/elasticsearch/bin/elasticsearch');
    elastic.stdout.on('data', (data) => {
        if (started === false && data.toString().indexOf('status changed from [RED] to [YELLOW]') >= 0) {
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


if (process.argv[2] !== '--server-only') {
    // Start Elasticsearch
    console.log('Starting Elasticsearch...');
    startElasticsearch(() => {

        // Start Kibana
        console.log('Elastisearch started (HEAD: http://localhost:9200/_plugin/head/)');
        console.log('Starting Kibana...');
        startKibana(() => {
            console.log('Kibana started at: http://127.0.0.1:5601/');
            OpenUrl.open('http://127.0.0.1:5601/');
        });
    });
}

// Start mep-server
new Server();