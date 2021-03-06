import * as cp from 'child_process';
import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';

http.createServer((req, res) => {
    const error = () => {
        res.statusCode = 404
        res.statusMessage = 'Not found';
        res.end(
            `<svg xmlns="http://www.w3.org/2000/svg">
            <text x="10" y="20" fill="red">tikz error :(</text>
            </svg>`
        )
    }

    res.setHeader('Content-Type', 'image/svg+xml')
    res.setHeader('Cache-Control', 'public, max-age=31536000')
    if (!req.url) return error()

    const dir = '/'
    const time = process.hrtime()
    const tex = path.join(dir, time + '.tex')
    const dvi = path.join(dir, time + '.dvi')

    const input = `
    \\documentclass[tikz]{standalone}
    \\usetikzlibrary{
        mindmap
        ,trees
        ,decorations.pathmorphing
        ,shapes.geometric
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
            if (err) return error()
            cp.exec(latex, (err, stdout) => {
                if (err) return error()

                cp.exec(`dvisvgm --relative -s ${dvi}`
                    , (err, stdout) => {
                        if (err) return error()
                        const lines = stdout.split('\n')
                        lines.splice(0, 2)
                        const svg = lines.join('')
                        res.end(svg)
                    })
            })
        })
    } catch (e) {
        error()
    }
}).listen(8979)