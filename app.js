// Require the child_process module to be able to run shell commands through node js
const { exec } = require('child_process');
const os = require('os');
const chalk = require('chalk');

// Function to get the CPU temperature
const getCpuTemp = () => {

  return new Promise(resolve => {

    // Executes a command to check the 'CPU temperature'
    exec('vcgencmd measure_temp', (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      // Remove the 'temp=' from the result and replace ' with °
      let cpuTemp = stdout.split('=')[1].replace('\'', '°');
      // Resolve the promise with the modified result of the command
      resolve(cpuTemp);
    });

  });

}

// Function to get the date
const getPiDate = () => {

  return new Promise(resolve => {

    // Gets the date
    exec('date', (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      // Resolve the promise with the result of the command
      resolve(stdout);
    });

  });

}

// Function to get the disk usage
const getDiskUsage = () => {

  return new Promise(resolve => {

    // Executes a command to check the 'Disk space usage'
    exec('df -h', (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      // Resolve the promise with the result of the command
      resolve(stdout);
    });

  });

}

// Displays the stats
const displayResults = async () => {

  // Date
  const piDate = await getPiDate();
  console.log(chalk.white.bold.underline(piDate));

  // Uptime
  const piUptime = Math.round(os.uptime() / 60);
  const piUptimeInHours = (Math.round((piUptime / 60) * 100) / 100).toFixed(1);
  const piUptimeInDays = (Math.round((piUptimeInHours / 24) * 100) / 100).toFixed(1);
  console.log(chalk.cyan.bold('Uptime:'), `${piUptime}min (${piUptimeInHours}h) (${piUptimeInDays}d)`);
  
  // CPU temperature
  const cpuTemp = await getCpuTemp();
  console.log(chalk.yellow.bold('CPU Temp:'), cpuTemp);

  // Memory data
  const totalMemory = Math.round(os.totalmem() / 1000000);
  const freeMemory = Math.round(os.freemem() / 1000000);
  const memoryUsage = totalMemory - freeMemory;
  console.log(chalk.green.bold('Total memory:'), `${totalMemory}M`);
  console.log(chalk.green.bold('Free memory:'), `${freeMemory}M`);
  console.log(chalk.green.bold('RAM usage:'), `${memoryUsage}/${totalMemory}M`, '\n'); // \n to jump a line

  // Disk usage
  const diskUsage = await getDiskUsage();
  console.log(chalk.magenta.bold('--------------------- Disk usage ---------------------'));
  console.log(diskUsage);

}

displayResults();