const TextModes = {
    DATA: 'DATA',
    RCDATA: 'RCDATA',
    RAWTEXT: 'RAWTEXT',
    CDATA: 'CDATA'
}

function parse(str) {
    const context = {
        source: str,
        mode: TextModes.DATA
    }
    const
}