// 实验对象
let html = "<div id=\"app\" v-if=\"true\">\n {{a}}\n </div>"

const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

function parseHTML(html) {
  const stack = []
  let last, lastTag
  let index = 0

  while(html) {
    last = html

    if(!lastTag) {
      let textEnd = html.indexOf('<')
      if(textEnd === 0) {
        const endTagMatch = html.match(endTag)
        if(endTagMatch) {
          console.log('end')
        }

        const startTagMatch = parseStartTag()
        if(startTagMatch) {
          handleStartTag(startTagMatch)
        }
      }
    }
  }

  function advance (n) {
    index += n
    html = html.substring(n)
  }
  
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if(start) {
      const match = {
        tagName: start[1],
        attrs: [],
        start: index,
      }
      advance(start[0].length)
      let end, attr
      while(!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
        attr.start = index
        advance(attr[0].length)
        attr.end = index
        match.attrs.push(attr)
      }
      console.log(end)
      if (end) {
        match.unarySlash = end[1]
        advance(end[0].length)
        match.end = index
        return match
      }
    }
  }
  
  function handleStartTag(match) {
    const tagName = match.tagName
    const unarySlash = match.unarySlash
  
    const l = match.attrs.length
    const attrs = new Array(1)
    for(let i = 0; i < l; i++) {
      const args = match.attrs[i]
      console.log(args)
    }
  }
}




// parseStartTag()
parseHTML(html)
