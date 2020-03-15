package nwt_seminar


import grails.rest.*
import grails.converters.*

class NotificationDataController {
	static responseFormats = ['json', 'xml']
    def dataSource

    def index() {
        render (Notification.getAll() as JSON)
    }
}
