var proxy_ip = 'localhost';
var proxy_port = '3000';

var proxy_prefix = 'http://' + proxy_ip + ':' + proxy_port;

var countdownDefault = 10;
var apiFailMax = 5;


Vue.createApp({
    mounted: function(){
        // document.documentElement.setAttribute('data-theme', targetTheme);
        // localStorage.setItem('theme', targetTheme);

        this.interval = setInterval(() => this.updateDediInfo(), 1000);
        this.interval = setInterval(() => this.updatePodInfo(), 3000);
        this.interval = setInterval(() => this.updatePodNav(), 1000);
    },
    data(){
        return {
            pods:[
                {podId: 1,podIp: '192.168.1.101',apiFail: 0,countdown:countdownDefault,navCountdown:countdownDefault,navApiFail:0},
                {podId: 2,podIp: '192.168.1.102',apiFail: 0,countdown:countdownDefault,navCountdown:countdownDefault,navApiFail:0},
                {podId: 3,podIp: '192.168.1.103',apiFail: 0,countdown:countdownDefault,navCountdown:countdownDefault,navApiFail:0},
                {podId: 4,podIp: '192.168.1.104',apiFail: 0,countdown:countdownDefault,navCountdown:countdownDefault,navApiFail:0},
                {podId: 5,podIp: '192.168.1.105',apiFail: 0,countdown:countdownDefault,navCountdown:countdownDefault,navApiFail:0},
                {podId: 6,podIp: '192.168.1.106',apiFail: 0,countdown:countdownDefault,navCountdown:countdownDefault,navApiFail:0},
                {podId: 7,podIp: '192.168.1.107',apiFail: 0,countdown:countdownDefault,navCountdown:countdownDefault,navApiFail:0},
                {podId: 8,podIp: '192.168.1.108',apiFail: 0,countdown:countdownDefault,navCountdown:countdownDefault,navApiFail:0},
                {podId: 9,podIp: '192.168.1.109',apiFail: 0,countdown:countdownDefault,navCountdown:countdownDefault,navApiFail:0},
                {podId: 10,podIp: '192.168.1.110',apiFail: 0,countdown:countdownDefault,navCountdown:countdownDefault,navApiFail:0},
                {podId: 11,podIp: '192.168.1.111',apiFail: 0,countdown:countdownDefault,navCountdown:countdownDefault,navApiFail:0},
                {podId: 12,podIp: '192.168.1.112',apiFail: 0,countdown:countdownDefault,navCountdown:countdownDefault,navApiFail:0}
            ],
            dedis:[
                {dediId: 0,serverName:'SchedA1',dediPort:'31298',apiFail:0,countdown:countdownDefault},
                {dediId: '1',serverName:'SchedA2',dediPort:'32298',apiFail:0,countdown:countdownDefault},
                {dediId: '2',serverName:'SchedB1',dediPort:'33298',apiFail:0,countdown:countdownDefault},
                {dediId: '3',serverName:'SchedB2',dediPort:'34298',apiFail:0,countdown:countdownDefault},
                {dediId: '4',serverName:'SchedC1',dediPort:'35298',apiFail:0,countdown:countdownDefault},
                {dediId: '5',serverName:'SchedC2',dediPort:'36298',apiFail:0,countdown:countdownDefault},
                {dediId: '6',serverName:'Custom1',dediPort:'51298',apiFail:0,countdown:countdownDefault},
                {dediId: '7',serverName:'Drop-In',dediPort:'51301',apiFail:0,countdown:countdownDefault},
                {dediId: '8',serverName:'Custom2',dediPort:'52298',apiFail:0,countdown:countdownDefault},
                {dediId: '9',serverName:'RookieLeague',dediPort:'52301',apiFail:0,countdown:countdownDefault},
                {dediId: '10',serverName:'Custom3',dediPort:'53298',apiFail:0,countdown:countdownDefault},
                {dediId: '11',serverName:'ProLeague2',dediPort:'53301',apiFail:0,countdown:countdownDefault},
                {dediId: '12',serverName:'Custom4',dediPort:'54298',apiFail:0,countdown:countdownDefault},
                {dediId: '13',serverName:'ProLeague1',dediPort:'54301',apiFail:0,countdown:countdownDefault},
                {dediId: '14',serverName:'Enduro',dediPort:'54351',apiFail:0,countdown:countdownDefault}
            ]
        }
    },
    methods:{
        updateDediInfo: function(){
            this.dedis.forEach(function(dedi,index,dedis) {
                try {
                    if (dedi.apiFail > apiFailMax) {
                        dedis[index].serverUp = '-1';
                        if (dedi.countdown > 0) {
                            dedis[index].countdown = parseInt(dedis[index].countdown) - 1;
                            return;
                        } else {
                            dedis[index].apiFail = apiFailMax - 1;
                        }
                    }
                    var dedi_port = dedi.dediPort;
                    var url = proxy_prefix + '/session/?port=' + dedi_port;
                    axios.get(url,{timeout: 500})
                    .then(function (response) {
                        // handle success - reset our failure counter
                        dedis[index].apiFail = 0;

                        rawData = response.data;
                        dedis[index].serverName = rawData.playerFileName;
                        dedis[index].serverSession = rawData.session;
                        dedis[index].serverSessionTimeLeft = new Date((rawData.endEventTime - rawData.currentEventTime) * 1000).toISOString().substr(11, 8);
                        dedis[index].serverNumberDrivers = rawData.numberOfVehicles;
                        dedis[index].serverUp = rawData.numberOfVehicles;
                        dedis[index].modName = rawData.serverName;

                        //now grab driver info
                        var driver_url = proxy_prefix + '/standings/?port=' + dedi_port;
                        axios.get(driver_url,{timeout: 1500})
                        .then(function (response) {
                            driver_data = response.data;
                            drivers = [];
                            response.data.forEach(function (driver_raw,driver_index,drivers_raw) {
                                var driver = {};
                                driver.driverName = driver_raw.driverName;
                                driver.driverPosition = driver_raw.position;
                                driver.driverPenalty = driver_raw.penalties > 0 ? true : false;
                                driver.driverLaps = driver_raw.lapsCompleted;
                                driver.driverOnTrack = driver_raw.inGarageStall ? false : true;
                                driver.driverInPit = driver_raw.pitting;
                                drivers.push(driver);
                            });
                            dedis[index].drivers = drivers;
                        })
                        .catch(function(error) {
                            console.log('dedi drivers fail: ' + error);
                        })
                    })
                    .catch(function (error) {
                        // handle error - build in a debounce for the odd failure
                        console.log('dedi session fail: ' + error);
                        dedis[index].apiFail = parseInt(dedis[index].apiFail) + 1;
                        if (dedis[index].apiFail > apiFailMax) {
                            dedis[index].countdown = countdownDefault;
                        }
                        // console.log(error);
                    })
                } catch {
                    dedis[index].apiFail = parseInt(dedis[index].apiFail) + 1;
                    if (dedis[index].apiFail > apiFailMax) {
                        dedis[index].countdown = countdownDefault;
                    }
                }
            });
        },
        updatePodNav: function() {
            this.pods.forEach(function(pod,index,pods) {
                // console.log('pod iteration - ' + pod.podId);
                try {
                    if (pod.navApiFail > apiFailMax) {
                        pods[index].podNavState = 'error';
                        if (pod.navCountdown > 0) {
                            pods[index].navCountdown = parseInt(pods[index].navCountdown) - 1;
                            return;
                        } else {
                            pods[index].navApiFail = apiFailMax - 1;
                        }
                    }
                    // populate nav state
                    let nav_url = proxy_prefix + '/nav/pod/?podid=' + pod.podId;
                    axios.get(nav_url,{timeout: 500})
                    .then(function (response) {
                        pods[index].navApiFail = 0;
                        let nav_data = response.data;
                        pods[index].podNavState = nav_data;
                    }).catch(function(error) {
                        console.log('pod nav fail: ' + error);
                        pods[index].navApiFail = parseInt(pods[index].navApiFail) + 1;
                        console.log('navApiFail is ' + pods[index].navApiFail);
                        if (pods[index].navApiFail > apiFailMax) {
                            pods[index].navCountdown = countdownDefault;
                        }
                    });
                } catch {
                    pods[index].navApiFail = parseInt(pods[index].navApiFail) + 1;
                    if (pods[index].navApiFail > apiFailMax) {
                        pods[index].navCountdown = countdownDefault;
                    }
                }
            })
        },
        updatePodInfo: function() {
            let dedi_arr = this.dedis;
            this.pods.forEach(function(pod,index,pods) {
                // console.log('pod iteration - ' + pod.podId);
                try {
                    if (pod.apiFail > apiFailMax) {
                        pods[index].modName = 'none';
                        pods[index].serverName = 'none';
                        pods[index].podDriver = 'none';
                        pods[index].podDriver = 'none';
                        pods[index].trackName = 'none';
                        pods[index].carNameModel = 'none';
                        pods[index].carNameDetail = 'none';
                        if (pod.countdown > 0) {
                            pods[index].countdown = parseInt(pods[index].countdown) - 1;
                            return;
                        } else {
                            pods[index].apiFail = apiFailMax - 1;
                        }
                    }
                    // populate dedi connection
                    // update dedi-map
                    let session_url = proxy_prefix + '/session/?ip=' + pod.podIp + '&port=5397';
                    axios.get(session_url,{timeout: 1500})
                    .then(function (response) {
                        pods[index].countdown = 0;
                        let session_data = response.data;

                        pods[index].podDriver = session_data.playerName;
                        if (session_data.playerName == '') {
                            pods[index].podDriver = 'loading';
                        }
                        try {
                            let connected_dedi = dedi_arr.find(o => o.modName === session_data.serverName);
                            pods[index].modName = connected_dedi.modName;
                            pods[index].serverName = connected_dedi.serverName;
                        } catch {
                            pods[index].modName = 'loading';
                            pods[index].serverName = 'loading';
                        }
                    }).catch(function (error) {
                        console.log('pod session fail: ' + error);
                        pods[index].apiFail = parseInt(pods[index].apiFail) + 1;
                        if (pods[index].apiFail > apiFailMax) {
                            pods[index].countdown = countdownDefault;
                        }
                    });
                    let race_selection_url = proxy_prefix + '/race/selection/?podid=' + pod.podId;
                    axios.get(race_selection_url,{timeout: 1500})
                    .then(function (response) {
                        let race_selection_data = response.data;
                        // console.log(race_selection_data);
                        pods[index].trackName = race_selection_data['track']['shortName'] + ' - ' + race_selection_data['track']['name'];
                        pods[index].carNameDetail = race_selection_data['car']['name'];
                        pods[index].carNameModel = race_selection_data['car']['fullPathTree'];
                    }).catch(function (error) {
                        console.log('pod race selection fail: ' + error);
                        pods[index].apiFail = parseInt(pods[index].apiFail) + 1;
                        if (pods[index].apiFail > apiFailMax) {
                            pods[index].countdown = countdownDefault;
                        }
                    })
                } catch {
                    pods[index].podDriver = 'error';
                    pods[index].modName = 'error';
                    pods[index].serverName = 'error';
                    pods[index].trackName = 'error';
                    pods[index].carName = 'error';
                }
            })
        }
    },
    computed: {
        orderedServers: function () {
        return _.orderBy(this.dedis, 'serverUp','desc')
        },
        orderedDrivers: function(drivers) {
            return _.orderBy(drivers,'driverPosition')
        },
        distinctTracks: function() {
            let pod_list = this.pods;
            return [...new Set(pod_list.map(pod => pod.trackName))];
        }
    }
})
.component('dedi-card',{
    template: '#dedi-card-template',
    props:[
        'server_name',
        'mod_name',
        'server_session',
        'server_session_time_left',
        'server_number_drivers',
        'server_up',
        'drivers',
        'dedi_port',
        'pods'
    ],
    data(){
        return {
        }
    }
})
.component('dedi-online',{
    template: '#dedi-online-template',
    props:[
        'server_name',
        'mod_name',
        'server_session',
        'server_session_time_left',
        'server_number_drivers',
        'server_up',
        'drivers',
        'dedi_port',
        'pods'
    ],
    data(){
        return {
            selected_drivers: []
        }
    },
    computed: {
        orderedDrivers: function() {
            return _.orderBy(this.drivers,'driverPosition')
        }
    }
})
.component('dedi-name',{
    template: '#dedi-name-template',
    props:[
        'server_name',
        'mod_name',
        'dedi_port'
    ]
})
.component('dedi-session',{
    template: '#dedi-session-template',
    props:[
        'server_session',
        'server_session_time_left',
        'dedi_port'
    ]
})
.component('dedi-driver',{
    template: '#dedi-driver-template',
    props:[
        'server_number_drivers',
        'dedi_port'
    ]
})
.component('dedi-offline',{
    template: '#dedi-offline-template',
    props:[
        'server_name'
    ]
})
.component('dedi-nav-button',{
    template: '#dedi-nav-button-template',
    props: [
        'dedi_port',
        'nav_action'
    ],
    methods: {
        sendDediNav: function(dedi_port,nav_action) {
            var url = proxy_prefix + '/nav/dedi/?port=' + dedi_port + '&action=' + nav_action;
            console.log(url);
            axios.post(url,{timeout: 500})
            .then(function (response) {
                console.log()
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
        }
    }
})
.component('clear-penalty-button',{
    template: '#clear-penalty-button-template',
    props: [
        'selected_drivers',
        'dedi_port'
    ],
    methods: {
        clearPenalty: function(selected_drivers,dedi_port) {
            // console.log(selected_driver);
            selected_drivers.forEach( function(driver,index,selected_drivers) {
                var url = proxy_prefix + '/clear-penalty/?port=' + dedi_port + '&driver=' + encodeURIComponent(driver.id);
                console.log(url);
                axios.post(url,{timeout: 500})
                .then(function (response) {
                    console.log()
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
            })
        }
    }
})
.component('driver-nav-button',{
    template: '#driver-nav-button-template',
    props: [
        'selected_drivers',
        'nav_action',
        'pods'
    ],
    methods: {
        sendDriverNav: function(pods,selected_drivers,nav_action) {
            selected_drivers.forEach( function(driver,index,selected_drivers) {
                let driver_pod = pods.find(o => o.podDriver === driver.id);
                console.log(driver_pod);
                var url = proxy_prefix + '/nav/driver/?ip=' + driver_pod.podIp + '&action=' + nav_action + '&driver_state=' + driver_pod.podNavState;
                console.log(url);
                axios.post(url,{timeout: 500})
                .then(function (response) {
                    console.log()
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
            })
        }
    }
})
.component('driver-ai-button',{
    template: '#driver-ai-button-template',
    props: [
        'selected_drivers',
        'ai_state'
    ],
    methods: {
        driverLeave: function(selected_drivers,ai_state) {
            selected_drivers.forEach( function(driver,index,selected_drivers) {
                // var url = proxy_prefix + '/nav/driver/?driver=' + encodeURIComponent(driver.id) + '&action=go';
                console.log(url);
                axios.post(url,{timeout: 500})
                .then(function (response) {
                    console.log()
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
            })
        }
    }
})
.component('pod-list',{
    template: '#pod-list-template',
    props: [
        'track_name',
        'pods'
    ],
    methods: {
        populateCars: function(pod_id) {
            let cars_url = proxy_prefix + '/race/car';
            axios.get(cars_url,{timeout: 1500})
            .then(function (response) {
                let car_list = response.data;
                car_list.forEach(function(car,index,cars) {
                    this.cars[car['fullPathTree']][car['name']] = car['id'];
                })
            })
        }
    },
    computed: {
        podsByTrack: function(track_name) {
            let pod_list = this.pods;
            return pod_list.filter(function(pod) {
             return pod.trackName == track_name && pod.serverName == 'loading';
            });
        }
    },
    data() {
        return {
            cars: {},
            liveries: []
        }
    }
})
.mount('#server-list')