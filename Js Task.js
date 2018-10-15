function isString (compare){
    if (!( typeof compare === 'string')){
        throw ( compare + ' : is not a String')
    }
}

function isNameValid (comapre){
    if(!(/^([A-Za-z0-9 ]){1,24}$/.test(comapre.trim()))){
        throw ( compare + ' : is not a all characters and between 1 and 24 length')
    }
}

function isHostnameValid (comapre){
    if(!(/^([A-Za-z0-9 ]){1,32}$/.test(comapre.trim()))){
        throw ( compare + ' : is not a all characters and between 1 and 32 length')
    }
}

function isNumber (compare){
    if (!( typeof compare === 'number')){
        throw ( compare + ' : is not a number')
    }
}

function isPositive (compare){
    if (!( compare > 0 )){
        throw ( compare + ' : is not a positive number')
    }
}

function isBigger (compare, comparewith){
    if (!(compare > comparewith)){
        throw ( compare + ' : is smaller than '+ comparewith)
    }
}

function rangeBetween (compare, min, max){
    if (!(compare >= min && compare <= max)){
        throw ( compare + ' : is not within range')
    }
}




let validate = {
    name: function (name) { 
        isString(name); 
        isNameValid(name) 
    },

    hostname: function (hostname) {
        isString(name); 
        isHostnameValid(hostname) 
    },

    description: function (description) {
        isString(description);
     },

    version: function (version){
        isPositive(version);
    },

    rating: function (rating){ isNumber(rating); rangeBetween(rating, 1, 10)
    }
}
let createdApp = [];
let createdStores = [];


class App {
    constructor(name, description, version, rating){
        if (!new.target) {
            return new App(name);
        }
            validate.name(name);
            validate.description(description);
            validate.version(version);
            validate.rating(rating);
            this.name = name,
            this.description = description,
            this.version = version,
            this.rating = rating

        createdApp.push(this);
    }
    release(input) {
        let option = {}
        if (typeof input != 'object'){
            option.version = input
        }
        if (isBigger(option.version > this.version || option.version === null || option.version === undefined)){
            throw ('The release is already up to date')
        }
        if (input.hasOwnProperty('description')){
            validate.description(option.description);
            this.description = option.description;
        }
        if (input.hasOwnProperty('rating')){
            validate.rating(option.rating);
            this.rating = option.rating;
        }
        this.version = option.version;
    }
}


class Store extends App {
    constructor(name, description, version, rating){
        if (!new.target) {
            return new Store(name);
        }
        super(name, description, version, rating),
        this.storeApps = [] || 'No Apps installed yet';
        createdStores.push(this);
    }

    uploadApp(storeApp){ 
        let appIndex = this.storeApps.findIndex(({name})=> name === this.storeApps.name);
        if (appIndex == -1) {
            storeApp = Object.assign(storeApp);
            this.storeApps.push(storeApp); 
            }  else { 
                if (storeApp.name == this.storeApps[appIndex].name && 
                    storeApp.version > this.storeApps[appIndex].version ){
                    this.storeApps[appIndex].description = storeApp.description;
                    this.storeApps[appIndex].version = storeApp.version;
                    this.storeApps[appIndex].rating = storeApp.rating 
                    } else { 
                        throw Error ('The current Version is up to date')
            }
        } 
    }
    
    takedownApp(storeApp) {
        let appIndex = this.storeApps.findIndex(({name})=> name === this.storeApps.name);
        this.storeApps.splice(appIndex, 1);
    }

    search(input){
        let searchArray = [];
        function sortFactory(prop) {
            return function(a,b){ return a[prop].localeCompare(b[prop]); };
         } // dont quite understand the behavior
        for ( let searchApp of this.storeApps){
            let appText = searchApp.name.toLowerCase().replace(' ','');
            let searchedText = input.toLowerCase().replace(' ','');
            console.log(appText)
            if( searchApp.name.includes(searchedText) ) {
                searchArray.push(searchApp)
            }
        }
        console.log(searchArray.sort(sortFactory('name')))
    }

