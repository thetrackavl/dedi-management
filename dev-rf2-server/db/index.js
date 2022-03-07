import loki from 'lokijs';

export const DB = new loki('rf2.db');

export const sessionCollection = DB.addCollection('session');
export const standingsCollection = DB.addCollection('standings');
export const raceCollestion = DB.addCollection('race');
export const carCollection = DB.addCollection('car');
