package nwt_seminar
import grails.rest.Resource

@Resource(uri = '/users')

class Users {
    String username
    String password
}
