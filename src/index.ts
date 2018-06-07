import * as http from 'http'
import * as cp from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

console.log('starting tikz.men')
http.createServer((req, res) => {
    const error = (msg: string) => {
        res.end(
            `<svg height="30" width="200">
            <text x="0" y="15" fill="red">${msg}</text>
            </svg>`
        )
    }

    res.setHeader('Content-Type', 'image/svg+xml')
    if (!req.url) return error('Missing url')

    const dir = path.join(__dirname, 'tmp')
    const time = process.hrtime()
    const tex = path.join(dir, time + '.tex')
    const dvi = path.join(dir, time + '.dvi')
    const svg = path.join(dir, time + '.svg')

    const input = `
    \\documentclass[tikz]{standalone}
    \\usetikzlibrary{
        mindmap
        ,trees
    }
    \\begin{document}
    ${decodeURIComponent(req.url.substr(1))}
    \\end{document}    
    `

    const latex =
        `latex`
        + ` -interaction=nonstopmode`
        + ` -output-directory ${dir}`
        + ` ${tex}`
    try {
        fs.writeFile(tex, input, err => {
            if (err) return error(err.message)
            console.log(latex)
            cp.exec(latex, (err, stdout) => {
                if (err) return error(err.message)

                cp.exec(`dvisvgm --relative -s ${dvi}`
                    , (err, stdout) => {
                        if (err) return error(err.message)
                        const lines = stdout.split('\n')
                        lines.splice(0, 2)
                        const svg = lines.join('')
                        res.end(svg)
                    })
            })
        })
    } catch (e) {
        error('Error')
    }
}).listen(8979)