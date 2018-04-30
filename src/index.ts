import * as http from 'http'
import * as cp from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

http.createServer((req, res) => {
    if (!req.url) return res.end('Missing url')
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
        // TODO remove this in production
        res.setHeader('Access-Control-Allow-Origin', '*')
        console.log('tex...')
        fs.writeFile(tex, input, err => {
            if (err) return res.end(err.message)
            console.log(latex)
            cp.exec(latex, (err, stdout) => {
                if (err) return res.end(err.message)
                cp.exec(`dvisvgm --relative -s  ${dvi}`, (err, stdout) => {
                    if (err) return res.end(err.message)
                    const lines = stdout.split('\n')
                    lines.splice(0, 2)
                    const svg = lines.join('')
                    res.end(svg)
                })
            })
        })
    } catch (e) {
        res.end(e)
    }
}).listen(9000)