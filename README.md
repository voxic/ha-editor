# ha-editor
A web-based editor for home assistant based on the Monaco editor.



## Getting Started

The editor is made to be run on the same system as home assistant and presented as a panel inside of the webpage of home assistant.

Discussion at:
https://community.home-assistant.io/t/web-based-editor/32051

![alt text](https://github.com/voxic/ha-editor/blob/master/haeditor.PNG)

### Prerequisites

As of now the editor is served with nodejs.


### Installing

#### Docker
Install docker, for RaspberryPi see https://www.raspberrypi.org/blog/docker-comes-to-raspberry-pi/

sudo docker pull voxic/ha-editor

cd /location_of_homeassistant_configfiles
sudo docker run -d -p 3000:3000 --mount type=bind,source="$(pwd)"/,target=/usr/src/app/configFolder voxic/ha-editor

Edit configuration.yaml and add the following:

```
# Enable the editor panel
panel_iframe:
  editor:
    title: 'Editor'
    url: 'http://xxx.xxx.xxx.xxx:3000' #IP to your home assistant
    icon: mdi:book-open
```

Restart Home assistant

#### Nodejs
Make sure that you can run node and npm.

Clone this repo.

```
git clone https://github.com/voxic/ha-editor.git

```
Go in to the folder and install NPM modules

```
cd ha-editor
npm install
```

Edit app.js and the variable ```baseDir``` to point to the folder where you home assistant config files are located.

```
let baseDir = "configFolder"
```

Edit configuration.yaml and add the following:

```
# Enable the editor panel
panel_iframe:
  editor:
    title: 'Editor'
    url: 'http://xxx.xxx.xxx.xxx:3000' #IP to your home assistant
    icon: mdi:book-open
```

Restart home assistant and start the web-editor
```
cd ha-editor
node app.js
```

Enjoy!



## Built With

* Monaco-editor
* Bootstrap
* Express
* EJS
* Jquery


## Authors

* **Emil Nilsson** - [voxic](https://github.com/voxic)


## License

This project is licensed under the MIT License - see the [LICENSE](http://rem.mit-license.org) for details.
