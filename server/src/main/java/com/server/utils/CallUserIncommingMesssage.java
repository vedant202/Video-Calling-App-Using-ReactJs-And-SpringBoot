package com.server.utils;

public class CallUserIncommingMesssage {
	String email;
	Offer offer;
	
	
	public CallUserIncommingMesssage() {}
	
	public CallUserIncommingMesssage(String email, Offer offer) {
		super();
		this.email = email;
		this.offer = offer;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public Offer getOffer() {
		return offer;
	}
	public void setOffer(Offer offer) {
		this.offer = offer;
	}
	
	
}
