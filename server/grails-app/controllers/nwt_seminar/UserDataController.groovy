package nwt_seminar


import grails.rest.*
import grails.converters.*

class UserDataController {
	static responseFormats = ['json', 'xml']
    def dataSource
	
    def index() {
        render (Users.getAll() as JSON)
    }
}
