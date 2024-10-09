package com.server.utils;

public class Offer {
	String sdp;
	String type;
	
	
	public Offer() {}
	public Offer(String sdp, String type) {
		super();
		this.sdp = sdp;
		this.type = type;
	}
	public String getSdp() {
		return sdp;
	}
	public void setSdp(String sdp) {
		this.sdp = sdp;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
	
	
}
