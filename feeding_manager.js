"use strict";

// include the file system library to allow access to system files
var fs = require('fs');

// create a web server and set the callback to serverHandler
// the callback will be called when you connect to the web
// page from the browser
var app = require('http').createServer(serverHandler);

// use the socket.io library to listen for updates for updates from the browser
var io = require('./node_modules/socket.io').listen(app);

// listen for updates from the web browser on port 8085
app.listen(3000);

// turn websockets on and call the onConnect callback when a connection
// from the web browser is initiated
io.sockets.on('connection', onConnect);

// declare htmlPage variable to tell the server which web page to serve
var htmlPage = 'feeding_manager.html';

// declare variables
var soc;
var monitorRequested = false;

// Potter Variables 
var restartAlgorithm = 0;
var publish_request = 0;

// My Variables 
var pin10 = 10;
var pin11 = 11;
var pin12 = 12;

var foodWeight = 0;
var time = 0;
var duration = 0;

var foodWeightReflect = "No Weight";
var timeReflect = "No Time";
var durationReflect = "No Duration"


// print to console that the program is starting
console.log("Starting Sample Manager server")

// this is the callback from the createServer call above that is called when a 
// browser tries to connect to the webpage.  You can ignore the details of this function.
function serverHandler(req, res) 
{
    fs.readFile(htmlPage, function(err, data) 
    {
        if (err) 
        {
            res.writeHead(500);
            return res.end('Error loading file: ' + htmlPage);
        }
        res.writeHead(200);
        res.end(data);
    }
    );
}

// this is the callback that is called when a connection is made with the web browser
// it is used to set up callbacks based on messages that could be received from the 
// web page.  For instance, if this js program receives a websocket message called 'monitor'
// at any point while the program is running, it will automatically call handleMonitorRequest
function onConnect(socket) 
{
    // set up callback for monitor message
    socket.on('monitor', handleMonitorRequest);

    // set up callback for loadValues message
    socket.on('loadParameters', handleLoadParameters);

    // set up callback for restartAlgorithm message
     socket.on('restartAlgorithm', handleRestartAlgorithm);
    
    // save the socket identifier in a variable
    soc = socket;
    soc.emit("pinUpdate", '{"pin":"' + pin10 + '", "foodWeightReflect":"' + foodWeightReflect + '"}');
    soc.emit("pinUpdate", '{"pin":"' + pin11 + '", "timeReflect":"' + timeReflect + '"}');
    soc.emit("pinUpdate", '{"pin":"' + pin12 + '", "durationReflect":"' + durationReflect + '"}');
}

// this is the callback for the loadValues message
// if the loadValues message is received from the web page,
// this function is called and the values from that loadValues
// message are containted in the data argument
function handleLoadParameters(data)
{
    // print the min and max to the console
    console.log('////////////////////////////////');

    console.log('Food Weight = ' + data.Food_Weight);
    console.log('Time = ' + data.Time);
    console.log('Duration = ' + data.Duration);

    console.log('////////////////////////////////');

    foodWeight = data.Food_Weight;
    time = data.Time;
    duration = data.Duration;

    publish_request = 1;
    console.log("Requesting PUBLISH");
    // put the min and max into a string, separated by a space
    var min_max_values = data.squareFeet + " " + data.ceilingHeight;
}

function handleRestartAlgorithm(data)
{
	restartAlgorithm = 1;
	publish_request = 1;
	console.log("Requesting PUBLISH");
}

// this is the callback from the monitor message
// it allows the webpage to tell the server that it wants a pin monitored and
// specifies the name of the pin as an argument
function handleMonitorRequest(pin) 
{
    // save state variable that indicates that a pin monitor is requested
    monitorRequested = true;
}

// this function is called by the setInterval function
function check_status()
{
 /*   var status = 3;

    
    // if the web page has requested that we monitor the pin, then send the pin data to the web page
    if(monitorRequested)
    {
        soc.emit("pinUpdate", '{"pin":"' + pin1 + '", "status":' + status + '}');
    }            */
}

 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_iot_device_sdk_v2_1 = require("aws-iot-device-sdk-v2");
