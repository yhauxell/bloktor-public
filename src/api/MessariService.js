import axios from 'axios';
const HOST = 'https://data.messari.io';
const PATH_V1 = 'v1/assets';
const PATH_V2 = 'v2/assets';
const HEADER = 'x-messari-api-key';
const API_KEY = 'c35d9f28-770e-4bf1-8f5b-37d45574dbcf';

const caller = axios.create({
  headers: {
    [HEADER]: API_KEY,
  },
  baseURL: `${HOST}/api`,
});

export default {
  async profiles(projetsId) {
    const profiles = {};
    if (Array.isArray(projetsId)) {
      for (let i = 0; i < projetsId.length; i++) {
        const projectId = projetsId[i];
        const profile = await this.profile(projectId);
        const metrics = await this.metrics(projectId);
        profiles[projectId] = { profile, metrics };
      }
    }
    return profiles;
  },
  async profile(asset = 'btc') {
    const response = await caller.get(
      `${PATH_V2}/${asset}/profile?fields=profile`
    );
    return response.data.data.profile;
  },
  async metrics(asset = 'btc') {
    const response = await caller.get(
      `${PATH_V1}/${asset}/metrics?fields=all_time_high,roi_data`
    );
    return response.data.data;
  },
};
