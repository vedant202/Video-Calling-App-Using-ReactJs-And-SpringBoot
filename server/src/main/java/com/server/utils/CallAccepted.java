package com.server.utils;

public class CallAccepted {
	String emailId;
	Answer answer;
	
	
	public CallAccepted() {}


	public CallAccepted(String emailId, Answer answer) {
		super();
		this.emailId = emailId;
		this.answer = answer;
	}


	public String getEmailId() {
		return emailId;
	}


	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}


	public Answer getAnswer() {
		return answer;
	}


	public void setAnswer(Answer answer) {
		this.answer = answer;
	}
	
	
	
	
}
