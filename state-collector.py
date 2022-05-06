import redis
import requests
import random
import math
import json
import datetime
from multiprocessing.pool import ThreadPool as Pool
import threading

proxyIp = "192.168.2.102"
proxyPort = "3000"
proxyPrefix = "http://" + proxyIp + ":" + proxyPort

apiFailMax = 5
countdownDefault = 10

pool_size = 15

db = redis.Redis(
    host='172.26.105.150',
    port=6379,
    decode_responses=True)

dedis_file = open("dedis.json")
pods_file = open("pods.json")

dedis = json.load(dedis_file)
pods = json.load(pods_file)

dedis_file.close()
pods_file.close()

def manage_data(api_func, fail_func, dataObj, objectKey, failKey, countdownKey, failMax = apiFailMax, countdown = countdownDefault):
    # check for intialized values
    if db.get(objectKey + "-" +  failKey) is None:
        db.set(objectKey + "-" +  failKey,0)
    if db.get(objectKey + "-" +  countdownKey) is None:
        db.set(objectKey + "-" +  countdownKey,0)
    
    # next check for max fails
	# if fails >= max fails, set total failure (bit and data)
	# 	and check countdown
    # if countdown < 1, reset api fail to max - 1
	# if countdown > 0, decrement countdown and return
    if int(db.get(objectKey + "-" +  failKey)) >= failMax:
        print("starting countdown")
        fail_func(objectKey)
        if int(db.get(objectKey + "-" +  countdownKey)) < 1:
            db.set(objectKey + "-" +  failKey,failMax - 1)
        else:
            db.decr(objectKey + "-" +  countdownKey,1)
            return
    # all looks good, we will make an api call
    try:
        print("trying the api")
        api_func(objectKey)
    except Exception as ex:
        print(ex.args)
        db.incr(objectKey + "-" +  failKey,1)
        if int(db.get(objectKey + "-" +  failKey)) >= failMax:
            db.set(objectKey + "-" +  countdownKey,math.floor(random.random() * countdown))
    else:
        print("resetting fail count")
        db.set(objectKey + "-" +  failKey,0)
    return

def update_dedi_sessions():
    threading.Timer(1.0,update_dedi_sessions).start()
    workerPool = Pool(pool_size)
    for dedi in dedis:
        print(dedi)
        workerPool.apply_async(manage_data(
            update_dedi_session,
            error_dedi_session,
            dedi,
            dedi["dediPort"],
            "apiFailSession",
            "apiCountdownSession"))

def update_dedi_standings():
    threading.Timer(1.0,update_dedi_standings).start()
    workerPool = Pool(pool_size)
    for dedi in dedis:
        print(dedi)
        workerPool.apply_async(manage_data(
            update_dedi_standing,
            error_dedi_standings,
            dedi,
            dedi["dediPort"],
            "apiFailStandings",
            "apiCountdownStandings"))

def update_pod_info():
    threading.Timer(1.0,update_dedi_info).start()
    workerPool = Pool(pool_size)
    for pod in pods:
        workerPool.apply_async(manage_data(
            update_pod_nav,
            error_pod_nav,
            pod,
            pod["podId"],
            "apiFailNav",
            "apiCountdownNav"))
        workerPool.apply_async(manage_data(
            update_pod_session,
            error_pod_session,
            pod,
            pod["podId"],
            "apiFailPodSession",
            "apiCountdownPodSession"))
        workerPool.apply_async(manage_data(
            update_pod_race_selection,
            error_pod_race_selection,
            pod,
            pod["podId"],
            "apiFailPodRaceSelection",
            "apiCountdownPodRaceSelection"))


def error_dedi_session(dediPort):
    db.set(dediPort + "-" +  "serverUp","error")

def update_dedi_session(dediPort):
    print("in update session")
    url = proxyPrefix + "/session/?port=" + dediPort
    sessionDataRaw = requests.get(url,timeout=0.5)
    print(sessionDataRaw.status_code)
    if (sessionDataRaw.status_code > 299 or sessionDataRaw.status_code < 200):
        print("api-fail")
        raise Exception("failed call - " + sessionData)
    else:
        # update the db
        sessionData = sessionDataRaw.json()
        print(sessionData)
        db.set(dediPort + "-" +  "serverName",sessionData["playerFileName"])
        db.set(dediPort + "-" +  "serverSession",sessionData["session"])
        db.set(dediPort + "-" +  "serverNumberDrivers",sessionData["numberOfVehicles"])
        db.set(dediPort + "-" +  "serverUp",sessionData["numberOfVehicles"])
        db.set(dediPort + "-" +  "modName",sessionData["serverName"])
        db.set(dediPort + "-" +  "serverSessionTimeLeft",str(datetime.timedelta(seconds = (sessionData["endEventTime"] - sessionData["currentEventTime"]))))
        
def error_dedi_standings(dediPort):
    db.set(dediPort + "-" +  "drivers",'')

def update_dedi_standing(dediPort):
    url = proxyPrefix + "/standings/?port=" + dediPort
    standingsDataRaw = requests.get(url,timeout=0.5)
    print(standingsDataRaw.status_code)
    if (standingsDataRaw.status_code > 299 or standingsDataRaw.status_code < 200):
        print("api-fail-standings")
        raise Exception("failed call - " + standingsDataRaw.status_code)
    else:
        # update the db
        standingsData = standingsDataRaw.json()
        # print(standingsData)
        for driver in standingsData:
            print(driver["driverName"])
            print(driver["slotID"])
            db.set(dediPort + "-" +  str(driver["slotID"]) + "-" +  "driverName",driver["driverName"])
            db.set(dediPort + "-" +  str(driver["slotID"]) + "-" +  "driverPosition",driver["position"])
            db.set(dediPort + "-" +  str(driver["slotID"]) + "-" +  "driverPenalty",driver["penalties"])
            db.set(dediPort + "-" +  str(driver["slotID"]) + "-" +  "driverLaps",driver["lapsCompleted"])
            db.set(dediPort + "-" +  str(driver["slotID"]) + "-" +  "driverOnTrack",0 if driver["inGarageStall"] else 1)
            db.set(dediPort + "-" +  str(driver["slotID"]) + "-" +  "driverInPit",1 if driver["pitting"] else 0)
    return
update_dedi_sessions()
update_dedi_standings()
