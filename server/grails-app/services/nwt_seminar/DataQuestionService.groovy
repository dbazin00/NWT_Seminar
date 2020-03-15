package nwt_seminar

import grails.gorm.transactions.Transactional

@Transactional
class DataQuestionService {
    def newQuestion(){
        new QandA(question: "p", answer: "o", isAnswered: true, isVisible: false, dateCreated: new Date()).save()
    }
}
