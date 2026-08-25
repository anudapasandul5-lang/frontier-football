import './style.css'

// Proves the module graph and CSS pipeline both survive the production build.
const status = document.querySelector('[data-build-status]')
if (status) status.textContent = 'Site in build'
