'use strict';

const os = require('os');

// Reference: http://stackoverflow.com/a/8440736
function FindExternalIP() {
    let ifaces = os.networkInterfaces();
    for (let ifname in ifaces) {
        var alias = 0;

        for (let iface of ifaces[ifname]) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                continue;
            }

            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                //console.log(ifname + ':' + alias, iface.address);
                return iface.address;
            } else {
                // this interface has only one ipv4 adress
                return iface.address.toString();
            }
            ++alias;
        }
    }
}

module.exports = FindExternalIP;