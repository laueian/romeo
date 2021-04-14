// Thank you for letting me take this challenge
// This was my first time using websockets and
// for some reason inqurier installed version 0.11.0
// so I spent wayy too much time debugging that issue

// I know what I need to next and how to do it, just need more time
// I will send what I have now and for what it's worth I'll finish
// the problem later tonight if only for my own benefit


const WebSocket = require("ws");
const inquirer = require("inquirer");

let exit = false;

const start = async() => {
  const sock = await initializeWS("wss://romeo-power-code-challenge.herokuapp.com");

  while (!exit) {
    const { options } = await inquirer.prompt([
      {
        type: "list",
        name: "options",
        message: "What would you like to do?",
        choices: ["Enter Serial Number", "Exit"],
      },
    ]);

    console.log(options);
    if (options == "Enter Serial Number") {
      const { input } = await inquirer.prompt([
        {
          type: "input",
          name: "input",
          message: "Serial Number:",
        },
      ]);

      // find partId from serial lookup
      const { partId } = await SerialNumberLookUp()

      // return array of steps
      const steps = stepsLookUp()

      // send steps and handle code
      sock.send({step})
      // will need function to write to json file
      // case to delete after back command
      // handle response and future requests to the tool server

    } else if (options == "Exit") {
      exit = true;
    }
  }

  process.exit(0)
}

const initializeWS = (url) => {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);

    socket.on("open", () => {
      console.log("Connection established: " + url + "\n");

      socket.on("message", (event) => {
        console.log("Message from server ", event.data);
      });

      resolve(socket);
    });

    socket.on("error", (err) => {
      console.log("Connection error: " + err);
      console.log("Please check url: " + url);
      process.exit(1)
    });
  });
}

// client starts up and asks for serial number
// validate serial number -- return error if not true
// retrive all partId using serial number
// reterive all steps for given part
// --
// start sending and working with steps to the "tool"
// every step sent gets an operation message in return
// if that operation msg is a forward save it somewhere (JSON)
// if operation is backward, delete last operation from where we saved it and re-send step to driver

(async () => await start())();
