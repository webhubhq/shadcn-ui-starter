import unfetch from 'unfetch';

// import getConfig from 'next/config';

// const { publicRuntimeConfig } = getConfig();
// const _webhub_db_url = 'https://7lgnkvykt8.execute-api.us-east-2.amazonaws.com'; // publicRuntimeConfig.WEBHUB_DB_URL;

const deployCRUDAPI = async ({ name = "", email = "", rid = "" }) => {
  const url = 'https://webhub.up.railway.app/api/deploy/coreAPI';
  const res = await unfetch(url, {
      method: 'POST',
      body: JSON.stringify({ name, email, rid }),
      headers: {
        'Content-Type': 'application/json',
      },
  });
  if (res.status === 200) {
      return Promise.resolve(res.json());
  }
  console.error(res);
  return Promise.reject(`error ${res.status} received from server`);
};



const apiRequest = async ({ url = "", method = "", data = {} }) => {

    const res = await unfetch('/app/api/api.js', {
        method: 'POST',
        body: JSON.stringify({ url, method, data }),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
    });
    if (res.status === 200) {
        return Promise.resolve(res.json());
    } return Promise.reject(`error ${res.status} received from server`);
  };

const RID = (l= 5) => {
    const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let rid = '';
    for (let i = 0; i < l; i += 1) {
        const r = Math.random() * c.length;
        rid += c.substring(r, r + 1);
    }
    return rid;
};

const extractDomain = (url: string) => {
    // Remove "http://" or "https://"
    url = url.replace("http://", "").replace("https://", "");
    
    // Extract domain by taking everything before the first "/"
    const domain = url.split('/')[0];
    
    return domain;
}

const extractRegionAndAccountIdFromExecutionArn = (inputString: string) => {
    const components = inputString.split(":");
    const region = components[3];
    const accountId = components[4];
    
    return { region, accountId };
}


export { deployCRUDAPI, RID, apiRequest, extractDomain, extractRegionAndAccountIdFromExecutionArn }

