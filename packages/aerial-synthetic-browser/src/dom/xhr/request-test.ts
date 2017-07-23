import { expect } from "chai";
import { SequenceBus, CallbackBus, DuplexStream } from "mesh7";
import { 
  IHTTPHeaders,
  HTTPResponse,
  HTTPRequest, 
  SyntheticXMLHttpRequest, 
  XMLHttpRequestReadyState,
} from "./index";

describe(__filename + "#", () => {

  const createStubbedSyntheticXMLHttpRequest = (requests: HTTPRequest[], response?: HTTPResponse, ...chunks: string[]) => {
    return new SyntheticXMLHttpRequest(new CallbackBus((request: HTTPRequest) => {
      requests.push(request);
      return new DuplexStream((input, output) => {
        const writer = output.getWriter();
        if (response) writer.write(response);
        chunks.forEach((chunk) => {
          writer.write(chunk)
        });
        writer.close();
      });
    }));
  }

  it("can be created", () => {
    new SyntheticXMLHttpRequest(new SequenceBus([]));
  });

  it("can send a basic HTTP request", async () => {
    const requests: HTTPRequest[] = [];
    const xhr = createStubbedSyntheticXMLHttpRequest(requests);
    xhr.open("GET", "hello.txt");
    await xhr.send();

    const [ request ] = requests;
    expect(request.method).to.equal("GET");
    expect(request.url).to.equal("hello.txt");
  });

  it("ready state is UNSET when initialized", async () => {
    const requests: HTTPRequest[] = [];
    const xhr = createStubbedSyntheticXMLHttpRequest(requests);
    expect(xhr.readyState).to.equal(XMLHttpRequestReadyState.UNSET);
  });


  it("ready state is OPEN when opened", async () => {
    const requests: HTTPRequest[] = [];
    const xhr = createStubbedSyntheticXMLHttpRequest(requests);
    xhr.open("GET", "something");
    expect(xhr.readyState).to.equal(XMLHttpRequestReadyState.OPENED);
  });

  it("goes through all HTTP ready states in the right order", async () => {
    const requests: HTTPRequest[] = [];
    const xhr = createStubbedSyntheticXMLHttpRequest(requests);
    const readyStates = [];
    xhr.onreadystatechange = () => readyStates.push(xhr.readyState); 
    xhr.open("GET", "hello.txt");
    await xhr.send();

    // skip headers received for now since the stub handler returns no message
    expect(readyStates).to.eql([XMLHttpRequestReadyState.OPENED, XMLHttpRequestReadyState.LOADING, XMLHttpRequestReadyState.DONE]);
  });

  it("sets ready state to HEADERS_RECEIVED when headers are returned", async () => {
    let xhr = createStubbedSyntheticXMLHttpRequest([], new HTTPResponse(400));
    xhr.open("GET", "hello.txt");
    const readyStates = [];
    xhr.onreadystatechange = () => readyStates.push(xhr.readyState); 
    await xhr.send();
    expect(readyStates).to.contain(XMLHttpRequestReadyState.HEADERS_RECEIVED);
  });

  it("sets the status property based on the response", async () => {
    let xhr = createStubbedSyntheticXMLHttpRequest([], new HTTPResponse(200));
    xhr.open("GET", "hello.txt");
    await xhr.send();
    expect(xhr.status).to.equal(200);

    xhr = createStubbedSyntheticXMLHttpRequest([], new HTTPResponse(400));
    xhr.open("GET", "hello.txt");
    await xhr.send();
    expect(xhr.status).to.equal(400);
  });



  it("sets the responseText after loading", async () => {
    let xhr = createStubbedSyntheticXMLHttpRequest([], new HTTPResponse(200, { contentType: "text/plain" }), "a", "b", "c");
    xhr.open("GET", "hello.txt");
    await xhr.send();
    expect(xhr.status).to.equal(200);
    expect(xhr.responseText).to.equal("abc");
    expect(xhr.responseType).to.equal("text/plain");
  });
});

