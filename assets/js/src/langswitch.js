// Keep the current section when switching languages: on click, append
// the currently visible section's id as a hash to the language link's
// target URL, instead of always landing back at the top of the page.
(() => {
  function getCurrentSectionId() {
    const sections = [...document.querySelectorAll('main > section[id]')]
    const navEl = document.querySelector('nav')
    const navHeight = navEl ? navEl.clientHeight : 0
    let current = null
    for (const sec of sections) {
      if (sec.getBoundingClientRect().top <= navHeight + 40) {
        current = sec
      }
    }
    return current ? current.id : null
  }

  const langLinks = document.querySelectorAll('#language h3 a')
  langLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const id = getCurrentSectionId()
      if (id) {
        const url = new URL(link.href)
        url.hash = id
        link.href = url.href
      }
    })
  })
})()