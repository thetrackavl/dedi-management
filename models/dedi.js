/**
  * @typedef Dedi
  * @type {Object}
  * @param {string} dediId
  * @param {string} serverName
  * @param {number|null|undefined} apiFailSession
  * @param {number|null|undefined} apiFailStandings
  * @param {number|null|undefined} apiCountdownSession
  * @param {number|null|undefined} apiCountdownStandings
  * @param {string} serverSession
  * @param {string} serverSessiontimeLeft
  * @param {number} serverNumberDrivers
  * @param {number} serverUp
  * @param {string} modName
  * @param {Driver[]} drivers
  */

/**
  * updates dedi standings
  * @param {Dedi} dedi
  * @returns {Dedi}
  */
async function updateDediStandings(dedi) {
    const driver_url = `${proxy_prefix}/standings/?port=${dedi.dediPort}`;
    const response = await axios
      .get(driver_url, { timeout: 500 })
      .catch(function (_error) {
        return {
          ...dedi,
          drivers: [],
          apiFailStandings: dedi.apiFailStandings ? 0 : dedi.apiFailStandings++,
        };
      });
    return {
      ...dedi,
      drivers: response.data.map(apiResponseToDriver),
      apiFailStandings: 0
    };
}

/**
  * updates dedi session
  * @param {Dedi} dedi
  * @returns {Dedi}
  */
async function updateDediSession(dedi) {
    const driver_url = `${proxy_prefix}/standings/?port=${dedi.dediPort}`;
    const response = await axios
      .get(driver_url, { timeout: 500 })
      .catch(function (_error) {
        return {
          ...dedi,
          apiFailSession: dedi.apiFailSession ? 0 : dedi.apiFailSession++,
        };
      });
    return {
      ...dedi,
      apiFailSession: 0,
      serverName: response.playerFileName,
      serverSession: session,
      serverSessiontimeLeft: new Date(
        (response.endEventTime - response.currentEventTime) * 1000).toISOString().substring(11, 19),
      serverNumberDrivers: response.numberOfVehicles,
      serverUp: response.numberOfVehicles,
      modName: response.serverName
    };
}
