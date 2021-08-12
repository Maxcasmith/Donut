module.exports = function(io)
{
    io.on('connection', (socket) => {
        console.log('A user connected');
    });
}