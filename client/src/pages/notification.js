import React, {useState, useEffect} from 'react';
import {Redirect} from "react-router-dom";
import {
    Row,
    Card,
    CardTitle,
    CardSubtitle,
    CardText,
    Button,
    PaginationItem,
    PaginationLink,
    Pagination
} from 'reactstrap';
import { PushSpinner } from "react-spinners-kit";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { SERVER_URL} from '../config';
import Header from "../components/header";
import AppNav from "../components/AppNav";
import 'whatwg-fetch';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [hideSpinner, setHideSpinner] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const notificationsPerPage = 3;

    useEffect(() => {
        const abortController = new AbortController();
        fetch(SERVER_URL + '/notificationData', {signal: abortController.signal})
            .then(res => res.json())
            .then (res =>  setNotifications (res.filter(it => it.receiver === localStorage.getItem("isLoggedIn")).sort((edge1, edge2) => {
                return edge1.dateCreated < edge2.dateCreated ? 1 : -1
            })))
            .then(() => setHideSpinner(false))
            .catch(() => null);
        return function cleanup () {
            abortController.abort();
        }}, []);

    const updateNotificationArray = () => {
        fetch(SERVER_URL + '/notificationData')
            .then(res => res.json())
            .then (res =>  setNotifications (res.filter(it => it.receiver === localStorage.getItem("isLoggedIn")).sort((edge1, edge2) => {
                return edge1.dateCreated < edge2.dateCreated ? 1 : -1
            })))
            .then(() => setHideSpinner(false))
            .catch(() => null)
    };

    const deleteNotification = (item) => {
        fetch(SERVER_URL + "notification/" + item.id, {
            method: "DELETE"
        })
            .then(() => toast.success(
                <div>
                    <h1>
                        Izbrisana obavijest
                    </h1>
                    <ul>
                        {item.text}
                    </ul>
                </div>
            ))
            .then(() => updateNotificationArray())
            .catch(() => null);
    };

    const deleteAllNotifications = () => {

        notifications.map(item => fetch(SERVER_URL + "notification/" + item.id, {
            method: "DELETE"
        })
                .then(() => updateNotificationArray())
                .catch(() => null)
            );
    };


    const getPageNumber = () => {
        if(notifications.length % notificationsPerPage === 0)
            return parseInt( notifications.length / notificationsPerPage);
        else
            return parseInt( notifications.length / notificationsPerPage + 1);
    };

    const PaginationFunction = () =>
    {
        const numArray = [];

        for(var i = 0; i < getPageNumber(); i++)
            numArray.push(i+1);

        return numArray.map(item=>
            <PaginationItem key={item}>
                <PaginationLink onClick={() => setPageNumber(item)}>
                    {item}
                </PaginationLink>
            </PaginationItem>
        )
    };

    const ShowPagination = () =>
        <Row style={{justifyContent: "center"}}>
            <Pagination size="sm">
                <PaginationItem>
                    <PaginationLink first onClick={() => setPageNumber(1)}/>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink previous onClick={() => setPageNumber(pageNumber === 1?1:pageNumber-1)}/>
                </PaginationItem>
                <PaginationFunction/>
                <PaginationItem>
                    <PaginationLink next onClick={() => setPageNumber(pageNumber === getPageNumber()?getPageNumber:pageNumber+1)}/>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink last onClick={() => setPageNumber(getPageNumber())}/>
                </PaginationItem>
            </Pagination>
        </Row>;

    const GetFinalQuestionArray = () =>{
        return notifications.slice(notificationsPerPage * (pageNumber-1),  notificationsPerPage * pageNumber).map(item =>
            <Row key={item.id} style={{marginTop: "25px"}}>
                <Card body>
                    <CardTitle><b>{item.text}</b></CardTitle>
                    <CardSubtitle>{new Date(item.dateCreated).toLocaleDateString()}</CardSubtitle>
                    <CardText id={"answer" + item.id}>{item.answer}</CardText>
                    <br/>

                    <Button onClick={() => {
                        confirmAlert({
                            title: 'Jeste li sigurni da želite izbrisati ovu obavijest?',
                            message: item.text,
                            buttons: [
                                {
                                    label: 'Da',
                                    onClick: () => deleteNotification(item)
                                },
                                {
                                    label: 'Ne',
                                }
                            ],
                            closeOnEscape: true,
                            closeOnClickOutside: true,
                        });
                    }}>
                        Brisanje
                    </Button>
                </Card>
            </Row>
        )};

    if(localStorage.getItem("isLoggedIn") === "false")
    {
        return(
            <Redirect to="/"/>
        )
    }
    else if(notifications.length === 0)
    {
        return (
            <div>
                <AppNav/>
                <Header pageData={"Obavijesti"}/>
                <br/>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <PushSpinner size={50} color="#686769" loading={hideSpinner}/>
                </div>
                <Row style={hideSpinner?{display: "none"}: {}}>
                    <Card body>
                        Nema obavijesti
                    </Card>
                </Row>
            </div>
        )
    }
    return (
        <div>
            <AppNav/>
            <Header pageData={"Obavijesti"}/>
            <br/>
            <Row>
                <Card body>
                    <Button onClick={() => {
                        confirmAlert({
                            title: 'Brisanje svih obavijesti',
                            message: 'Jeste li sigurni da želite izbrisati sve obavijesti?',
                            buttons: [
                                {
                                    label: 'Da',
                                    onClick: () => deleteAllNotifications()
                                },
                                {
                                    label: 'Ne',
                                }
                            ],
                            closeOnEscape: true,
                            closeOnClickOutside: true,
                        });
                    }}>
                        Brisanje svih obavijesti
                    </Button>
                </Card>
            </Row>
            <br/>
            {
                getPageNumber() > 1?
                    <ShowPagination/>:
                    null
            }

            <GetFinalQuestionArray/>
            <br/>
            {
                getPageNumber() > 1?
                    <ShowPagination/>:
                    null
            }
            <br/>
            <ToastContainer/>
        </div>
    );
};

export default Notification;