class Dedi {
	dediId;
	serverName;
	dediPort;
	apiFailSession;
	apiCountdownSession;
	apiFailStandings;
	apiCountdownStandings;
	serverSession;
	serverSessionTimeLeft;
	serverNumberDrivers;
	serverUp;
	modName;
	drivers = [];

	errored = false;
	errors = [];

	constructor({ dediId, serverName, dediPort, ...data }) {
		if (dediId === undefined || dediId === null)
			throw new Error("Missing required property `dediId` on Dedi");
		if (!serverName)
			throw new Error("Missing required property `serverName on Dedi");
		if (!dediPort)
			throw new Error("Missing required property `dediPort` on Dedi");
		this.dediId = dediId;
		this.serverName = serverName;
		this.dediPort = dediPort;
		const {
			apiFailSession,
			apiCountdownSession,
			apiFailStandings,
			apiCountdownStandings,
			serverSession,
			serverSessionTimeLeft,
			serverNumberDrivers,
			serverUp,
			modName,
			drivers,
		} = data;
		this.apiFailSession = apiFailSession;
		this.apiCountdownSession = apiCountdownSession;
		this.apiFailStandings = apiFailStandings;
		this.apiCountdownStandings = apiCountdownStandings;
		this.serverSession = serverSession;
		this.serverSessionTimeLeft = serverSessionTimeLeft;
		this.serverNumberDrivers = serverNumberDrivers;
		this.serverUp = serverUp;
		this.modName = modName;
		this.drivers = Array.isArray(drivers) ? drivers : [];
	}

	onError(error) {
		this.errored = true;
		this.errors = [
			...this.errors.filter((err) => err.message !== error.message),
			error,
		];
	}

	clearErrors() {
		this.errors = [];
	}

	onSuccess() {
		this.errored = false;
	}

	update(data) {
		const updated_data = Object.assign({}, this, data);
		return new Dedi(updated_data);
	}
}

class DediError extends Error {
	constructor(message = "", ...args) {
		super(message, ...args);
		this.timeStamp = new Date();
	}
}
