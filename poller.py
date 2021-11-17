import sys
import requests
import json
import datetime
import threading
import time
import mysql.connector

def current_milli_time():
    return round(time.time() * 1000)

begin_time = datetime.datetime.now()

dedi_id = sys.argv[1]

liveInsertStmt = '''insert into red_flag_drivers_live_state (dedi_id,slot_id,laps_completed) values (%s,%s,%s) on duplicate key update laps_completed = %s'''

redFlagInfoInsertStmt = '''insert into red_flag_restart_info (slot_id,driver_name,laps_completed,driver_position) values (%s,%s,%s,%s,%s)'''

def run():
    threading.Timer(0.5, run).start()
    dbh = mysql.connector.connect(
        host="thetrackavl.com",
        user="uoqhvyagpzjlw",
        password=",1@1l46zc@U5",
        database="db6vhiq6rebm7j"
        )
    dbCurs = dbh.cursor(buffered=True)

    dedi_query = 'select dedi_id,dedi_ip,dedi_api_port from dedicated_servers where dedi_id = %s'
    dbCurs.execute(dedi_query,dedi_id)
    dedi_info = dbCurs.fetchall()

    host = dedi_info[0][1]
    port = dedi_info[0][2]
    protocol = 'http'
    url_base = protocol + '://' + host + ':' + port + '/rest/'

    standings_endpoint = url_base + 'watch/standings'
    print(standings_endpoint)

    resp = requests.get(standings_endpoint)
    request_time = current_milli_time()

    positionList = sorted(resp.json(), key=lambda k: k['position'])

    # pull number of laps for current leader
    leader = positionList[0]
    leaderSlot = leader["slotID"]

    leaderLapsQuery = 'select laps_completed from red_flag_drivers_live_state where slot_id = ' + str(leaderSlot)
    #leaderLapsCurs = dbh.cursor()

    dbCurs.execute(leaderLapsQuery)
    leaderLapsRes = dbCurs.fetchall()

    print(leaderLapsRes[0][0])

    # update the live metrics
    for i in positionList:
        insertParams = (dedi_id,i['slotID'],i['lapsCompleted'],i['lapsCompleted'])
        # liveInsertStmt = liveInsertStmtPrefix + str(dedi_id) + ',' + str(i['slotID']) + ',' + str(i['lapsCompleted']) + ')' + liveInsertStmtSuffix + str(i['lapsCompleted'])
        # print(liveInsertStmt)
        dbCurs.execute(liveInsertStmt,insertParams)
    runtime = datetime.datetime.now() - begin_time
    dbh.commit()

    # check if leader has completed a lap
    if (leaderLapsRes[0][0] < leader["lapsCompleted"]):
        # update the red flag info
        print("hey")
        dbCurs.execute("truncate table red_flag_restart_info")
        for i in positionList:
            # account for the leader having just completed the lap?
            if (i["position"] == 1):
                i["lapsCompleted"] = i["lapsCompleted"] - 1
            redFlagParams = (dedi_id,i["slotID"],i["driverName"],i["lapsCompleted"],i["position"])
            # redFlagInfoInsert = redFlagInfoInsertPrefix + str(i["slotID"]) + ',"' + str(i["driverName"]) + '",' + str(i["lapsCompleted"]) + ',' + str(i["position"]) + ')'
            # print(redFlagInfoInsert)
            dbCurs.execute(redFlagInfoInsertStmt,redFlagParams)
        dbh.commit()

run()

