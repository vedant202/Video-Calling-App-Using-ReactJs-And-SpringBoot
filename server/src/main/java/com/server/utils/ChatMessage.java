package com.server.utils;

public class ChatMessage {
	String toEmail;
	String message;
	
	public ChatMessage() {}
	
	public ChatMessage(String toEmail, String message) {
		super();
		this.toEmail = toEmail;
		this.message = message;
	}
	public String getToEmail() {
		return toEmail;
	}
	public void setToEmail(String toEmail) {
		this.toEmail = toEmail;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
	
}
