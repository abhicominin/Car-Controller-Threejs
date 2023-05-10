const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const ip = require('internal-ip')
const portFinderSync = require('portfinder-sync')

const infoColor = (_message) =>
{
    return `[1m[34m${_message}[39m[22m`
}

module.exports = merge(
    commonConfiguration,
    {
        mode: 'development',
        devServer:
        {
            host: '0.0.0.0',
            port: portFinderSync.getPort(8080),
            contentBase: './dist',
            watchContentBase: true,
            open: true,
            https: false,
            useLocalIp: true,
            disableHostCheck: true,
            overlay: true,
            noInfo: true,
            after: function(app, server, compiler)
            {
                const port = server.options.port
                const https = server.options.https ? 's' : ''
                const localIp = ip.v4.sync()
                const domain1 = `http${https}://${localIp}:${port}`
                const domain2 = `http${https}://localhost:${port}`

                console.log(`Project running at:
  - ${infoColor(domain1)}
  - ${infoColor(domain2)}`)
            }
        }
    }
)
