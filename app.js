Vue.createApp({
    mounted: function(){
        this.interval = setInterval(() => this.updateDediInfo(), 2000);
    },
    data(){
        return {
            header: "Dedi it Up!",
            timer: 0,
            dedis:[
                {dediId:'1',serverUp:true,dediPort:'51298', serverName: 'Custom 1', modName: 'Petit Petit', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5'},
                {dediId:'2',serverUp:false,dediPort:'52298', serverName: 'Custom 2', modName: 'Kansas - Xfinitys', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5'},
                {dediId:'3',serverUp:true,dediPort:'53298', serverName: 'Custom 3', modName: 'Bridge - 73 RSR', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5'},
                {dediId:'4',serverUp:false,dediPort:'54298', serverName: 'Custom 4', modName: 'Imola - 134 Judd', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5'},
                {dediId:'5',serverUp:false,dediPort:'54351', serverName: 'Enduro', modName: 'Petit Petit', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5'},
                {dediId:'6',serverUp:false,dediPort:'51301', serverName: 'Drop-In', modName: 'Suzuka - F3', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5'},
                {dediId:'7',serverUp:false,dediPort:'31298', serverName: 'Sched A1', modName: 'Watkins - Fiat 128', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5'},
                {dediId:'8',serverUp:false,dediPort:'32298', serverName: 'Sched A2', modName: 'Watkins - USF-17', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5'},
                {dediId:'9',serverUp:true,dediPort:'33298', serverName: 'Sched B1', modName: 'Lime Rock - Fiat 128', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5'},
                {dediId:'10',serverUp:false,dediPort:'34298', serverName: 'Sched B2', modName: 'Lime Rock - USF-17', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5'},
                {dediId:'11',serverUp:false,dediPort:'35298', serverName: 'Sched C1', modName: '---', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5'},
                {dediId:'12',serverUp:false,dediPort:'36298', serverName: 'Sched C2', modName: '---', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5'},
                {dediId:'13',serverUp:false,dediPort:'53301', serverName: 'Mixed League', modName: 'Road America', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5'},
                {dediId:'14',serverUp:false,dediPort:'54301', serverName: 'LMP3 League', modName: 'Snetterton', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5'},
                {dediId:'15',serverUp:false,dediPort:'52301', serverName: 'Rookie League', modName: 'Portland - Alpine', serverSession: 'Practice', serverSessionTimeLeft: '2:33:27', serverNumberDrivers: '5'}
            ]
        }
    },
    methods:{
        updateDediInfo: function(){
            this.dedis.forEach(function(dedi,index,dedis) {
                // console.log(dedis[index]);
                var proxy_ip = '192.168.1.17';
                var dedi_port = dedi.dediPort;
                var proxy_port = '3000';
                var url = 'http://' + proxy_ip + ':' + proxy_port + '/?port=' + dedi_port;
                axios.get(url)
                    .then(function (response) {
                        // handle success
                        // console.log(response);
                        rawData = response.data;
                        // console.log(rawData);
                        console.log(dedis[index]);
                        dedis[index].serverName = rawData.playerFileName;
                        dedis[index].serverSession = rawData.session;
                        dedis[index].serverSessionTimeLeft = new Date((rawData.endEventTime - rawData.currentEventTime) * 1000).toISOString().substr(11, 8);
                        dedis[index].serverNumberDrivers = rawData.numberOfVehicles;
                        dedis[index].modName = rawData.serverName;
                        dedis[index].serverUp = true;
                        console.log(dedis[index]);
                    })
                    .catch(function (error) {
                        // handle error
                        // dedis[index].serverUp = false;
                        console.log(error);
                    })
            });
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
        'server_up'
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
        'server_up'
    ],
    data(){
        return {
        }
    }
})
.component('dedi-name',{
    template: '#dedi-name-template',
    props:[
        'server_name',
        'mod_name'
    ]
})
.component('dedi-session',{
    template: '#dedi-session-template',
    props:[
        'server_session',
        'server_session_time_left'
    ]
})
.component('dedi-driver',{
    template: '#dedi-driver-template',
    props:[
        'server_number_drivers'
    ]
})
.component('dedi-offline',{
    template: '#dedi-offline-template',
    props:[
        'server_name'
    ]
})
.mount('#server-list')