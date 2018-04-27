import * as http from 'http'
import * as latex from 'latex'

http.createServer((req, res) => {
    res.end(`
\\documentclass{article}
\\begin{document}
hello world
\\end{document}
`)
}).listen(9000)