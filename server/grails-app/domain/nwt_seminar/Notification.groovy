package nwt_seminar
import grails.rest.Resource

@Resource(uri = '/notification')

class Notification {
    String text
    String receiver
	
	Date dateCreated
	
	boolean isRead
}
