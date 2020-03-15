package nwt_seminar


import grails.rest.*
import grails.converters.*

class QuestionController {
	static responseFormats = ['json', 'xml']
    def dataSource

    def index() {
        render (QandA.getAll() as JSON)
    }
}