const util_1 = require("util");
const yargs = require('yargs');
yargs.command('*', false, (yargs) => {
    yargs
        .option('endpoint', {
        alias: 'e',
        description: "Your AWS IoT custom endpoint, not including a port. " +
            "Ex: \"abcd123456wxyz-ats.iot.us-east-1.amazonaws.com\"",
        type: 'string',
        required: true
    })
        .option('ca_file', {
        alias: 'r',
        description: 'FILE: path to a Root CA certficate file in PEM format.',
        type: 'string',
        required: false
    })
        .option('cert', {
        alias: 'c',
        description: 'FILE: path to a PEM encoded certificate to use with mTLS',
        type: 'string',
        required: false
    })
        .option('key', {
        alias: 'k',
        description: 'FILE: Path to a PEM encoded private key that matches cert.',
        type: 'string',
        required: false
    })
        .option('client_id', {
        alias: 'C',
        description: 'Client ID for MQTT connection.',
        type: 'string',
        required: false
    })
        .option('topic', {
        alias: 't',
        description: 'STRING: Targeted topic',
        type: 'string',
        default: 'test/system_status'
    })
        .option('count', {
        alias: 'n',
        default: 10,
        description: 'Number of messages to publish/receive before exiting. ' +
            'Specify 0 to run forever.',
        type: 'number',
        required: false
    })
        .option('use_websocket', {
        alias: 'W',
        default: false,
        description: 'To use a websocket instead of raw mqtt. If you ' +
            'specify this option you must specify a region for signing, you can also enable proxy mode.',
        type: 'boolean',
        required: false
    })
        .option('signing_region', {
        alias: 's',
        default: 'us-east-1',
        description: 'If you specify --use_websocket, this ' +
            'is the region that will be used for computing the Sigv4 signature',
        type: 'string',
        required: false
    })
        .option('proxy_host', {
        alias: 'H',
        description: 'Hostname for proxy to connect to. Note: if you use this feature, ' +
            'you will likely need to set --ca_file to the ca for your proxy.',
        type: 'string',
        required: false
    })
        .option('proxy_port', {
        alias: 'P',
        default: 8080,
        description: 'Port for proxy to connect to.',
        type: 'number',
        required: false
    })
        .option('message', {
        alias: 'M',
        description: 'Message to publish.',
        type: 'string',
        default: 'Hello world!'
    })
        .option('verbosity', {
        alias: 'v',
        description: 'BOOLEAN: Verbose output',
        type: 'string',
        default: 'none',
        choices: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'none']
    })
        .help()
        .alias('help', 'h')
        .showHelpOnFail(false);
}, main).parse();

let op_idx=0;
function execute_session(connection, argv) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const decoder = new util_1.TextDecoder('utf8');
                const on_publish = (topic, payload) => __awaiter(this, void 0, void 0, function* () {
                   const json = decoder.decode(payload);
                   console.log(`Publish received on topic ${topic}`);
                   console.log(json);
                   const message = JSON.parse(json);
                 
                    if(monitorRequested){
                        foodWeightReflect = message.Food_Weight;
                        timeReflect = message.Time;
                        durationReflect = message.Duration;
                        soc.emit("pinUpdate", '{"pin":"' + pin10 + '", "foodWeightReflect":"' + foodWeightReflect + '"}');
                        soc.emit("pinUpdate", '{"pin":"' + pin11 + '", "timeReflect":"' + timeReflect + '"}');
                        soc.emit("pinUpdate", '{"pin":"' + pin12 + '", "durationReflect":"' + durationReflect + '"}');
                    }          

                   if (message.sequence == argv.count) {
                        resolve();
                    }
                });

                yield connection.subscribe(argv.topic, aws_iot_device_sdk_v2_1.mqtt.QoS.AtLeastOnce, on_publish);
            }
            catch (error) {
                reject(error);
            }
        }));
    });
}
function main(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        if (argv.verbosity != 'none') {
            const level = parseInt(aws_iot_device_sdk_v2_1.io.LogLevel[argv.verbosity.toUpperCase()]);
            aws_iot_device_sdk_v2_1.io.enable_logging(level);
        }
        const client_bootstrap = new aws_iot_device_sdk_v2_1.io.ClientBootstrap();
        let config_builder = null;
        if (argv.use_websocket) {
            let proxy_options = undefined;
            if (argv.proxy_host) {
                proxy_options = new aws_iot_device_sdk_v2_1.http.HttpProxyOptions(argv.proxy_host, argv.proxy_port);
            }
            config_builder = aws_iot_device_sdk_v2_1.iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets({
                region: argv.signing_region,
                credentials_provider: aws_iot_device_sdk_v2_1.auth.AwsCredentialsProvider.newDefault(client_bootstrap),
                proxy_options: proxy_options
            });
        }
        else {
            config_builder = aws_iot_device_sdk_v2_1.iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(argv.cert, argv.key);
        }
        if (argv.ca_file != null) {
            config_builder.with_certificate_authority_from_path(undefined, argv.ca_file);
        }
        config_builder.with_clean_session(false);
        config_builder.with_client_id(argv.client_id || "test-" + Math.floor(Math.random() * 100000000));
        config_builder.with_endpoint(argv.endpoint);
        // force node to wait 60 seconds before killing itself, promises do not keep node alive
        const timer = setTimeout(() => { }, 60 * 1000);
        const config = config_builder.build();
        const client = new aws_iot_device_sdk_v2_1.mqtt.MqttClient(client_bootstrap);
        const connection = client.new_connection(config);
        yield connection.connect();
        yield execute_session(connection, argv);
        // Allow node to die if the promise above resolved
        clearTimeout(timer);
    });
}
//# sourceMappingURL=index.js.map
