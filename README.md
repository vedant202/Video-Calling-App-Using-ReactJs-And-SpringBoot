# Video Calling App Using ReactJs And SpringBoot  And WebRTC
# Simple Zoom clone Implementation
## WEbRTC
- With WebRTC, you can add real-time communication capabilities to your application that works on top of an open standard. It supports video, voice, and generic data to be sent between peers, allowing developers to build powerful voice- and video-communication solutions.

- The technology is available on all modern browsers as well as on native clients for all major platforms. The technologies behind WebRTC are implemented as an open web standard and available as regular JavaScript APIs in all major browsers.

- The set of standards that comprise WebRTC makes it possible to share data and perform teleconferencing peer-to-peer, without requiring that the user install plug-ins or any other third-party software.

- WebRTC serves multiple purposes; together with the Media Capture and Streams API, they provide powerful multimedia capabilities to the Web, including support for audio and video conferencing, file exchange, screen sharing, identity management, and interfacing with legacy telephone systems including support for sending DTMF (touch-tone dialing) signals. Connections between peers can be made without requiring any special drivers or plug-ins, and can often be made without any intermediary servers.

- Connections between two peers are represented by the RTCPeerConnection interface. Once a connection has been established and opened using RTCPeerConnection, media streams (MediaStreams) and/or data channels (RTCDataChannels) can be added to the connection.

# Backend


## SOCKET.IO

- Socket.IO enables real-time bidirectional event-based communication.

`<dependency><groupId>com.corundumstudio.socketio</groupId><artifactId>netty-socketio</artifactId><version>1.7.16</version></dependency>
`

- Netty socketio is the socket.io implementation for java backend

    	@Component
    	public class SocketIOConfig {
    		@Value("${socket.host}")
    		private String SOCKETHOST;
    		@Value("${socket.port}")
    		private int SOCKETPORT;
    		private SocketIOServer server;
    
    	@Bean
    	public SocketIOServer socketIOServer() {
    		Configuration config = new Configuration();
    		config.setHostname(SOCKETHOST);
    		config.setPort(SOCKETPORT);
    		server = new SocketIOServer(config);
    		server.start();
    
    		return server;
    		
    	}
    
    
    }
    
