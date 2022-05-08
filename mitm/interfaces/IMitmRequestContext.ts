import * as http from 'http';
import * as http2 from 'http2';
import IHttpResourceLoadDetails from '@unblocked-web/emulator-spec/net/IHttpResourceLoadDetails';
import MitmSocket from '@unblocked-web/sa-mitm-socket';
import RequestSession from '../handlers/RequestSession';
import CacheHandler from '../handlers/CacheHandler';
import ResourceState from './ResourceState';

export default interface IMitmRequestContext extends IHttpResourceLoadDetails {
  clientToProxyRequest: http.IncomingMessage | http2.Http2ServerRequest;
  cacheHandler: CacheHandler;
  didInterceptResource: boolean;
  proxyToClientResponse?: http.ServerResponse | http2.Http2ServerResponse;
  proxyToServerRequest?: http.ClientRequest | http2.ClientHttp2Stream;
  serverToProxyResponse?: http.IncomingMessage | http2.ClientHttp2Stream;
  requestSession?: RequestSession;
  proxyToServerMitmSocket?: MitmSocket;
  stateChanges: Map<ResourceState, Date>;
  setState(state: ResourceState);
}
