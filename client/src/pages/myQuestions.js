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

const UnansweredQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [hideSpinner, setHideSpinner] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const questionsPerPage = 3;

    useEffect(() => {
        const abortController = new AbortController();
        setTimeout(() => fetch(SERVER_URL + '/question', {signal: abortController.signal})
            .then(res => res.json())
            .then (res =>  setQuestions (res.filter(it => it.askedBy === localStorage.getItem("isLoggedIn")).sort((edge1, edge2) => {
                return edge1.dateCreated < edge2.dateCreated ? 1 : -1
            })))
            .then(() => setHideSpinner(false))
            .catch(() => null), 3000);
        return function cleanup () {
            abortController.abort();
        }}, []);

    const updateQuestionArray = () => {
        fetch(SERVER_URL + '/question')
            .then(res => res.json())
            .then (res =>  setQuestions (res.filter(it => it.askedBy === localStorage.getItem("isLoggedIn")).sort((edge1, edge2) => {
                return edge1.dateCreated < edge2.dateCreated ? 1 : -1
            })))
            .then(() => setHideSpinner(false))
            .catch(() => null)
    };

    const deleteQuestion = (item) => {
        fetch(SERVER_URL + "qanda/" + item.id, {
            method: "DELETE"
        })
            .then(() => toast.success(
                <div>
                    <h1>
                        Izbrisana poruka
                    </h1>
                    <ul>
                        Pitanje: {item.question}
                    </ul>
                    <ul>
                        Odgovor:  {item.answer}
                    </ul>
                </div>
            ))
            .then(() => updateQuestionArray())
            .then(() =>
                fetch(SERVER_URL + "notification", {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        text: item.askedBy + " je izbrisao Vaše pitanje",
                        isRead: false,
                        dateCreated: new Date(),
                        receiver: "admin"
                    })}))
            .catch(() => null);
    };

    const getPageNumber = () => {
        if(questions.length % questionsPerPage === 0)
            return parseInt( questions.length / questionsPerPage);
        else
            return parseInt( questions.length / questionsPerPage +1);
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
        return questions.slice(questionsPerPage * (pageNumber-1),  questionsPerPage * pageNumber).map(item =>
            <Row key={item.id} style={{marginTop: "25px"}}>
                <Card body>
                    <CardTitle><b style={{color: "blue"}}>{item.askedBy}: </b><b>{item.question}</b></CardTitle>
                    <CardSubtitle>{new Date(item.dateCreated).toLocaleDateString()}</CardSubtitle>
                    <CardText id={"answer" + item.id}>{item.answer}</CardText>
                    <br/>
                    {
                        item.isVisible?
                            <div style={{color:"blue"}}>Vidljivo</div>:
                            <div style={{color: "red"}}>Nevidljivo</div>
                    }
                    <br/>

                    <Button onClick={() => {
                        confirmAlert({
                            title: 'Jeste li sigurni da želite izbrisati ovo pitanje?',
                            message: "Pitanje: "+ item.question +
                                ` \n Odgovor: ` + item.answer,
                            buttons: [
                                {
                                    label: 'Da',
                                    onClick: () => deleteQuestion(item)
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

    if(localStorage.getItem("isLoggedIn") === "admin" || localStorage.getItem("isLoggedIn") === "false")
    {
        return(
            <Redirect to="/"/>
        )
    }
    else if(questions.length === 0)
    {
        return (
            <div>
                <AppNav/>
                <Header pageData={"Moja"}/>
                <br/>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <PushSpinner size={50} color="#686769" loading={hideSpinner}/>
                </div>
                <Row style={hideSpinner?{display: "none"}: {}}>
                    <Card body>
                        Nema neodgovorenih pitanja
                    </Card>
                </Row>
            </div>
        )
    }
    return (
        <div>
            <AppNav/>
            <Header pageData={"Moja"}/>
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

export default UnansweredQuestions;