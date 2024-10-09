package com.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DisconnectListener;

import jakarta.annotation.PreDestroy;

@Component
@CrossOrigin
public class SocketConfig {
//	private String SOCKETHOST="192.168.56.1";
	private String SOCKETHOST="192.168.1.41";
	private int SOCKETPORT=8081;
	private SocketIOServer server;
	
	@Bean
	public SocketIOServer socketIOServer() {
		Configuration config = new Configuration();
		config.setHostname(SOCKETHOST);
		config.setPort(SOCKETPORT);
		
		server = new SocketIOServer(config);
		server.start();
//		
//		server.addConnectListener(new ConnectListener() {
//			
//			@Override
//			public void onConnect(SocketIOClient client) {
//				// TODO Auto-generated method stub
//				System.out.println(client.getSessionId());
//			}
//		});
//		
//		server.addDisconnectListener(new DisconnectListener() {
//			
//			@Override
//			public void onDisconnect(SocketIOClient client) {
//				// TODO Auto-generated method stub
//				client.getNamespace().getAllClients().stream().forEach((i)->{
//					System.out.println(i);
//				});
//				
//			}
//		});
		
		return server;
	}
	
	@PreDestroy
	public void stopSocketIoServer() {
		this.server.stop();
	}
}
