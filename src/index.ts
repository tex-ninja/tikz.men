import * as http from 'http'
import * as cp from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import latex = require('latex')

latex('lala');

http.createServer((req, res) => {
    const latex = `
    \\documentclass[crop,tikz]{standalone}
    \\usetikzlibrary{}
    \\begin{document}
    \\begin{tikzpicture}
      \\draw (0,0) -- (10,10);
      \\fill[green] (0,0) rectangle (20,20);
    \\end{tikzpicture}
    \\end{document}    
    `

    const dir = path.join(__dirname, 'tmp')
    const time = process.hrtime()
    const tex = path.join(dir, time + '.tex')
    const pdf = path.join(dir, time + '.pdf')
    const png = path.join(dir, time + '.png')

    try {
        console.log('tex...')
        fs.writeFile(tex, latex, err => {
            console.log(`pdflatex -interaction=nonstopmode -output-directory ${dir} ${tex}`)
            cp.exec(`pdflatex -output-directory ${dir} ${tex}`, (err, stdout) => {
                console.log(`convert ${pdf} ${png}`)
                cp.exec(`convert ${pdf} ${png}`, (err, stdout) => {
                    console.log('done')
                    fs.readFile(png, (err, data) => {
                        res.end(`err: ${err} data: ${data}`)
                    })
                })
            })
        })
    } catch (e) {
        res.end(e)
    }
}).listen(9000)