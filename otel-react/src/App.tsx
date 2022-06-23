import React from 'react';
import logo from './logo.svg';
import './App.css';
import {tracer} from "./tracing";
import {Span} from "@opentelemetry/api";

let span: Span | undefined;

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <button onClick={() => this.makeRequest()} className="trace-button">Make Traced Request</button>
          <button onClick={startCustomSpan} className="trace-button margin-top-2">Start Custom Span</button>
          <button onClick={addEventToSpan} className="trace-button">Add Event</button>
          <button onClick={endCustomSpan} className="trace-button">End Custom Span</button>
        </header>
      </div>
    );
  }

  makeRequest() {
    fetch('/api/example')
      .then(res => res.json())
      .then(body => {
        console.log(body);
      })
      .catch(err => {
        console.error(err);
      });
  }

}

function startCustomSpan() {
  span = tracer.startSpan('customSpan');
}

function addEventToSpan() {
  if (span) {
    span.addEvent('customEvent', new Date());
  }
}

function endCustomSpan() {
  if (span) {
    span.end();
    span = undefined;
  }
}


export default App;
