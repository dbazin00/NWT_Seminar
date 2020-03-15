package nwt_seminar

import grails.rest.Resource

@Resource(uri = '/qanda')

class QandA {
    String question
    String answer

    boolean isAnswered
    boolean isVisible

    Date dateCreated

    String askedBy
}
