import CoinGecko from 'coingecko-api';
const CoinGeckoClient = new CoinGecko();

const executePriceCall = async (params) => {
  try {
    const result = CoinGeckoClient.simple.price(params);
    
    return result;
  } catch (error) {
    console.error(error);
  }
};

let realtimeFetchInterval = null;

const startLivePriceInterval = (params, onUpdate) => {
  const run = async () =>{ 
    const { data } = await executePriceCall(params);
    onUpdate({
      live_price: data,
    });
  };
  realtimeFetchInterval = setInterval(async () => {
    run();
  }, 300000); //price update cycle for coingecko is 5 minutes

  run(); //first run, then with the interval above
};

const stopLivePriceInterval = () => clearInterval(realtimeFetchInterval);

onmessage = function(request) {
  const { run, params } = request.data;
  switch (run) {
    case 'live_price':
      if(realtimeFetchInterval !== null){
        stopLivePriceInterval();
      }
      
      startLivePriceInterval(params, postMessage);
      break;
    case 'stop_live_price':
      stopLivePriceInterval();
      break;
  }
};
