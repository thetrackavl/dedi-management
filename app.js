var proxy_ip = "192.168.2.102";
var proxy_port = "3000";

var proxy_prefix = "http://" + proxy_ip + ":" + proxy_port;

var countdownDefault = 10;
var apiFailMax = 5;

Vue.createApp({
	mounted: function () {
		this.interval = setInterval(() => this.updateDediInfo(), 1000);
		this.interval = setInterval(() => this.updatePodInfo(), 3000);
		this.interval = setInterval(() => this.updatePodNav(), 1000);
	},
	data() {
		return {
			pods: [
				{
					podId: 1,
					podIp: "192.168.1.101",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
					navCountdown: Math.floor(Math.random() * countdownDefault),
					navApiFail: 0,
				},
				{
					podId: 2,
					podIp: "192.168.1.102",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
					navCountdown: Math.floor(Math.random() * countdownDefault),
					navApiFail: 0,
				},
				{
					podId: 3,
					podIp: "192.168.1.103",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
					navCountdown: Math.floor(Math.random() * countdownDefault),
					navApiFail: 0,
				},
				{
					podId: 4,
					podIp: "192.168.1.104",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
					navCountdown: Math.floor(Math.random() * countdownDefault),
					navApiFail: 0,
				},
				{
					podId: 5,
					podIp: "192.168.1.105",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
					navCountdown: Math.floor(Math.random() * countdownDefault),
					navApiFail: 0,
				},
				{
					podId: 6,
					podIp: "192.168.1.106",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
					navCountdown: Math.floor(Math.random() * countdownDefault),
					navApiFail: 0,
				},
				{
					podId: 7,
					podIp: "192.168.1.107",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
					navCountdown: Math.floor(Math.random() * countdownDefault),
					navApiFail: 0,
				},
				{
					podId: 8,
					podIp: "192.168.1.108",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
					navCountdown: Math.floor(Math.random() * countdownDefault),
					navApiFail: 0,
				},
				{
					podId: 9,
					podIp: "192.168.1.109",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
					navCountdown: Math.floor(Math.random() * countdownDefault),
					navApiFail: 0,
				},
				{
					podId: 10,
					podIp: "192.168.1.110",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
					navCountdown: Math.floor(Math.random() * countdownDefault),
					navApiFail: 0,
				},
				{
					podId: 11,
					podIp: "192.168.1.111",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
					navCountdown: Math.floor(Math.random() * countdownDefault),
					navApiFail: 0,
				},
				{
					podId: 12,
					podIp: "192.168.1.112",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
					navCountdown: Math.floor(Math.random() * countdownDefault),
					navApiFail: 0,
				},
			],
			dedis: [
				{
					dediId: 0,
					serverName: "SchedA1",
					dediPort: "31298",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
				},
				{
					dediId: 1,
					serverName: "SchedA2",
					dediPort: "32298",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
				},
				{
					dediId: 2,
					serverName: "SchedB1",
					dediPort: "33298",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
				},
				{
					dediId: 3,
					serverName: "SchedB2",
					dediPort: "34298",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
				},
				{
					dediId: 4,
					serverName: "SchedC1",
					dediPort: "35298",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
				},
				{
					dediId: 5,
					serverName: "SchedC2",
					dediPort: "36298",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
				},
				{
					dediId: 6,
					serverName: "Custom1",
					dediPort: "51298",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
				},
				{
					dediId: 7,
					serverName: "Drop-In",
					dediPort: "51301",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
				},
				{
					dediId: 8,
					serverName: "Custom2",
					dediPort: "52298",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
				},
				{
					dediId: 9,
					serverName: "RookieLeague",
					dediPort: "52301",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
				},
				{
					dediId: 10,
					serverName: "Custom3",
					dediPort: "53298",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
				},
				{
					dediId: 11,
					serverName: "ProLeague2",
					dediPort: "53301",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
				},
				{
					dediId: 12,
					serverName: "Custom4",
					dediPort: "54298",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
				},
				{
					dediId: 13,
					serverName: "ProLeague1",
					dediPort: "54301",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
				},
				{
					dediId: 14,
					serverName: "Enduro",
					dediPort: "54351",
					apiFail: 0,
					countdown: Math.floor(Math.random() * countdownDefault),
				},
			],
		};
	},
	methods: {
		updateDediInfo: function () {
			this.dedis.forEach(function (dedi, index, dedis) {
				try {
					if (dedi.apiFail > apiFailMax) {
						dedis[index].serverUp = "-1";
						if (dedi.countdown > 0) {
							dedis[index].countdown =
								parseInt(dedis[index].countdown) - 1;
							return;
						} else {
							dedis[index].apiFail = apiFailMax - 1;
						}
					}
					var dedi_port = dedi.dediPort;
					var url = proxy_prefix + "/session/?port=" + dedi_port;
					axios
						.get(url, { timeout: 500 })
						.then(function (response) {
							// handle success - reset our failure counter

							rawData = response.data;
							dedis[index].serverName = rawData.playerFileName;
							dedis[index].serverSession = rawData.session;
							dedis[index].serverSessionTimeLeft = new Date(
								(rawData.endEventTime -
									rawData.currentEventTime) *
									1000
							)
								.toISOString()
								.substr(11, 8);
							dedis[index].serverNumberDrivers =
								rawData.numberOfVehicles;
							dedis[index].serverUp = rawData.numberOfVehicles;
							dedis[index].modName = rawData.serverName;

							//now grab driver info
							var driver_url =
								proxy_prefix + "/standings/?port=" + dedi_port;
							axios
								.get(driver_url, { timeout: 1500 })
								.then(function (response) {
									dedis[index].apiFail = 0;
									driver_data = response.data;
									drivers = [];
									response.data.forEach(function (
										driver_raw,
										driver_index,
										drivers_raw
									) {
										var driver = {};
										driver.driverName =
											driver_raw.driverName;
										driver.driverPosition =
											driver_raw.position;
										driver.driverPenalty =
											driver_raw.penalties > 0
												? true
												: false;
										driver.driverLaps =
											driver_raw.lapsCompleted;
										driver.driverOnTrack =
											driver_raw.inGarageStall
												? false
												: true;
										driver.driverInPit = driver_raw.pitting;
										drivers.push(driver);
									});
									dedis[index].drivers = drivers;
								})
								.catch(function (error) {
									dedis[index].apiFail =
										parseInt(dedis[index].apiFail) + 1;
									if (dedis[index].apiFail > apiFailMax) {
										dedis[index].countdown = Math.floor(
											Math.random() * countdownDefault
										);
									}
									console.log(
										"dedi " +
											index +
											" drivers fail: " +
											error
									);
									console.log(error);
								});
						})
						.catch(function (error) {
							// handle error - build in a debounce for the odd failure
							// console.log('dedi session fail: ' + error);
							dedis[index].apiFail =
								parseInt(dedis[index].apiFail) + 1;
							if (dedis[index].apiFail > apiFailMax) {
								dedis[index].countdown = Math.floor(
									Math.random() * countdownDefault
								);
							}
							// console.log(error);
						});
				} catch {
					dedis[index].apiFail = parseInt(dedis[index].apiFail) + 1;
					if (dedis[index].apiFail > apiFailMax) {
						dedis[index].countdown = Math.floor(
							Math.random() * countdownDefault
						);
					}
				}
			});
		},
		updatePodNav: function () {
			this.pods.forEach(function (pod, index, pods) {
				// console.log('pod iteration - ' + pod.podId);
				try {
					if (pod.navApiFail > apiFailMax) {
						pods[index].podNavState = "error";
						if (pod.navCountdown > 0) {
							pods[index].navCountdown =
								parseInt(pods[index].navCountdown) - 1;
							return;
						} else {
							pods[index].navApiFail = apiFailMax - 1;
						}
					}
					// populate nav state
					let nav_url =
						proxy_prefix + "/nav/pod/?pod_id=" + pod.podId;
					axios
						.get(nav_url, { timeout: 500 })
						.then(function (response) {
							pods[index].navApiFail = 0;
							let nav_data = response.data;
							pods[index].podNavState = nav_data;
						})
						.catch(function (error) {
							// console.log('pod nav fail: ' + error);
							pods[index].navApiFail =
								parseInt(pods[index].navApiFail) + 1;
							// console.log('navApiFail is ' + pods[index].navApiFail);
							if (pods[index].navApiFail > apiFailMax) {
								pods[index].navCountdown = Math.floor(
									Math.random() * countdownDefault
								);
							}
						});
				} catch {
					pods[index].navApiFail =
						parseInt(pods[index].navApiFail) + 1;
					if (pods[index].navApiFail > apiFailMax) {
						pods[index].navCountdown = Math.floor(
							Math.random() * countdownDefault
						);
					}
				}
			});
		},
		updatePodInfo: function () {
			let dedi_arr = this.dedis;
			this.pods.forEach(function (pod, index, pods) {
				// console.log('pod iteration - ' + pod.podId);
				try {
					if (pod.apiFail > apiFailMax) {
						pods[index].modName = "none";
						pods[index].serverName = "none";
						pods[index].podDriver = "none";
						pods[index].podDriver = "none";
						pods[index].trackName = "none";
						pods[index].carNameModel = "none";
						pods[index].carNameDetail = "none";
						if (pod.countdown > 0) {
							pods[index].countdown =
								parseInt(pods[index].countdown) - 1;
							return;
						} else {
							pods[index].apiFail = apiFailMax - 1;
						}
					}
					// populate dedi connection
					// update dedi-map
					let session_url =
						proxy_prefix +
						"/session/?ip=" +
						pod.podIp +
						"&port=5397";
					axios
						.get(session_url, { timeout: 1500 })
						.then(function (response) {
							pods[index].countdown = 0;
							let session_data = response.data;

							pods[index].podDriver = session_data.playerName;
							if (session_data.playerName == "") {
								pods[index].podDriver = "loading";
							}
							try {
								let connected_dedi = dedi_arr.find(
									(o) => o.modName === session_data.serverName
								);
								pods[index].serverName =
									connected_dedi.serverName;
							} catch {
								pods[index].serverName = "loading";
							}
						})
						.catch(function (error) {
							// console.log('pod session fail: ' + error);
							pods[index].apiFail =
								parseInt(pods[index].apiFail) + 1;
							if (pods[index].apiFail > apiFailMax) {
								pods[index].countdown = Math.floor(
									Math.random() * countdownDefault
								);
							}
						});
					let race_selection_url =
						proxy_prefix + "/race/selection/?pod_id=" + pod.podId;
					axios
						.get(race_selection_url, { timeout: 1500 })
						.then(function (response) {
							let race_selection_data = response.data;
							// console.log(race_selection_data);
							pods[index].trackName =
								race_selection_data["track"]["shortName"] +
								" - " +
								race_selection_data["track"]["name"];
							pods[index].carNameDetail =
								race_selection_data["car"]["name"];
							pods[index].carNameModel =
								race_selection_data["car"]["fullPathTree"];
							pods[index].modName =
								race_selection_data["series"]["name"];
						})
						.catch(function (error) {
							// console.log('pod race selection fail: ' + error);
							pods[index].apiFail =
								parseInt(pods[index].apiFail) + 1;
							if (pods[index].apiFail > apiFailMax) {
								pods[index].countdown = Math.floor(
									Math.random() * countdownDefault
								);
							}
						});
				} catch {
					pods[index].podDriver = "error";
					pods[index].modName = "error";
					pods[index].serverName = "error";
					pods[index].trackName = "error";
					pods[index].carName = "error";
				}
			});
		},
		podsByMod: function (mod_name) {
			let pod_list = this.pods;
			return pod_list.filter(function (pod) {
				return pod.modName == mod_name && pod.serverName == "loading";
			});
		},
		distinctMods: function () {
			let vm = this;
			let pod_list = this.pods;
			let mod_list = [...new Set(pod_list.map((pod) => pod.modName))];
			return mod_list.filter(
				(mod) => mod != "none" && vm.podsByMod(mod).length > 0
			);
			// return mod_list.filter(mod => mod != 'none');
		},
	},
	computed: {
		orderedServers: function () {
			return _.orderBy(this.dedis, "serverUp", "desc");
		},
		orderedDrivers: function (drivers) {
			return _.orderBy(drivers, "driverPosition");
		},
	},
})
	.component("dedi-card", {
		template: "#dedi-card-template",
		props: [
			"server_name",
			"mod_name",
			"server_session",
			"server_session_time_left",
			"server_number_drivers",
			"server_up",
			"drivers",
			"dedi_port",
			"pods",
		],
		data() {
			return {};
		},
	})
	.component("dedi-online", {
		template: "#dedi-online-template",
		props: [
			"server_name",
			"mod_name",
			"server_session",
			"server_session_time_left",
			"server_number_drivers",
			"server_up",
			"drivers",
			"dedi_port",
			"pods",
		],
		data() {
			return {
				selected_drivers: [],
			};
		},
		computed: {
			orderedDrivers: function () {
				return _.orderBy(this.drivers, "driverPosition");
			},
		},
		methods: {
			clearPenalty: function (selected_drivers, dedi_port) {
				// console.log('clear penalty');
				// console.log(selected_drivers);
				selected_drivers.forEach(function (
					driver,
					index,
					selected_drivers
				) {
					var url =
						proxy_prefix +
						"/clear-penalty/?port=" +
						dedi_port +
						"&driver=" +
						encodeURIComponent(driver.id);
					console.log(url);
					axios
						.post(url, { timeout: 500 })
						.then(function (response) {})
						.catch(function (error) {
							// handle error
							// console.log(error);
						});
				});
			},
			sendDediNav: function (dedi_port, nav_action) {
				var url =
					proxy_prefix +
					"/nav/dedi/?port=" +
					dedi_port +
					"&action=" +
					nav_action;
				// console.log(url);
				axios
					.post(url, { timeout: 500 })
					.then(function (response) {})
					.catch(function (error) {
						// handle error
						// console.log(error);
					});
			},
			sendDriverNav: function (pods, selected_drivers, nav_action) {
				selected_drivers.forEach(function (
					driver,
					index,
					selected_drivers
				) {
					console.log(driver);
					let driver_pod = pods.find(
						(o) => o.podDriver === driver.driverName
					);
					console.log(driver_pod);
					var url =
						proxy_prefix +
						"/nav/driver/?ip=" +
						driver_pod.podIp +
						"&action=" +
						nav_action +
						"&driver_state=" +
						driver_pod.podNavState;
					console.log(url);
					axios
						.post(url, { timeout: 500 })
						.then(function (response) {})
						.catch(function (error) {
							// handle error
							// console.log(error);
						});
				});
			},
		},
	})
	.component("dedi-offline", {
		template: "#dedi-offline-template",
		props: ["server_name"],
	})
	.component("pod-nav-button", {
		template: "#pod-nav-button-template",
		props: ["nav_action", "pods_in_track"],
		methods: {
			sendPodNav: function (pods_in_track, nav_action) {
				console.log(pods_in_track);
				pods_in_track.forEach(function (pod, index, pods_in_track) {
					var url =
						proxy_prefix +
						"/nav/driver/?ip=" +
						pod.podIp +
						"&action=" +
						nav_action +
						"&driver_state=" +
						pod.podNavState;
					console.log(url);
					axios
						.post(url, { timeout: 500 })
						.then(function (response) {})
						.catch(function (error) {
							// handle error
							// console.log(error);
						});
				});
			},
		},
	})
	.component("driver-ai-button", {
		template: "#driver-ai-button-template",
		props: ["selected_drivers", "ai_state"],
		methods: {
			driverLeave: function (selected_drivers, ai_state) {
				selected_drivers.forEach(function (
					driver,
					index,
					selected_drivers
				) {
					// var url = proxy_prefix + '/nav/driver/?driver=' + encodeURIComponent(driver.id) + '&action=go';
					console.log(url);
					axios
						.post(url, { timeout: 500 })
						.then(function (response) {})
						.catch(function (error) {
							// handle error
							// console.log(error);
						});
				});
			},
		},
	})
	.component("pod-list", {
		template: "#pod-list-template",
		props: ["mod_name", "pods"],
		watch: {
			pods: function (oldPods, newPods) {
				try {
					this.populateCars(newPods[0]);
				} catch (error) {
					console.log(error);
				}
			},
		},
		methods: {
			populateCars: function (pod) {
				let cars = this.cars;
				// cars = {};
				let cars_url = proxy_prefix + "/race/car/?pod_id=" + pod.podId;
				// console.log(cars_url);
				axios
					.get(cars_url, { timeout: 1500 })
					.then(function (response) {
						let car_list = response.data;
						car_list.forEach(function (car, index, car_list) {
							// console.log(cars);
							let car_livery = car["name"];
							let car_id = car["id"];
							// console.log(car["fullPathTree"]);
							cars[car["fullPathTree"]] = {};
							cars[car["fullPathTree"]]["livery_array"] = [];
						});
						car_list.forEach(function (car, index, car_list) {
							// console.log(cars);
							let car_livery = car["name"];
							let car_id = car["id"];
							// console.log(car["fullPathTree"]);
							cars[car["fullPathTree"]][car_livery] = car_id;
							cars[car["fullPathTree"]]["livery_array"].push(
								car_id
							);
						});
					});
			},
			sendPodNav: function (selected_pods, nav_action) {
				// console.log(selected_pods);
				selected_pods.forEach(function (pod, index, selected_pods) {
					var url =
						proxy_prefix +
						"/nav/driver/?ip=" +
						pod.podIp +
						"&action=" +
						nav_action +
						"&driver_state=" +
						pod.podNavState;
					console.log(url);
					axios
						.post(url, { timeout: 500 })
						.then(function (response) {})
						.catch(function (error) {
							// handle error
							// console.log(error);
						});
				});
			},
			autoAssignLivery: function (selected_pods, car_name) {
				console.log(selected_pods);
				cars = this.cars;
				selected_pods.forEach(function (pod, index, selected_pods) {
					try {
						let car_index = pod.podId - 1;
						if (
							cars[car_name]["livery_array"].length <
							pod.podId
						) {
							car_index =
								(pod.podId %
								cars[car_name]["livery_array"].length);
						}
						console.log("car index is: " + car_index);
						var url =
							proxy_prefix +
							"/race/car/?pod_id=" +
							pod.podId +
							"&car_id=" +
							cars[car_name]["livery_array"][car_index];
					} catch (error) {
						console.log(error);
					}
					console.log(url);
					axios
						.post(url, { timeout: 500 })
						.then(function (response) {})
						.catch(function (error) {
							// handle error
							// console.log(error);
						});
				});
				this.showCarSelectionModal = false;
				this.selected_car = "";
			},
		},
		computed: {},
		data() {
			return {
				cars: {},
				selected_pods: [],
				showCarSelectionModal: false,
				selected_car: "",
			};
		},
	})
	.mount("#server-list");
