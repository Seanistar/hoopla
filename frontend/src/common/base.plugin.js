const BasePlugin = {
  install (Vue, options) {
    const head = document.getElementsByTagName('head')[0]
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '//fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic|Material+Icons'
    head.appendChild(link)
  }
}

export default BasePlugin
