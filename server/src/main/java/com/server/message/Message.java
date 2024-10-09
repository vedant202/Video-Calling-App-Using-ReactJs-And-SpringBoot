package com.server.message;

public class Message {
	String roomId;
	String email;
	public Message() {}
	public Message(String roomId, String email) {
		super();
		this.roomId = roomId;
		this.email = email;
	}
	public String getRoomId() {
		return roomId;
	}
	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
	
}
