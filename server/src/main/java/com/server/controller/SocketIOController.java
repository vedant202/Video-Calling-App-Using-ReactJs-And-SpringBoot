package com.server.controller;

import java.util.HashMap;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import com.server.message.Message;
import com.server.utils.CallAccepted;
import com.server.utils.CallUserIncommingMesssage;
import com.server.utils.ChatMessage;




@Component
public class SocketIOController {
	 @Autowired
	 private SocketIOServer socketServer;
	 
	 HashMap<String, String> emailToSocketMapping = new HashMap<String, String>();
	 HashMap<String, String> socketToEmailMapping = new HashMap<String, String>();
	 
	 public SocketIOController(SocketIOServer socketServer) {
		// TODO Auto-generated constructor stub
		 this.socketServer = socketServer;
		 this.socketServer.addConnectListener(onUserConnectWithSocket);
		 this.socketServer.addDisconnectListener(onUserDisonnnect);
		 //Listner for joining room
		 this.socketServer.addEventListener("join-room", Message.class, onSendMessage);
		 this.socketServer.addEventListener("call-user",CallUserIncommingMesssage.class,callUser);
		 this.socketServer.addEventListener("call-accepted", CallAccepted.class, callAccepted);
		 
		 this.socketServer.addEventListener("send:incom:message", ChatMessage.class, incommingChatMessage);
	}
	 


	public ConnectListener onUserConnectWithSocket = new ConnectListener() {
		
		@Override
		public void onConnect(SocketIOClient client) {
			// TODO Auto-generated method stub
	
			System.out.println("User connected");
			
		}
	};
	
	public DisconnectListener onUserDisonnnect = new DisconnectListener() {
		
		@Override
		public void onDisconnect(SocketIOClient client) {
			// TODO Auto-generated method stub
			
			System.out.println("User disconnected");
			
		}
	};
	
	private DataListener<ChatMessage> incommingChatMessage = new DataListener<ChatMessage>() {
		
		@Override
		public void onData(SocketIOClient client, ChatMessage data, AckRequest ackSender) throws Exception {
			// TODO Auto-generated method stub
			System.out.println(" Incomming Chat Message from "+data.getToEmail()+" "+data.getMessage());
			String socketId = emailToSocketMapping.get(data.getToEmail());
			System.out.println("Incomming Chat Message SocketId :- "+socketId);
			socketServer.getClient(UUID.fromString(socketId)).sendEvent("send:out:message", data);
			
		}
	};
	
	private DataListener<CallAccepted> callAccepted= new DataListener<CallAccepted>() {
		
		@Override
		public void onData(SocketIOClient client, CallAccepted data, AckRequest ackSender) throws Exception {
			// TODO Auto-generated method stub
			String socketId = emailToSocketMapping.get(data.getEmailId());
			HashMap hm = new HashMap();
			hm.put("answer", data.getAnswer());
			socketServer.getClient(UUID.fromString(socketId)).sendEvent("call-accepted",hm );
		}
	};
	
	private DataListener<CallUserIncommingMesssage> callUser = new DataListener<CallUserIncommingMesssage>() {
		
		@Override
		public void onData(SocketIOClient client, CallUserIncommingMesssage data, AckRequest ackSender) throws Exception {
			// TODO Auto-generated method stub
			System.out.println("Calling User ");
			String socket = emailToSocketMapping.get(data.getEmail());
			String fromEmail = socketToEmailMapping.get(client.getSessionId().toString());
			HashMap hm = new HashMap();
			hm.put("offer", data.getOffer());
			hm.put("fromEmail", fromEmail);
			socketServer.getClient(UUID.fromString(socket)).sendEvent("incomming-call", hm);
		}
	};
	
	
	private DataListener<Message> onSendMessage = new DataListener<Message>() {
		
		@Override
		public void onData(SocketIOClient client, Message data, AckRequest ackSender) throws Exception {
			// TODO Auto-generated method stub
			System.out.println("Session id:-"+client.getSessionId());
			System.out.println("data "+data.getEmail()+" "+data.getRoomId());
			emailToSocketMapping.put(data.getEmail(),client.getSessionId().toString());
			socketToEmailMapping.put(client.getSessionId().toString(), data.getEmail());
			client.joinRoom(data.getRoomId());
			client.sendEvent("joined-room", data.getRoomId());
			socketServer.getBroadcastOperations().sendEvent("user-joined", data.getEmail());
			
		}
	};
}
