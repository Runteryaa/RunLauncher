window.api.getConfig().then(config => {
    document.getElementById('accountname').textContent = config.accountname;
    const newbie = config.newbbie;
    const eastereggs = config.eastereggs;
    const instances = config.instances;

    const instancesContainer = document.querySelector('.instances');
    for (const [category, versions] of Object.entries(instances)) {
      const details = document.createElement('details');
      details.className = 'vers';
      const summary = document.createElement('summary');
      summary.textContent = category;
      details.appendChild(summary);
      for (const [version, path] of Object.entries(versions)) {
        const p = document.createElement('p');
        p.setAttribute('path', path);
        p.setAttribute('btn', "");
        p.textContent = version;
        details.appendChild(p);
      }
      instancesContainer.appendChild(details);
    }

    if (eastereggs) {
      console.log(eastereggs)
      console.log("eastereggs")
      const script = document.createElement('script');
      script.src = 'easteregg.js';
      document.body.appendChild(script);
    }

  }).catch(err => {
    console.error('Failed to get config:', err);
  });
  