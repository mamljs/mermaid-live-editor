var url = require('url')
var mime = require('mime-types')
var path = require('path')
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var process = require('process')
const fs = require('fs')
const port = 12222
const pidFile = './Server.pid'

app.listen(port)
let data = ""

function handler(request, response) {
    var pathname = url.parse(request.url).pathname
    if (pathname == '/') {
        pathname = '/index.html'
    }
    if (pathname == '/data') {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        })
        response.write(data)
        response.end()
        return
    }
    var realPath = path.join(".", pathname)
    var ext = path.extname(realPath)
    ext = ext ? ext.slice(1) : 'unknown'
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            })

            response.write("This request URL " + pathname + " was not found on this server.")
            response.end()
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    })
                    response.end(err)
                } else {
                    response.writeHead(200, {
                        'Content-Type': mime.lookup(ext)
                    })
                    response.write(file, "binary")
                    response.end()
                }
            })
        }
    })
}

io.on('connection', function (socket) {
    log(socket.id + ' connect')
    socket.on('save', function (msg) {
        log('save command by ' + socket.id)
        data = msg
        io.sockets.emit('sync', msg)
    })

    socket.on('disconnect', function () {
        log(socket.id + ' disconnect')
        io.emit('user disconnected')
    })

    socket.on('get', function () {
        io.emit('get', data)
    })
})

fs.writeFile(pidFile, process.pid, (err) => {
    if (err) throw err
    log('pid file create with pid ' + process.pid)
})

process.on('SIGINT', () => {
    rmPidFile()
    process.exit()
})
process.on('SIGTERM', () => {
    rmPidFile()
    process.exit()
})


function rmPidFile(){
    fs.unlink(pidFile, (err) => {
        if (err) throw err
    })
}
function log(str){
    let date = '[' + new Date().toDateString() + ' ' + new Date().toTimeString() + ']'
    console.log(date + ' : ' + str)
}