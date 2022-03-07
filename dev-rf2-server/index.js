import Fastify from "fastify";
import { faker } from "@faker-js/faker";
import { standingsCollection, sessionCollection } from './db/index.js';

const fastify = Fastify({ logger: true });
const URL_PREFIX = "/rest";
function genPath(path) {
	return `${URL_PREFIX}${path}`;
}

fastify.get("/", async () => {
	return { health: "OK" };
});

fastify.get(genPath("/watch/sessionInfo"), async (request) => {
  const {id} = request.query;
  let session = sessionCollection.findOne({ id: id });
  if (!session) {
    session = {
      id: id,
      playerFileName: faker.random.words(2),
      session: faker.helpers.randomize(["practice", "warmup", "race"]),
      endEventTime: new Date().getTime(),
      currentEventTime: new Date().getTime(),
      numberOfVehicles: randInRange(1, 15),
      serverName: faker.random.words(2),
      driverName: `${faker.name.firstName()} ${faker.name.lastName()}`,
	  }
    sessionCollection.insert(session);
  }
  return session;
});

fastify.get(genPath("/watch/standings"), async (request, _reply) => {
  const {id} = request.query;
  let standings = standingsCollection.find({id: id});
  if (!standings.length) {
    standings = range(0, randInRange(6, 10)).map((position) => {
      return {
        id: id,
        driverName: `${faker.name.findName()} ${faker.name.lastName()}`,
        driverPosition: position,
        penalties: 0,
        lapsCompleted: randInRange(0, 20),
        inGarageStall: null,
        pitting: false,
      };
    })
    standingsCollection.insert(standings)
  }
  return standings;
});

fastify.post(genPath("/chat"), async () => {
	return { resetPenalty: true };
});

fastify.post("/navigation/action", async () => {
	return { navigationDriver: true };
});

fastify.post("/navigation/action/NAV_RESTART_WEEKEND", async () => {
	return { navigationDriver: true };
});

fastify.post("/navigation/action/NAV_RESTART_RACE", async () => {
	return { navigationDriver: true };
});

fastify.post("/navigation/action/NAV_FINISH_SESSION", async () => {
	return { navigationDriver: true };
});

fastify.post("/navigation/action/leave", async () => {
	return { navigationDriver: true };
});

fastify.post("/navigation/action/go", async () => {
	return { navigationDriver: true };
});

fastify.get("/navigation/state", async () => {
	return { state: {
    navigationState: 'some state'
  } };
});

fastify.get(genPath("/race/selection"), async () => {
  return {
    track: {
      shortName: faker.random.words(),
      name: faker.random.words(),
    },
    car: {
      name: faker.vehicle.vehicle(),
      fullPathTree: faker.system.filePath()
    },
    series: {
      name: faker.random.words()
    }
  }
});

fastify.get(genPath("/race/car"), async () => {
  return range(0, 10).map(() => {
    return {
      name: faker.vehicle.vehicle(),
      id: faker.datatype.uuid(),
      fullPathTree: {
        livery_array: range(0, 4).map(() => faker.datatype.uuid())
      }
    }
  })
});

fastify.post(genPath("/race/car"), async () => {
  return {raceCar: 'race car'};
});

fastify.get(genPath("/options/assign/listconfigurations"), async () => {
  return {configurations: {}};
});

fastify.post(genPath("/options/assign/listconfigurations"), async () => {
  return {configurations: {}};
});


function range(start, end) {
	return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function randInRange(min, max) {
	return Math.random() * (max - min) + min;
}

async function start() {
	try {
		await fastify.listen(process.env.RF2_PORT || 3030);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}
start();
