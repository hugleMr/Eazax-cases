// It is used to keep the engine running continuously when web pages are in the background Worker Script

// Call interval
const interval = 1000 / 60;

// recursive function
function call() {
    postMessage(1);
    // There is a problem with calling the function directly
    setTimeout("call()", interval);
}
call();
