const spawn = require('child_process').spawn;
const exec = require('child_process').execSync;
const glob = require('glob');
const fs = require('fs');
const Path = require('path');

class Elastic {
	static stopElasticsearch() {
        Elastic.elastic.kill();
	}

	static stopKibana() {
        Elastic.kibana.kill();
	}

	static startElasticsearch(onStartedCallback) {
		let started = false;

        Elastic.elastic = spawn('./es/elasticsearch/bin/elasticsearch');
        Elastic.elastic.stdout.on('data', (data) => {
		    if (started === false && data.toString().indexOf('started') >= 0) {
		        started = true;
		        onStartedCallback();
		    }
		});
        Elastic.elastic.stderr.on('data', (data) => {
		    console.error(data.toString());
		});
	}

	static startKibana(onStartedCallback) {
		let started = false;

        Elastic.kibana = spawn('./es/kibana/bin/kibana');
        Elastic.kibana.stdout.on('data', (data) => {
		    if (started === false && data.toString().indexOf('Server running') >= 0) {
		        started = true;
				onStartedCallback();
		    }
		});
        Elastic.kibana.stderr.on('data', (data) => {
		    console.error(data.toString());
		});
	}

    static saveKibanaSettings() {
        // Delete all
        for (let file of glob.sync(Path.join(__dirname, '../settings/data/*'), { dot: true })) {
            fs.unlinkSync(file);
        }
        for (let file of glob.sync(Path.join(__dirname, '../settings/mapping/*'), { dot: true })) {
            fs.unlinkSync(file);
        }

        // Load
        exec('./node_modules/elasticdump/bin/elasticdump \
          --input=http://127.0.0.1:9200/.kibana \
          --output=' + Path.join(__dirname, '../settings/mapping/.kibana') + '  \
          --type=mapping');
        exec('./node_modules/elasticdump/bin/elasticdump \
          --input=http://127.0.0.1:9200/.kibana \
          --output=' + Path.join(__dirname, '../settings/data/.kibana') + '  \
          --type=data');
        exec('./node_modules/elasticdump/bin/elasticdump \
          --input=http://127.0.0.1:9200/mep-telemetric-' + (new Date().toJSON().slice(0, 10)) + ' \
          --output=' + Path.join(__dirname, '../settings/mapping/mep-telemetric-' + (new Date().toJSON().slice(0, 10))) + ' \
          --type=mapping');
    }

    static loadKibanaSettings() {
        for (let type of ['mapping', 'data']) {
            for (let filename of glob.sync(Path.join(__dirname, '../settings/' + type + '/*'), { dot: true })) {
                let index = Path.basename(filename);

                exec('./node_modules/elasticdump/bin/elasticdump \
					--input=' + filename + '  \
				  --output=http://127.0.0.1:9200/' + index + ' \
				  --type=' + type);
            }
        }
    }
}

module.exports = Elastic;
