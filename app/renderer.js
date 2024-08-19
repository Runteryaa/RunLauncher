window.api.getConfig().then(config => {
    document.getElementById('accountname').textContent = config.accountname;
    

    const instancesContainer = document.querySelector('.instances');
    const instances = config.instances;
    for (const [category, versions] of Object.entries(instances)) {
      const details = document.createElement('details');
      details.className = 'vers';
      const summary = document.createElement('summary');
      summary.textContent = category;
      details.appendChild(summary);
      for (const [version, path] of Object.entries(versions)) {
        const p = document.createElement('p');
        p.setAttribute('path', path);
        p.textContent = version;
        details.appendChild(p);
      }
      instancesContainer.appendChild(details);
    }
  }).catch(err => {
    console.error('Failed to get config:', err);
  });
  