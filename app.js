var proxy_ip = "192.168.2.102";
var proxy_port = "3000";
var operations_api_ip = "192.168.2.102";
var operations_api_port = "5000";

var proxy_prefix = "http://" + proxy_ip + ":" + proxy_port;
var operations_api_prefix =
	"http://" + operations_api_ip + ":" + operations_api_port;

var countdownDefault = 10;
var apiFailMax = 5;

Vue.createApp({
	mounted: function () {
		this.interval = setInterval(() => this.updateDediInfo(), 1000);
		this.interval = setInterval(() => this.updatePodInfo(), 1000);
		this.interval = setInterval(() => this.updatePodNav(), 1000);
	},
	data() {
		return {
			pods: [],
			dedis: [],
			mods: {},
		};
	},
	methods: {
		updateDediInfo: function () {
			let dedisArray = this.dedis;
			let modsArray = this.mods;
			let dedisUpdated = [];
			let dedi_up_url = operations_api_prefix + "/dedi/up";
			axios
				.get(dedi_up_url, { timeout: 500 })
				.then(function (response) {
					response.data.forEach(function (
						dediKey,
						dedi_index,
						dedis_raw
					) {
						dediPort = dediKey.replace("dedi_", "");
						dedisUpdated.push(dediKey);
						dediIndex = dedisArray.findIndex(
							(obj) => obj.dediKey == dediKey
						);
						if (dediIndex >= 0) {
							dedisArray[dediIndex].dediKey = dediKey;
							dedisArray[dediIndex].dediPort = dediPort;
						} else {
							let dediObj = {
								dediKey: dediKey,
								dediPort: dediPort,
							};
							dedisArray.push(dediObj);
						}
					});

					// remove all dedis that are no longer 'up'
					dedisArray.forEach(function (
						dedi_raw,
						dedi_index,
						dedis_raw
					) {
						if (!dedisUpdated.includes(dedi_raw.dediKey)) {
							dedisArray.splice(dedi_index, 1);
						}
					});
				})
				.catch(function (error) {
					console.log("dediUp fail: " + error);
				});
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
					var dediKey = dedi.dediKey;
					var url =
						operations_api_prefix + "/dedi/session/" + dediKey;
					axios
						.get(url, { timeout: 500 })
						.then(function (response) {
							// handle success - reset our failure counter

							rawData = response.data;
							dedis[index].serverName = rawData.serverName;
							dedis[index].serverSession = rawData.serverSession;
							dedis[index].serverSessionTimeLeft =
								rawData.serverSessionTimeLeft;
							dedis[index].serverNumberDrivers =
								rawData.serverNumberDrivers;
							dedis[index].serverUp = rawData.serverUp;
							dedis[index].modName = rawData.modName;

							if (!dedis[index].serverUp) {
								dedis[index].serverUp = -1;
							}

							//now grab driver info
							var driver_url =
								operations_api_prefix +
								"/dedi/standings/" +
								dediKey;
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
											driver_raw.driverPosition;
										driver.driverPenalty =
											driver_raw.driverPenalty > 0
												? true
												: false;
										driver.driverLaps =
											driver_raw.driverLaps;
										driver.driverOnTrack =
											driver_raw.onTrack
												? true
												: false;
										driver.driverInPit = driver_raw.driverInPit;
										driver.steamId = driver_raw.driverSteamId;
										driver.podId = driver_raw.driverPod;
										driver.veh = driver_raw.driverVeh;
										// driverPod
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
					url =
						operations_api_prefix +
						"/mod/car/" +
						dedis[index].modName;
					axios.get(url, { timeout: 500 }).then(function (response) {
						modsArray[dedis[index].modName] = response.data;
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
			let podsArray = this.pods;
			let podsUpdated = [];
			let pod_up_url = operations_api_prefix + "/pod/up";
			axios
				.get(pod_up_url, { timeout: 500 })
				.then(function (response) {
					response.data.forEach(function (
						podKey,
						pod_index,
						pod_raw
					) {
						podId = podKey.replace("pod_", "");

						podsUpdated.push(podKey);
						podIndex = podsArray.findIndex(
							(obj) => obj.podKey == podKey
						);
						if (podIndex >= 0) {
							podsArray[podIndex].podKey = podKey;
							podsArray[podIndex].podId = podId;
						} else {
							let podObj = {
								podKey: podKey,
								podId: podId,
							};
							podsArray.push(podObj);
						}
					});

					// remove all pods that are no longer 'up'
					podsArray.forEach(function (pod_raw, pod_index, pods_raw) {
						if (!podsUpdated.includes(pod_raw.podKey)) {
							podsArray.splice(pod_index, 1);
						}
					});
				})
				.catch(function (error) {
					console.log("podUp fail: " + error);
				});
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
						operations_api_prefix + "/pod/nav/" + pod.podId;
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
						operations_api_prefix + "/pod/session/" + pod.podId;
					axios
						.get(session_url, { timeout: 1500 })
						.then(function (response) {
							pods[index].countdown = 0;
							let session_data = response.data;

							pods[index].podDriver = session_data.podDriver;
							if (session_data.playerName == "") {
								pods[index].podDriver = "loading";
							}
							try {
								let connected_dedi = dedi_arr.find(
									(o) => o.modName === session_data.modName
								);
								pods[index].serverName =
									connected_dedi.serverName;
							} catch {
								pods[index].serverName = "loading";
							}
							pods[index].steamId = session_data.steamId;
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
						operations_api_prefix +
						"/pod/raceselection/" +
						pod.podId;
					axios
						.get(race_selection_url, { timeout: 1500 })
						.then(function (response) {
							let race_selection_data = response.data;
							// console.log(race_selection_data);
							pods[index].trackName =
								race_selection_data["trackName"];
							pods[index].carNameDetail =
								race_selection_data["carNameDetail"];
							pods[index].carNameModel =
								race_selection_data["carNameModel"];
							pods[index].modName =
								race_selection_data["modName"];
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
				return (
					pod.modName == mod_name &&
					pod.podNavState == "NAV_MAIN_MENU"
				);
			});
		},
		distinctMods: function () {
			let vm = this;
			let pod_list = this.pods;
			let mod_list = [...new Set(pod_list.map((pod) => pod.modName))];
			return mod_list.filter(
				(mod) => mod != "error" && vm.podsByMod(mod).length > 0
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
				showCarSelectionModal: false,
				cars: {},
				showCarSelectionModal: false,
				selected_car: "",
			};
		},
		mounted: function(){
			this.populateCars(this.mod_name);
		},
		computed: {
			orderedDrivers: function () {
				return _.orderBy(this.drivers, "driverPosition");
			},
		},
		watch: {
			mod_name: function (mod_name) {
				try {
					console.log("populate cars for dedi");
					this.populateCars(mod_name);
				} catch (error) {
					console.log(error);
				}
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
						operations_api_prefix +
						"/dedi/clearpenalty/" +
						dedi_port +
						"/" +
						encodeURIComponent(driver.driverName);
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
					operations_api_prefix +
					"/dedi/nav/" +
					dedi_port +
					"/" +
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
					console.log("driver_pod");
					console.log(driver_pod);
					var url =
						operations_api_prefix + "/pod/nav/" + driver_pod.podId;
					console.log(url);
					axios
						.post(url, { timeout: 500, navAction: nav_action })
						.then(function (response) {})
						.catch(function (error) {
							// handle error
							// console.log(error);
						});
				});
			},
			populateCars: function (modName) {
				let cars = this.cars;
				// cars = {};
				let cars_url =
					operations_api_prefix + "/mod/car/" + encodeURIComponent(modName);
				console.log(cars_url);
				axios
					.get(cars_url, { timeout: 1500 })
					.then(function (response) {
						let car_list = response.data;
						Object.entries(car_list).forEach(function (
							car,
							index,
							car_list
						) {
							// console.log(car);
							carName = car[0];
							cars[carName] = {};
							// cars[carName]["livery_array"] = car[1]["livery_array"];
							cars[carName]["car_list"] = car[1]["cars"];
						});
						console.log(cars)
					});
			},
			autoAssignLivery: function (selected_drivers, car_name) {
				console.log(selected_drivers);
				cars = this.cars;
				selected_drivers.forEach(function (driver, index, selected_drivers) {
					console.log(driver);
					try {
						let car_index = driver.podId - 1;
						if (cars[car_name]["car_list"].length < driver.podId) {
							car_index =
								driver.podId % cars[car_name]["car_list"].length;
						}
						console.log("car index is: " + car_index);
						var url =
							operations_api_prefix + "/pod/car/" + driver.podId;

						selected_car =
							cars[car_name]["car_list"][car_index]["carName"] +
							"-" +
							cars[car_name]["car_list"][car_index]["carDetail"];

						console.log(url);
						console.log(selected_car);
						axios
							.post(url, { timeout: 500, car: selected_car })
							.then(function (response) {})
							.catch(function (error) {
								// handle error
								// console.log(error);
							});
					} catch (error) {
						console.log(error);
					}
				});
				this.showCarSelectionModal = false;
				this.selected_car = "";
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
					var url = operations_api_prefix + "/pod/nav/" + pod.podId;
					console.log(url);
					axios
						.post(url, { timeout: 500, navAction: nav_action })
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
			pods: function (newPods) {
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
				let cars_url =
					operations_api_prefix + "/mod/car/" + encodeURIComponent(pod.modName);
				// console.log(cars_url);
				axios
					.get(cars_url, { timeout: 1500 })
					.then(function (response) {
						let car_list = response.data;
						Object.entries(car_list).forEach(function (
							car,
							index,
							car_list
						) {
							// console.log(car);
							carName = car[0];
							cars[carName] = {};
							// cars[carName]["livery_array"] = car[1]["livery_array"];
							cars[carName]["car_list"] = car[1]["cars"];
						});
						// console.log(cars)
					});
			},
			sendPodNav: function (selected_pods, nav_action) {
				console.log(selected_pods);
				selected_pods.forEach(function (pod, index, selected_pods) {
					var url = operations_api_prefix + "/pod/nav/" + pod.podId;
					console.log(url);
					axios
						.post(url, { timeout: 500, navAction: nav_action })
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
						if (cars[car_name]["car_list"].length < pod.podId) {
							car_index =
								pod.podId % cars[car_name]["car_list"].length;
						}
						console.log("car index is: " + car_index);
						var url =
							operations_api_prefix + "/pod/car/" + pod.podId;

						selected_car =
							cars[car_name]["car_list"][car_index]["carName"] +
							"-" +
							cars[car_name]["car_list"][car_index]["carDetail"];

						console.log(url);
						console.log(selected_car);
						axios
							.post(url, { timeout: 500, car: selected_car })
							.then(function (response) {})
							.catch(function (error) {
								// handle error
								// console.log(error);
							});
					} catch (error) {
						console.log(error);
					}
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
