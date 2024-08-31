window.api.getConfig().then(config => {
  const accountname = config.accountname;
  const newbie = config.newbie;
  const eastereggs = config.eastereggs;
  const instances = config.instances;

  // accountname
  document.getElementById('accountname').textContent = accountname;

  // newbie
  if (newbie) {
    console.log("newbie");
    const newbieDiv = document.querySelector('#newbie');
    newbieDiv.style.display = 'flex';
  }

  if (config.newbie) {
    config.newbie = false;

  window.api.saveConfig(config).then(() => {
    console.log("Updated newbie setting to false.");
  })
}


  // eastereggs
  if (eastereggs) {
    console.log("eastereggs");
    const script = document.createElement('script');
    script.src = 'easteregg.js';
    document.body.appendChild(script);
  }

  // instances
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
}).catch(err => {
  console.error('Failed to get config:', err);
});
