import * as http from 'http'
import * as cp from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

http.createServer((req, res) => {
    const dir = path.join(__dirname, 'tmp')
    const time = process.hrtime()
    const tex = path.join(dir, time + '.tex')
    const pdf = path.join(dir, time + '.pdf')
    const dvi = path.join(dir, time + '.dvi')
    const svg = path.join(dir, time + '.svg')

    const input = `
    \\documentclass[tikz]{standalone}
    \\usetikzlibrary{}
    \\begin{document}
    \\begin{tikzpicture}
    \\fill[gray] (3,3) rectangle +(5,5);
    \\fill[green] (0,0) rectangle +(5,5);
    \\draw[thick] (0,5) -- +(3,3);
    \\draw[thick] (5,5) -- +(3,3);
    \\draw[thick] (5,0) -- +(3,3);
    \\end{tikzpicture}
    \\end{document}    
    `

    const latex =
        `latex`
        + ` -interaction=nonstopmode`
        + ` -output-directory ${dir}`
        + ` ${tex}`
    try {
        console.log('tex...')
        fs.writeFile(tex, input, err => {
            console.log(latex)
            cp.exec(latex, (err, stdout) => {
                cp.exec(`dvisvgm --relative -s  ${dvi}`, (err, stdout) => {
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