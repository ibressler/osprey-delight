(() => {
  var ANIMATION_TIME = 500

  window.addEventListener('popstate', (event) => {
    if (event.state == null) {
      active = $('div.modal.active')
      if (active) {
        close(active)
      }
    } else if ('modal' in event.state) {
      open($(`#modal-${event.state.modal}`))
    }
  })

  function close(modal) {
    history.replaceState(null, "", "")
    box = modal.firstElementChild
    box.classList.remove('scale-in-center')
    box.classList.add('scale-out-center')

    setTimeout(() => modal.classList.remove('active'), ANIMATION_TIME)
  }


  {{ if .Site.Params.Feat.useTermynal -}}
    var terms = {};
    var termOptions = {};
    {{ range where .Site.RegularPages "Section" "gallery" }}
    {{ if .Params.terminal -}}
      {{ if .Params.terminal.options -}}
        termOptions["{{ .File.TranslationBaseName }}"] = JSON.parse('{{ .Params.terminal.options | jsonify }}')
      {{- else -}}
        termOptions["{{ .File.TranslationBaseName }}"] = {}
      {{- end }}
    {{- end }}
    {{- end }}
  {{- end }}


  function open(modal) {
    const modalID = modal.getAttribute('id')
    modal.classList.add('active')

    box = modal.firstElementChild
    box.classList.remove('scale-out-center')
    box.classList.add('scale-in-center')

    $(`#${modalID} .close`).onclick = (_) => { close(modal) }
    window.onclick = (e) => {
      if (e.target === modal) {
        close(modal)
      }
    }
    document.onkeydown = (e) => {
      if (e.key === 'Escape') {
        close(modal)
      }
    }

    {{ if .Site.Params.Feat.useTermynal -}}
    var termKey = modalID.replace('modal-', '')
    var term = $(`#term-${termKey}`)
    if (term !== null && typeof terms[termKey] === 'undefined') {
      var options = termOptions[termKey]
      options.onExitCommand = () => {
        term.classList.add('scale-out-center')
        setTimeout(() => {
          $(`#content-${termKey}`).removeAttribute("hidden")
          term.setAttribute("hidden", true)
        }, ANIMATION_TIME + 10)
      }
      terms[termKey] = new Termynal(term, options)
    }
    {{- end }}
  }


  // Open modal on link click
  $$('.gallery-modal-link').forEach((link) => {
    function getLinkID(url) {
      const parts = url.split('#')
      return parts[parts.length-1]
    }
    link.onclick = (e) => {
      e.preventDefault()  // omit auto scroll to anchor link
      id = getLinkID(e.target.getAttribute('href'))
      const url = e.target.getAttribute('href')
      history.pushState({modal: id}, "", `${url}`)
      open($(`#modal-${id}`))
    }
    const loc = window.location.href
    const seg = loc.split('#')
    linkid = getLinkID(link.getAttribute('href'))
    if (linkid == seg[seg.length-1]) {
      // TODO(kdevo): Add check if actually arrived at gallery item
      setTimeout(() => {
        open($(`#modal-${getLinkID(link.getAttribute('href'))}`))
      }, ANIMATION_TIME * 2)
    }
  })
})()