    listMostRecentApps( input = 10){
        if (this.storeApps.length > input) {
            this.storeApps.length = input;
        }
        console.log(this.storeApps.reverse());
    }

    listMostPopularApps( count = 10 ){
        let ratedApp = this.storeApps.sort ( function (a,b){
            return b.rating - a.rating
        });
        if (ratedApp.length > count) {
            ratedApp.length = count;
        }
        console.log(ratedApp);
    } 
}
let googleStore = new Store ('Google Store', 'Google official store', 1.0, 8);

let googleMaps = new App ('Google Maps', 'The globe maps in you hands', 3.0, 8)
let uber = new App ('Uber', 'Go anywhere, the easy way', 2.0, 9);
let whatsApp = new App ('whatsApp', 'Connect Socially', 5.0, 6);
let facebook = new App ('Facebook', 'Bigest cosial network', 7.2, 8.5);

let itunes = new Store ('Itunes', 'Apple Official store',2.2 ,9.9 )

let instagram = new App ('Instagram', 'Instagram is a simple way to capture and share the world’s moments', 4.7, 10)
let snapchat = new App ('Snapchat', 'Life is more fun when you live in the moment :) Happy Snapping!', 7.3, 9.5)
let facetime = new App ('Face Time', 'Connect with family and friends around the world with FaceTime. Make audio and video calls from your iPhone, iPad, and iPod touch to other iOS devices or even a Mac.', 1.0, 8.6)

googleStore.uploadApp(googleMaps);
googleStore.uploadApp(uber);
googleStore.uploadApp(whatsApp);
googleStore.uploadApp(facebook);

googleMaps.version = 3.5;
googleMaps.description = 'updated From no where';

itunes.uploadApp(instagram);
itunes.uploadApp(facebook);
itunes.uploadApp(snapchat);
itunes.uploadApp(googleMaps);

class Device {
    constructor(config){
        this.hostname = config.hostname,
        this.apps = config.apps || 'No apps installed yet',
        this.stores = this.apps.filter( x => x instanceof Store)
    }

    install(appname){
        appname = appname.toLowerCase().replace(' ','');
        // console.log(appname);
        let lastestapp = {};
        let lastestversion = 0;

        for (let store of this.stores){
            for (let iterateapp of store.storeApps ){
                if (appname === iterateapp.name.toLowerCase().replace(' ','') && iterateapp.version > lastestversion ){
                    lastestversion = iterateapp.version;
                    lastestapp = iterateapp;
                }
            }
        }
        if ((this.apps.findIndex(({name})=> name.toLowerCase().replace(' ','') === appname)) === -1 ){
            this.apps.push(lastestapp);
        }
    }

    uninstall (appname){
        appname = appname.toLowerCase().replace(' ','');
        for (let i = 0; i<this.apps.length; i++){
            if ( appname === this.apps[i].name.toLowerCase().replace(' ','') ) {
                this.apps.splice(i, 1)
            }
        }
    }

    listinstalled() {
        function sortFactory(prop) {
            return function(a,b){ return a[prop].localeCompare(b[prop]); };
         }
        console.log(this.apps.sort(sortFactory('name')));
    }

    update(){
        let appNamed = [];
        for(let app of this.apps){
            appNamed.push(app.name);
        }
        console.log(appNamed);
    }
}

let preInstalledApps = [googleMaps,googleStore,facebook,itunes]
let myMobile = new Device ({ hostname : 'Samsung', apps: preInstalledApps });
    
// console.log(myMobile)
// console.log(createdApp)
// console.log(createdStores);
// myMobile.install('GoogleMaps')
// console.log(myMobile.apps)
// console.log(myMobile.stores[0].storeApps);
// console.log(myMobile.stores[1].storeApps);

myMobile.install('facebook')
myMobile.install('whatsApp')
myMobile.install('uber')

// console.log(myMobile.stores)
// console.log (myMobile.apps)
// myMobile.uninstall('facebook')
// console.log (myMobile.apps)
myMobile.update('googlemaps')
// Missing release options / update device / add filtering function to this.store device / adding time stamp in app seaarch / checking on listByMostRecent 
// console.log(myMobile.stores[0].storeApps[3])


