/**
  * @typedef Driver
  * @type {Object}
  * @param {string} driverName
  * @param {number} driverPosition
  * @param {number} driverPenalty
  * @param {number} driverLaps
  * @param {boolean} driverOnTrack
  * @param {boolean} driverInPit
  */

/**
  * Takes in response object from RF2 and retruns a Driver
  * @param {Object} response
  * @returns {Driver}
  */
function apiResponseToDriver(response) {
  return {
    driverName: response.driverName,
    driverPosition: response.position,
    driverPenalty: !!response.penalties,
    driverLaps: response.lapsCompleted,
    driveronTrack: !response.inGarageStall,
    driverInPit: response.pitting
  }
}
