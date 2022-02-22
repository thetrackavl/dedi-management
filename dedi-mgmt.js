var proxy_ip = "localhost";
var proxy_port = "3000";

var proxy_prefix = "http://" + proxy_ip + ":" + proxy_port;

var countdownDefault = 10;
var apiFailMax = 5;

const defaultPodData = [
	{
		podId: 1,
		podIp: "192.168.1.101",
		modName: "Mod",
	},
	{
		podId: 2,
		podIp: "192.168.1.102",
	},
	{
		podId: 3,
		podIp: "192.168.1.103",
	},
	{
		podId: 4,
		podIp: "192.168.1.104",
	},
	{
		podId: 5,
		podIp: "192.168.1.105",
	},
	{
		podId: 6,
		podIp: "192.168.1.106",
	},
	{
		podId: 7,
		podIp: "192.168.1.107",
	},
	{
		podId: 8,
		podIp: "192.168.1.108",
	},
	{
		podId: 9,
		podIp: "192.168.1.109",
	},
	{
		podId: 10,
		podIp: "192.168.1.110",
	},
	{
		podId: 11,
		podIp: "192.168.1.111",
	},
	{
		podId: 12,
		podIp: "192.168.1.112",
	},
];

const defaultDedi = [
	{
		dediId: 0,
		serverName: "SchedA1",
		dediPort: "31298",
	},
	{
		dediId: 1,
		serverName: "SchedA2",
		dediPort: "32298",
	},
	{
		dediId: 2,
		serverName: "SchedB1",
		dediPort: "33298",
	},
	{
		dediId: 3,
		serverName: "SchedB2",
		dediPort: "34298",
	},
	{
		dediId: 4,
		serverName: "SchedC1",
		dediPort: "35298",
	},
	{
		dediId: 5,
		serverName: "SchedC2",
		dediPort: "36298",
	},
	{
		dediId: 6,
		serverName: "Custom1",
		dediPort: "51298",
	},
	{
		dediId: 7,
		serverName: "Drop-In",
		dediPort: "51301",
	},
	{
		dediId: 8,
		serverName: "Custom2",
		dediPort: "52298",
	},
	{
		dediId: 9,
		serverName: "RookieLeague",
		dediPort: "52301",
	},
	{
		dediId: 10,
		serverName: "Custom3",
		dediPort: "53298",
	},
	{
		dediId: 11,
		serverName: "ProLeague2",
		dediPort: "53301",
	},
	{
		dediId: 12,
		serverName: "Custom4",
		dediPort: "54298",
	},
	{
		dediId: 13,
		serverName: "ProLeague1",
		dediPort: "54301",
	},
	{
		dediId: 14,
		serverName: "Enduro",
		dediPort: "54351",
	},
];

