# MEP Dashboard
Dashboard (with server) for collection and visualising data.
![Dashboard](./docs/assets/dashboard.png)


## Installation
*only for Debian distros

- Install Node.js & npm
```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
```
- Install git `sudo apt-get install git`
- Install MEP Dashboard
```
git clone https://github.com/Memristor-Robotics/mep-dash.git --depth 1 && cd mep-dash && ./install
```

## Start
Run `./dash` or `node Bootstrap.js`

## Import/Export
- Use `node Dumper.js --load-kibana-settings` to load settings to to Kibana,
- or `node Dumper.js --save-kibana-settings` to store settings for later usage.
