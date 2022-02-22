class Pod {
	podId = undefined;
	podIp = undefined;
	trackName = undefined;
	carNameDetail = undefined;
	carNameModel = undefined;
	modName = undefined;
	podNavState = undefined;
	podDriver = undefined;
	errored = false;

	errors = [];

	constructor({
		trackName,
		carNameDetail,
		carNameModel,
		modName,
		podId,
		podIp,
	}) {
		if (!podId) {
			throw new Error("missing required property `podId` on Pod");
		}
		if (!podIp) {
			throw new Error("missing required property `podIp` on Pod");
		}
		this.podId = podId;
		this.podIp = podIp;
		this.trackName = trackName;
		this.carNameDetail = carNameDetail;
		this.carNameModel = carNameModel;
		this.modName = modName;
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
		return new Pod(updated_data);
	}
}

class PodError extends Error {
	constructor(message = "", ...args) {
		super(message, ...args);
		this.timeStamp = new Date();
	}
}