const DediApp = Vue.createApp({
	mounted: function () {
		this.interval = setInterval(() => this.updateDediInfo(), 1000);
		this.interval = setInterval(() => this.updatePodInfo(), 1000);
	},
	data() {
		return {
			activeTab: undefined,
			pods: defaultPodData.map((pd) => new Pod(pd)),
			dedis: defaultDedi.map((dediData) => new Dedi(dediData)),
		};
	},
	methods: {
		updateDediInfo: function () {
			// console.log("starting dedis");
			var app = this;
			this.dedis.forEach(function (dedi, index, dedis) {
				// console.log("starting dedi: " + dedi.dediId + " " + dedi.apiFailSession);
				try {
					// console.log(dedis[index])
					app.manageData(
						app.updateDediSession,
						app.errorDediSession,
						dedis[index],
						dedi.dediPort,
						"apiFailSession",
						"apiCountdownSession"
					)
						.then((dataObj) => {
							dedis[index] = dataObj;
						})
						.catch((e) => {
							// error
							// console.log(e);
						});
					// console.log(dedis[index]);
					app.manageData(
						app.updateDediStandings,
						app.errorDediStandings,
						dedis[index],
						dedi.dediPort,
						"apiFailStandings",
						"apiCountdownStandings"
					)
						.then((dataObj) => {
							dedis[index] = dataObj;
						})
						.catch((e) => {
							// error
							// console.log(e);
						});
				} catch (error) {
					// console.log("error in updateDediInfo:");
					// console.log(error);
				}
			});
		},
		updatePodInfo: function () {
			// console.log("starting pods");
			var app = this;
			this.pods.forEach(function (pod, index, pods) {
				try {
					app.manageData(
						app.updatePodNav,
						app.errorPodNav,
						pods[index],
						pod.podId,
						"apiFailNav",
						"apiCountdownNav"
					)
						.then((dataObj) => {
							pods[index] = dataObj;
						})
						.catch((e) => {
							// console.log(e);
						});
					app.manageData(
						app.updatePodSession,
						app.errorPodSession,
						pods[index],
						pod.podIp,
						"apiFailSession",
						"apiCountdownSession"
					)
						.then((dataObj) => {
							pods[index] = dataObj;
						})
						.catch((e) => {
							// console.log(e);
						});
					app.manageData(
						app.updatePodRaceSelection,
						app.errorPodRaceSelection,
						pods[index],
						pod.podId,
						"apiFailRaceSelection",
						"apiCountdownRaceSelection"
					)
						.then((dataObj) => {
							pods[index] = dataObj;
						})
						.catch((e) => {
							// console.log(e);
						});
				} catch (error) {
					// console.log("error in update pods");
					// console.log(error);
				}
			});
		},
		manageData: async function (
			apiFunc,
			failFunc,
			dataObj,
			objectKey,
			failKey,
			countdownKey,
			failMax = apiFailMax,
			countdown = countdownDefault
		) {
			// console.log("starting manage");
			// first initialize required values
			if (!dataObj.hasOwnProperty(failKey)) {
				dataObj[failKey] = 0;
			}

			if (!dataObj.hasOwnProperty(countdownKey)) {
				dataObj[countdownKey] = 0;
			}

			// next check for max fails
			// if fails >= max fails, set total failure (bit and data)
			//     and check countdown
			// if countdown < 1, reset api fail to max - 1
			// if countdown > 0, decrement countdown and return

			if (dataObj[failKey] >= failMax) {
				failFunc(dataObj);
				if (dataObj[countdownKey] < 1) {
					dataObj[failKey] = failMax - 1;
				} else {
					dataObj[countdownKey]--;
					return dataObj;
				}
			}

			// make api call
			// on success reset fail count and update data
			// on fail, increment fail count and set countdown if max
			// the return object should have only those values populated
			// by this API call to avoid weird race conditions
			try {
				let tempVal = await apiFunc(objectKey);

				// console.log('trying to populate data from api');
				Object.keys(tempVal).forEach(function (key, index, keys) {
					dataObj[key] = tempVal[key];
				});
				dataObj[failKey] = 0;
				dataObj = dataObj.update(dataObj);
				return dataObj;
			} catch (error) {
				// console.log("caught error " + dataObj[failKey]);
				dataObj[failKey]++;
				if (dataObj[failKey] >= failMax) {
					dataObj[countdownKey] = Math.floor(
						Math.random() * countdown
					);
				}
				// return dataObj;
			}
			return dataObj;
		},
		errorDediSession: function (dedi) {
			dedi.onError(new DediError("Dedi Standings Errors"));
			dedi.serverUp = "error";
		},
		updateDediSession: function (dediPort) {
			return new Promise(function (resolve, reject) {
				var url = proxy_prefix + "/session/?port=" + dediPort;
				let dedi = {};
				axios
					.get(url, { timeout: 500 })
					.then(function (response) {
						rawData = response.data;
						dedi.serverName = rawData.playerFileName;
						dedi.serverSession = rawData.session;
						dedi.serverSessionTimeLeft = new Date(
							(rawData.endEventTime - rawData.currentEventTime) *
								1000
						)
							.toISOString()
							.substr(11, 8);
						dedi.serverNumberDrivers = rawData.numberOfVehicles;
						dedi.serverUp = rawData.numberOfVehicles;
						dedi.modName = rawData.serverName;
						// console.log("server name: " + dedi.modName);
						resolve(dedi);
					})
					.catch(function (error) {
						// console.log(error);
						// console.log("error in session: " + error);
						reject(error);
					});
			});
		},
		errorDediStandings: function (dedi) {
			dedi.onError(new DediError("Dedi Standings Errors"));
			dedi.drivers = [];
		},
		updateDediStandings: function (dediPort) {
			return new Promise(function (resolve, reject) {
				var driver_url = proxy_prefix + "/standings/?port=" + dediPort;
				let dedi = {};
				axios
					.get(driver_url, { timeout: 500 })
					.then(function (response) {
						driver_data = response.data;
						drivers = [];
						response.data.forEach(function (
							driver_raw,
							driver_index,
							drivers_raw
						) {
							var driver = {};
							driver.driverName = driver_raw.driverName;
							driver.driverPosition = driver_raw.position;
							driver.driverPenalty =
								driver_raw.penalties > 0 ? true : false;
							driver.driverLaps = driver_raw.lapsCompleted;
							driver.driverOnTrack = driver_raw.inGarageStall
								? false
								: true;
							driver.driverInPit = driver_raw.pitting;
							drivers.push(driver);
						});
						dedi.drivers = drivers;
						resolve(dedi);
					})
					.catch(function (error) {
						reject(error);
					});
			});
		},
		errorPodNav: function (pod) {
			pod.onError(new PodError("Pod Nav Error"));
			pod.podNavState = "error";
		},
		updatePodNav: function (podId) {
			return new Promise(function (resolve, reject) {
				let nav_url = proxy_prefix + "/nav/pod/?pod_id=" + podId;
				let pod = {};
				axios
					.get(nav_url, { timeout: 500 })
					.then(function (response) {
						pod.podNavState = response.data;
						resolve(pod);
					})
					.catch(function (error) {
						reject(error);
					});
			});
		},
		errorPodSession: function (pod) {
			pod.onError(new PodError("Pod Session Error"));
		},
		updatePodSession: function (podIp) {
			return new Promise(function (resolve, reject) {
				let session_url =
					proxy_prefix + "/session/?ip=" + podIp + "&port=5397";
				let pod = {};
				axios
					.get(session_url, { timeout: 500 })
					.then(function (response) {
						let session_data = response.data;

						pod.podDriver = session_data.playerName;
						if (session_data.playerName == "") {
							pod.podDriver = "loading";
						}
						resolve(pod);
					})
					.catch(function (error) {
						reject(error);
					});
			});
		},
		errorPodRaceSelection: function (pod) {
			pod.onError(new PodError("Pod Race Error"));
		},
		updatePodRaceSelection: function (podId) {
			return new Promise(function (resolve, reject) {
				let race_selection_url =
					proxy_prefix + "/race/selection/?pod_id=" + podId;
				let pod = {};
				axios
					.get(race_selection_url, { timeout: 500 })
					.then(function (response) {
						let race_selection_data = response.data;
						// console.log(race_selection_data);
						pod.trackName =
							race_selection_data["track"]["shortName"] +
							" - " +
							race_selection_data["track"]["name"];
						pod.carNameDetail = race_selection_data["car"]["name"];
						pod.carNameModel =
							race_selection_data["car"]["fullPathTree"];
						pod.modName = race_selection_data["series"]["name"];

						resolve(pod);
					})
					.catch(function (error) {
						reject(error);
					});
			});
		},
		podsByMod: function (mod_name) {
			let pod_list = this.pods;
			// return pod_list;
			return pod_list.filter(function (pod) {
				return pod.modName == mod_name && pod.podDriver == "loading";
			});
		},
		activateTab: function (identifier) {
			this.activeTab = identifier;
		},
	},
	computed: {
		onlineDedis: function () {
			return _.orderBy(
				this.dedis.filter((dedi) => dedi.serverUp >= 0),
				"serverUp",
				"desc"
			);
			// return this.dedis;
		},
		distinctMods: function () {
			let vm = this;
			let pod_list = this.pods;
			let mod_list = [...new Set(pod_list.map((pod) => pod.modName))];
			return mod_list
				.filter((mod) => mod != "error" && vm.podsByMod(mod).length > 0)
				.map((m) => new Mod(m));
			// return mod_list;
		},
		orderedDrivers: function (drivers) {
			return _.orderBy(drivers, "driverPosition");
		},
		activeTabDedi: function () {
			const app = this;
			return this.onlineDedis.find(
				(dedi) => (dedi.serverName = app.activeTab)
			);
		},
	},
});

DediApp.component("mod-nav-button", {
	template: "#mod-nav-button",
	props: {
		mod: Mod,
		pods: Array,
		activeTab: [String, undefined],
	},
	computed: {
		target: function () {
			return this.mod ? this.mod.modName.split(" ").join("-") : "";
		},
		isActive: function () {
			return this.activeTab === this.mod.Modname;
		},
	},
});

DediApp.component("dedi-nav-button", {
	template: "#dedi-nav-button",
	props: {
		dedi: Dedi,
		activeTab: [String, undefined],
	},
	computed: {
		target: function () {
			return this.dedi.serverName
				? this.dedi.serverName.split(" ").join("-")
				: "";
		},
		isActive: function () {
			return this.activeTab === this.dedi.serverName;
		},
	},
});

DediApp.component("pod-list-item", {
	template: "#pod-list-item",
	props: {
		pod: Pod,
	},
});

DediApp.component("dedi-tab", {
	template: "#dedi-tab",
	props: {
		dedi: Object,
		activeTab: [String, undefined],
	},
	computed: {
		isActive: function () {
			return this.activateTab === this.dedi.serverName;
		},
	},
});

DediApp.mount("#app");
