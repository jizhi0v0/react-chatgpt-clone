// Just a simple example of reading a file and sending it to the client using Streams

const eventSource = require('EventSource')

var source = new eventSource('http://127.0.0.1:8844/stream?question=howtocookeggs');

source.addEventListener('message', function (e) {
  console.log(e.data);
});

source.addEventListener('open', function (e) {
  console.log('open');
});


source.addEventListener('error', function (e) {
  if (e.readyState == EventSource.CLOSED) {
    console.log('close');
  }
});

// 10s后关闭事件源，观察控制台输出
setTimeout(() => {
  source.close();
}, 2000);
// 关闭事件源
// source.close();
