const router = require('express').Router();
const { fetch } = require('undici');

router.use((req, res, next) => {
  res.locals.user = req.oidc.user;

  next();
});

router.get('/', (req, res) => {
  res.redirect('/hardware-inventory');
//  res.send('<div><a href="/hardware-inventory">Hardware inventory</a></div>');
});

router.get('/hardware-inventory', async (req, res) => {
  let { token_type, access_token, isExpired, refresh } = req.oidc.accessToken;

  const url = process.env.HARDWARE_INVENTORY_ITEMS_API_URL;

  let hardwareInventoryItems;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `${token_type} ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      hardwareInventoryItems = await response.json();
    }
  } catch (err) {
    throw err;
  }

  res.status(200).render(
    'index.pug',
    {
      hardwareInventoryItems
    }
  );
});

router.get('/hardware-inventory/create', (req, res) => {
  res.render('./create.pug');
});

router.post('/hardware-inventory/create', async (req, res) => {
  let { token_type, access_token, isExpired, refresh } = req.oidc.accessToken;

  const {
    name,
    label,
    category
  } = req.body;

  const url = process.env.HARDWARE_INVENTORY_ITEMS_API_URL;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `${token_type} ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, label, category })
    });

    if (!response.ok) {
      new Error('AHH!');
    }

  console.log(res.status);
  } catch (err) {
    throw err;
  }

  res.redirect(303, '/hardware-inventory');
});


module.exports.router = router;
