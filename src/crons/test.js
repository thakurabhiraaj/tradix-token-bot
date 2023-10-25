class FunctionQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  enqueue(fn) {
    this.queue.push(fn);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  processQueue() {
    if (this.queue.length > 0) {
      const fn = this.queue.shift();
      this.isProcessing = true;
      fn();
      setTimeout(() => {
        this.processQueue();
      }, 5000);
    } else {
      this.isProcessing = false;
    }
  }
}

// Example functions to be queued
function function1() {
  console.log("Function 1 executed");
}

function function2() {
  console.log("Function 2 executed");
}

function function3() {
  console.log("Function 3 executed");
}

// Create a new instance of the FunctionQueue
const functionQueue = new FunctionQueue();

// Enqueue the functions with a 5-second interval
functionQueue.enqueue(function1);
functionQueue.enqueue(function2);
functionQueue.enqueue(function3);
