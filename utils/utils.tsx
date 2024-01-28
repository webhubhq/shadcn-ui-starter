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

const rgbMapping = {
    0: 0,
    29: 1,
    57: 2,
    85: 3,
    114: 4,
    142: 5,
    170: 6,
    199: 7,
    227: 8,
    255: 9
  };

  function hslToRgb(h, s, l) {
    // Convert HSL to RGB
    let r, g, b;
  
    if (s === 0) {
      r = g = b = Math.round(l / 100 * 255);
    } else {
      const hueToRgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
  
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      const hue = h / 360;
  
      r = Math.round(hueToRgb(p, q, hue + 1 / 3) * 255);
      g = Math.round(hueToRgb(p, q, hue) * 255);
      b = Math.round(hueToRgb(p, q, hue - 1 / 3) * 255);
    }
      return [r, g, b];
  }
  
  function simplifyRGB(rgbColor) {
    const simplifiedColor = rgbColor.map(value => {
      const keys = Object.keys(rgbMapping);
      const closestValue = keys.reduce((a, b) => Math.abs(b - value) < Math.abs(a - value) ? b : a);
      return rgbMapping[closestValue];
    });
    return simplifiedColor;
  }

    function hslToScm(h,s,l) {
        return simplifyRGB(hslToRgb(h,s,l))
    }


    const calcMatrixIndex = (col, row, rows) => (col * rows) + (col % 2 ? row : (rows - 1 - row))


export { deployCRUDAPI, RID, extractDomain, extractRegionAndAccountIdFromExecutionArn, hslToRgb, simplifyRGB, hslToScm, calcMatrixIndex }

