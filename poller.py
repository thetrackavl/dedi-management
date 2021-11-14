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

api_port = sys.argv[1]

def distillData(rawData):
    goodData = dict()
    goodData["slotID"] = rawData["slotID"]
    goodData["position"] = rawData["position"]
    goodData["driver"] = rawData["driverName"]
    goodData["lapsCompleted"] = rawData["lapsCompleted"]
    return goodData

liveInsertStmtPrefix = '''insert into red_flag_drivers_live_state (slot_id,laps_completed) values ('''
liveInsertStmtSuffix = ''' on duplicate key update laps_completed = '''

redFlagInfoInsertPrefix = '''insert into red_flag_restart_info (slot_id,driver_name,laps_completed,driver_position) values ('''

def run():
    threading.Timer(0.5, run).start()
    dbh = mysql.connector.connect(
        host="thetrackavl.com",
        user="uoqhvyagpzjlw",
        password=",1@1l46zc@U5",
        database="db6vhiq6rebm7j"
        )
    host = '192.168.2.102'
    # host = '192.168.1.107'
    port = api_port
    protocol = 'http'
    url_base = protocol + '://' + host + ':' + port + '/rest/'

    standings_endpoint = url_base + 'watch/standings'
    print(standings_endpoint)

    resp = requests.get(standings_endpoint)
    request_time = current_milli_time()

    if resp.status_code != 200:
        # This means something went wrong.
        raise ApiError('GET /tasks/ {}'.format(resp.status_code))
    positionList = sorted(resp.json(), key=lambda k: k['position'])

    dbCurs = dbh.cursor(buffered=True)

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
        # print(i["slotID"])
        data = distillData(i)
        #print(data)
        liveInsertStmt = liveInsertStmtPrefix + str(i['slotID']) + ',' + str(i['lapsCompleted']) + ')' + liveInsertStmtSuffix + str(i['lapsCompleted'])
        #print(liveInsertStmt)
        dbCurs.execute(liveInsertStmt)
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
            redFlagInfoInsert = redFlagInfoInsertPrefix + str(i["slotID"]) + ',"' + str(i["driverName"]) + '",' + str(i["lapsCompleted"]) + ',' + str(i["position"]) + ')'
            print(redFlagInfoInsert)
            dbCurs.execute(redFlagInfoInsert)
        dbh.commit()

run()

