var proxy_ip = '192.168.1.17';
var proxy_port = '3000';

Vue.createApp({
    mounted: function(){
        // document.documentElement.setAttribute('data-theme', targetTheme);
        // localStorage.setItem('theme', targetTheme);

        this.interval = setInterval(() => this.updateDediInfo(), 1000);
    },
    data(){
        return {
            header: "Dedi it Up!",
            timer: 0,
            dedis:[
                {dediId: '0',serverName:'Sched A1',dediPort:'31298'},
                {dediId: '1',serverName:'Sched A2',dediPort:'32298'},
                {dediId: '2',serverName:'Sched B1',dediPort:'33298'},
                {dediId: '3',serverName:'Sched B2',dediPort:'34298'},
                {dediId: '4',serverName:'Sched C1',dediPort:'35298'},
                {dediId: '5',serverName:'Sched C2',dediPort:'36298'},
                {dediId: '6',serverName:'Custom 1',dediPort:'51298'},
                {dediId: '7',serverName:'Drop-In',dediPort:'51301'},
                {dediId: '8',serverName:'Custom 2',dediPort:'52298'},
                {dediId: '9',serverName:'Rookie League',dediPort:'52301'},
                {dediId: '10',serverName:'Custom 3',dediPort:'53298'},
                {dediId: '11',serverName:'Pro League 2',dediPort:'53301'},
                {dediId: '12',serverName:'Custom 4',dediPort:'54298'},
                {dediId: '13',serverName:'Pro League 1',dediPort:'54301'},
                {dediId: '14',serverName:'Enduro',dediPort:'54351'}
                // {dediId:'1',serverUp:'0',apiFail:'0',dediPort:'51298',serverName: 'Custom 1',modName: 'Petit Petit',serverSession: 'Practice',serverSessionTimeLeft: '2:33:27',serverNumberDrivers: '5',
                //     drivers:[]},
                // {dediId:'2',serverUp:'0',apiFail:'0',dediPort:'52298', serverName: 'Custom 2', modName: 'Kansas - Xfinitys', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5',
                //     drivers:[]},
                // {dediId:'3',serverUp:'0',apiFail:'0',dediPort:'53298', serverName: 'Custom 3', modName: 'Bridge - 73 RSR', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5',
                //     drivers:[]},
                // {dediId:'4',serverUp:'0',apiFail:'0',dediPort:'54298', serverName: 'Custom 4', modName: 'Imola - 134 Judd', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5',
                //     drivers:[]},
                // {dediId:'5',serverUp:'0',apiFail:'0',dediPort:'54351', serverName: 'Enduro', modName: 'Petit Petit', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5',
                //     drivers:[]},
                // {dediId:'6',serverUp:'0',apiFail:'0',dediPort:'51301', serverName: 'Drop-In', modName: 'Suzuka - F3', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5',
                //     drivers:[]},
                // {dediId:'7',serverUp:'0',apiFail:'0',dediPort:'31298', serverName: 'Sched A1', modName: 'Watkins - Fiat 128', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5',
                //     drivers:[]},
                // {dediId:'8',serverUp:'0',apiFail:'0',dediPort:'32298', serverName: 'Sched A2', modName: 'Watkins - USF-17', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5',
                //     drivers:[]},
                // {dediId:'9',serverUp:'0',apiFail:'0',dediPort:'33298', serverName: 'Sched B1', modName: 'Lime Rock - Fiat 128', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5',
                //     drivers:[]},
                // {dediId:'10',serverUp:'0',apiFail:'0',dediPort:'34298', serverName: 'Sched B2', modName: 'Lime Rock - USF-17', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5',
                //     drivers:[]},
                // {dediId:'11',serverUp:'0',apiFail:'0',dediPort:'35298', serverName: 'Sched C1', modName: '---', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5',
                //     drivers:[]},
                // {dediId:'12',serverUp:'0',apiFail:'0',dediPort:'36298', serverName: 'Sched C2', modName: '---', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5',
                //     drivers:[]},
                // {dediId:'13',serverUp:'0',apiFail:'0',dediPort:'53301', serverName: 'Mixed League', modName: 'Road America', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5',
                //     drivers:[]},
                // {dediId:'14',serverUp:'0',apiFail:'0',dediPort:'54301', serverName: 'LMP3 League', modName: 'Snetterton', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5',
                //     drivers:[]},
                // {dediId:'15',serverUp:'0',apiFail:'0',dediPort:'52301', serverName: 'Rookie League', modName: 'Portland - Alpine', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5',
                //     drivers:[]}
            ]
        }
    },
    methods:{
        updateDediInfo: function(){
            this.dedis.forEach(function(dedi,index,dedis) {
                // console.log(dedis[index]);
                var dedi_port = dedi.dediPort;
                var url = 'http://' + proxy_ip + ':' + proxy_port + '/session/?port=' + dedi_port;
                axios.get(url,{timeout: 500})
                    .then(function (response) {
                        // handle success - reset our failure counter
                        dedis[index].apiFail = 0;
                        // console.log(response);
                        rawData = response.data;
                        // console.log(rawData);
                        // console.log(dedis[index]);
                        dedis[index].serverName = rawData.playerFileName;
                        dedis[index].serverSession = rawData.session;
                        dedis[index].serverSessionTimeLeft = new Date((rawData.endEventTime - rawData.currentEventTime) * 1000).toISOString().substr(11, 8);
                        dedis[index].serverNumberDrivers = rawData.numberOfVehicles;
                        dedis[index].serverUp = rawData.numberOfVehicles;
                        dedis[index].modName = rawData.serverName;
                        // console.log(dedis[index]);
                        //now grab driver info
                        var driver_url = 'http://' + proxy_ip + ':' + proxy_port + '/standings/?port=' + dedi_port;
                        axios.get(driver_url,{timeout: 500})
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
                    })
                    .catch(function (error) {
                        // handle error - build in a debounce for the odd failure
                        dedis[index].apiFail = dedis[index].apiFail + 1;
                        if (dedis[index].apiFail > 5) {
                            dedis[index].serverUp = '-1';
                        }
                        // console.log(error);
                    })
            });
        }
    },
    computed: {
        orderedServers: function () {
        return _.orderBy(this.dedis, 'serverUp','desc')
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
        'dedi_port'
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
        'dedi_port'
    ],
    data(){
        return {
            selected_drivers: []
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
        sendNav: function(dedi_port,nav_action) {
            var url = 'http://' + proxy_ip + ':' + proxy_port + '/nav/dedi/?port=' + dedi_port + '&action=' + nav_action;
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
            selected_drivers.forEach( function(driver,index,selected_drivers) {
                var url = 'http://' + proxy_ip + ':' + proxy_port + '/clear-penalty/?port=' + dedi_port + '&driver=' + encodeURIComponent(driver.id);
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
.component('driver-leave-button',{
    template: '#driver-leave-button-template',
    props: [
        'selected_drivers'
    ],
    methods: {
        driverLeave: function(selected_drivers) {
            selected_drivers.forEach( function(driver,index,selected_drivers) {
                var url = 'http://' + proxy_ip + ':' + proxy_port + '/nav/driver/?driver=' + encodeURIComponent(driver.id) + '&action=leave';
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
.component('driver-go-button',{
    template: '#driver-go-button-template',
    props: [
        'selected_drivers'
    ],
    methods: {
        driverLeave: function(selected_drivers) {
            selected_drivers.forEach( function(driver,index,selected_drivers) {
                var url = 'http://' + proxy_ip + ':' + proxy_port + '/nav/driver/?driver=' + encodeURIComponent(driver.id) + '&action=go';
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
.component('driver-ai-on-button',{
    template: '#driver-ai-on-button-template',
    props: [
        'selected_drivers'
    ],
    methods: {
        driverLeave: function(selected_drivers) {
            selected_drivers.forEach( function(driver,index,selected_drivers) {
                var url = 'http://' + proxy_ip + ':' + proxy_port + '/nav/driver/?driver=' + encodeURIComponent(driver.id) + '&action=go';
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
.mount('#server-list')