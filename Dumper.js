const exec = require('child_process').execSync;
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const ES = require('./ES');


class Dumper {
	static saveKibanaSettings() {
		// Delete all
		for (let file of glob.sync('./settings/data/*', { dot: true })) {
			fs.unlinkSync(file);
		}
		for (let file of glob.sync('./settings/mapping/*', { dot: true })) {
			fs.unlinkSync(file);
		}

		// Load 
		try {
			exec('./node_modules/elasticdump/bin/elasticdump \
			  --input=http://127.0.0.1:9200/.kibana \
			  --output=./settings/mapping/.kibana  \
			  --type=mapping');
			exec('./node_modules/elasticdump/bin/elasticdump \
			  --input=http://127.0.0.1:9200/.kibana \
			  --output=./settings/data/.kibana  \
			  --type=data');
			exec('./node_modules/elasticdump/bin/elasticdump \
			  --input=http://127.0.0.1:9200/mep-telemetric-' + (new Date().toJSON().slice(0, 10)) + ' \
			  --output=./settings/mapping/mep-telemetric-' + (new Date().toJSON().slice(0, 10)) + '  \
			  --type=mapping');
		} catch(e) {
			Dumper.saveKibanaSettings();
 		}
	}

	static loadKibanaSettings() {
		for (let type of ['mapping', 'data']) {
			for (let filename of glob.sync('./settings/' + type + '/*', { dot: true })) {
				let index = path.basename(filename);

				exec('./node_modules/elasticdump/bin/elasticdump \
					--input=' + filename + '  \
				  --output=http://127.0.0.1:9200/' + index + ' \
				  --type=' + type);
			}
		}
	}
}


// Save Kibana settings
if (process.argv.indexOf('--save-kibana-settings') >= 0) {
	console.log('Starting Elasticsearch...');
	ES.startElasticsearch(() => {
		console.log('Exporting data...');
		Dumper.saveKibanaSettings();
		console.log('Data exported');
		ES.stopElasticsearch();
	});
}
// Load Kibana settings
if (process.argv.indexOf('--load-kibana-settings') >= 0) {
	console.log('Starting Elasticsearch...');
	ES.startElasticsearch(() => {
		console.log('Importing data...');
		Dumper.loadKibanaSettings();
		console.log('Data imported');
		ES.stopElasticsearch();
	});
} 
