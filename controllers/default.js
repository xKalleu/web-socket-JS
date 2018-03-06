exports.install = function() {
	F.route('/');
	F.route('/usage/', view_usage);
	F.websocket('/', socket_homepage, ['json']);
};

function view_usage() {
	var self = this;
	self.plain(F.usage(true));
}

function socket_homepage() {

	var controller = this;

	controller.on('open', function(client) {

		console.log('Connect / Online:', controller.online);

		client.send({ message: 'Olá {0}'.format(client.id) });
		controller.send({ message: 'Novo usuario conectado: {0}\nOnline: {1}'.format(client.id, controller.online) }, null, [client.id]);

	});

	controller.on('close', function(client) {

		console.log('Disconnect / Online:', controller.online);
		controller.send({ message: 'Usuario disconectado: {0}\nOnline: {1}'.format(client.id, controller.online) });

	});

	controller.on('message', function(client, message) {

        console.log(message);

		if (typeof(message.username) !== 'undefined') {
			var old = client.id;
			client.id = message.username;
			controller.send({ message: 'Nome antigo: ' + old + ', Novo Nome: ' + client.id });
			return;
		}

		message.message = client.id + ': ' + message.message;
        console.log(message);
		controller.send(message);

	});
}