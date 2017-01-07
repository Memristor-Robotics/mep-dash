const spawn = require('child_process').spawn;

class ES {
	static stopElasticsearch() {
		ES.elastic.kill();
	}

	static stopKibana() {
		ES.kibana.kill();
	}

	static startElasticsearch(onStartedCallback) {
		let started = false;

		ES.elastic = spawn('./es/elasticsearch/bin/elasticsearch');
		ES.elastic.stdout.on('data', (data) => {
		    if (started === false && data.toString().indexOf('started') >= 0) {
		        started = true;
		        onStartedCallback();
		    }
		});
		ES.elastic.stderr.on('data', (data) => {
		    console.error(data.toString());
		});
	}

	static startKibana(onStartedCallback) {
		let started = false;

		ES.kibana = spawn('./es/kibana/bin/kibana');
		ES.kibana.stdout.on('data', (data) => {
		    if (started === false && data.toString().indexOf('Server running') >= 0) {
		        started = true;
				onStartedCallback();
		    }
		});
		ES.kibana.stderr.on('data', (data) => {
		    console.error(data.toString());
		});
	}
}

module.exports = ES;
