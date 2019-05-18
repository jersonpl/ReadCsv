var lora = require('lora-packet');
//const dbConnections = require('./config/db.Connections');
const fs = require('fs');
const { promisify } = require('util')

const readFileAsync = promisify(fs.readFile)

const run = async () => {
    //var con = dbConnections();
    const fileString = await readFileAsync('/home/jerson_pl/Documents/DesignPage/Back_End/pktlog_AA555A0000000101_20190516_20_53_49.csv', 'utf8')
    var data = csvJSON(fileString);
    for (var i = 0; i < data.length; i++) {
        try {
            if (data[i].status === 'CRC_OK') {
                var {gateway_ID,node_MAC,UTC_timestamp,us_count,frecuency,RF_chain,RX_chain,status,size,modulation,bandwidth,datarate,RSSI,SNR,payload} = data[i];
                var packet = lora.fromWire(Buffer.from(payload.replace(/-/g, ''), 'hex'));
                var key = Buffer.from("2B7E151628AED2A6ABF7158809CF4F3C", 'hex');
                var payloadString = lora.decrypt(packet, key, key).toString();
                //con.query("INSERT INTO `dsyrus` (`gateway_ID`,`node_MAC`, `UTC_timestamp`, `us_count`,`frecuency`,`RF_chain`,`RX_chain`,`status`,`size`,`modulation`,`bandwidth`,`datarate`,`RSSI`,`SNR`,`payload`) VALUES ?;", [[[gateway_ID,node_MAC,UTC_timestamp,us_count,frecuency,RF_chain,RX_chain,status,size,modulation,bandwidth,datarate,RSSI,SNR,payloadString]]], function (err, result) {
                //    if (err) throw err;
                    console.log("OK UTC_timeStamp: ",UTC_timestamp.slice(0,19), " payload: ", payloadString);
                //});
                //console.log("fila: ", i, "tamaño: ", data[i].size, "   ", payloadString.toString())
            }
        } catch (e) {
            console.log(e)
        }
        //con.end();
    }
}
function csvJSON(csv) {

    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].replace(/ /g, '_').replace(/"/g, '').split(",");

    for (var i = 1; i < lines.length; i++) {

        var obj = {};
        var currentline = lines[i].replace(/"/g, '').replace(/ ,/g, ',').split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }

    //return result; //JavaScript object
    return JSON.parse(JSON.stringify(result)); //JSON
}

run()
