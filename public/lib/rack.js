var rack = {
  transport: undefined,
  synths: [],
  drumMachines: [],

  init: function (transport, synths, drumMachines) {
    this.transport = transport;
    this.synths = synths;
    this.drumMachines = drumMachines;
  }
};