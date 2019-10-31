"use strict";
const axios = require('axios');
const fs = require('fs');
const yargs = require("yargs");

const options = yargs
 .usage("Usage: -f <teams.csv>")
 .option("p", { alias: "path", describe: "Cloudformation file path", type: "string", demandOption: true })
 .option("r", { alias: "region", describe: "Cloud Conformity region. Defaults to us-west-2", type: "string", default: "us-west-2", demandOption: false })
 .option("k", { alias: "key", describe: "Cloud Conformity api key.", type: "string", demandOption: true })
 .help('help')
 .argv;

// global variables
const path = options.path;
const KEY = options.key;
const REGION = options.region;
const BASE_URL = "https://" + REGION + "-api.cloudconformity.com/v1";

const generateRequest = (path) => {
  return {
    baseURL: BASE_URL,
    url: '/iac-scanning/scan',
    method: 'post',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Authorization': 'ApiKey ' + KEY
    },
    responseType: 'json',
    data: {
      'data': {
        'attributes': {
          'type': 'cloudformation-template',
          'contents': fs.readFileSync(path, 'UTF8')
        }
      }
    }
  };
};

const scan = async (path) => {
  try{
    const res = await axios(generateRequest(path));
    return res.data;
  }
  catch(err){
    return err.response.data;
  }
};

scan(path)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });