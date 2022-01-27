/* eslint-disable camelcase */
/* eslint-disable max-len */
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

const functions = require('firebase-functions');

const CoinGecko = require('coingecko-api');

const cors = require('cors')({
  origin: true,
});

// const serviceAccount =
// require('./../bloktor-com-firebase-adminsdk-91ebo-234dbe78df.json');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.sync_coin_data = functions.https.onRequest(
    async (request, response) => {
      const CoinGeckoClient = new CoinGecko();
      functions.logger.info('Requesting data from CoinGecko!', {
        structuredData: true,
      });
      const {data} = await CoinGeckoClient.coins.list();
      functions.logger.info(`Found ${data.length} coins`, {
        structuredData: true,
      });
      if (Array.isArray(data)) {
        const size = 400;
        const batch400 = new Array(Math.ceil(data.length / size))
            .fill()
            .map((_) => data.splice(0, size));

        for (const subset of batch400) {
          const batch = db.batch();
          subset.forEach((coin) => {
            const ref = db.collection('coin').doc();
            batch.set(ref, coin);
          });
          await batch.commit();
        }
      }

      response.send(data);
    },
);

exports.get_coins_count = functions.https.onRequest(
    async (request, response) => {
      const collection = await db.collection('coin').get();

      response.send(collection.size);
    },
);

exports.hello = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    response.send({status: 'OK', data: ''});
  });
});

let projects = null;

exports.search_project = functions.https.onCall(async (data, context) => {
  const term = data.term;

  projects = projects || (await db.collection('project').get());

  const result = projects.docs
      .filter((doc) => {
        const {ticker, name} = doc.data();
        return (
          ticker.toLowerCase().indexOf(term) >= 0 ||
        name.toLowerCase().indexOf(term) >= 0
        );
      })
      .map((doc) => {
        const {ticker, name} = doc.data();
        return {id: doc.id, ticker, name};
      });
  console.log('search_project::result :>> ', result);
  return result;
});

// exports.price_alerts = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
exports.price_alerts = functions.https.onRequest(async (request, response) => {
  functions.logger.info('Running scheduled fn!');

  try {
    // Alerts from firestore first
    const alertDataset = await db.collection('alert').get();
    // Then take the data only
    const alerts = alertDataset.docs.map((alert) => ({
      ref: alert.ref,
      ...alert.data(),
    }));
    // Group alerts per project since its the way of direct the prices comparison, etc.
    const projectsAlerts = alerts.reduce((filter, alert) => {
      filter[alert.project] = alert;
      return filter;
    }, {});
    // Get unique projectsIds to fetch their current prices from Coingecko
    const projectsId = Object.keys(projectsAlerts);

    const CoinGeckoClient = new CoinGecko();
    const results = await CoinGeckoClient.simple.price({
      ids: projectsId,
      vs_currencies: ['usd'],
    });
    const updatables = [];
    // Given the price results, now lets do some comparisons
    Object.entries(results.data).forEach(([projectId, {usd: value}]) => {
      const {
        ref,
        target_price,
        direction,
        frecuency,
        executed,
        read,
      } = projectsAlerts[projectId];
      console.log(
          'data :>> ',
          target_price,
          direction,
          frecuency,
          executed,
          ref,
      );
      if (read !== false) {
        switch (direction) {
          case 'ABOVE':
            if (value > target_price) {
              updatables.push([
                ref,
                {read: false, executed: (executed || 0) + 1, current_value: value},
              ]);
            }
            break;
          case 'BELLOW':
            if (value < target_price) {
              updatables.push([
                ref,
                {read: false, executed: (executed || 0) + 1, current_value: value},
              ]);
            }
            break;
        // TODO continue with other cases
        }
      }
    });

    const batch = db.batch();
    updatables.forEach(([ref, data]) => {
      batch.update(ref, data);
    });
    await batch.commit();

    console.log('updatables :>> ', updatables);

    response.send(updatables);
  } catch (error) {
    console.error(error);

    response.status(500).send('Server Error');
  }
});
