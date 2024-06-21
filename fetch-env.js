const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Set AWS SDK credentials
AWS.config.update({
  region: 'ap-southeast-2',
  credentials: new AWS.EnvironmentCredentials('AWS'),
});

// Create SSM service object
const ssm = new AWS.SSM();

// Define the parameters you want to fetch
const parameterNames = [
  'REACT_APP_BUNGIE_API_KEY',
  // add other parameters here
];

// Fetch the parameters
const getParameters = async () => {
  try {
    const data = await ssm
      .getParameters({
        Names: parameterNames,
        WithDecryption: true,
      })
      .promise();

    const envVars = data.Parameters.reduce((acc, param) => {
      const key = path.basename(param.Name);
      acc[key] = param.Value;
      return acc;
    }, {});

    // Write the environment variables to a .env file
    const envFileContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync('.env', envFileContent);
    console.log('.env file created successfully');
  } catch (err) {
    console.error('Error fetching parameters:', err);
  }
};

getParameters();
