import React, {useState, useEffect} from 'react';
import {
    Row,
    Card,
    CardTitle,
    CardSubtitle,
    CardText,
    FormGroup,
    Input,
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
import Header from "./header";
import 'whatwg-fetch';

const LoggedInHome = () => {
    const [questions, setQuestions] = useState([]);
    const [hideSpinner, setHideSpinner] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const questionsPerPage = 3;

    useEffect(() => {
        const abortController = new AbortController();
        setTimeout(() => fetch(SERVER_URL + '/question', {signal: abortController.signal})
            .then(res => res.json())
            .then (res =>  setQuestions (res.filter(it => it.isVisible === true && it.isAnswered === true).sort((edge1, edge2) => {
                return edge1.dateCreated < edge2.dateCreated ? 1 : -1
            })))
            .then(() => setHideSpinner(false))
            .catch(() => null), 3000);
        return function cleanup () {
            abortController.abort();
        }}, []);

    const askNewQuestion = () => {
        if(document.getElementById("exampleText").value === "")
        {
            toast.error("Niste postavili pitanje !")
        }
        else
        {
            fetch(SERVER_URL + "qanda", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    question: document.getElementById("exampleText").value,
                    answer: "Još nije odgovoreno",
                    isAnswered: false,
                    isVisible: false,
                    dateCreated: new Date(),
                    askedBy: localStorage.getItem("isLoggedIn")
                })
            })
                .then(() => document.getElementById("exampleText").value = "")
                .then(() => toast.success("Uspješno postavljeno pitanje"))
                .then(() => createNotification())
                .catch(()=> console.log("Nesto ne valja"))
        }
    };

    const createNotification = () =>
        fetch(SERVER_URL + "notification", {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                text: localStorage.getItem("isLoggedIn") + " je postavio pitanje",
                isRead: false,
                dateCreated: new Date(),
                receiver: "admin"
            })
        });

    const AskQuestion = () =>
        <Row>
            <Card body>
                <FormGroup>
                    <Input type="textarea" id="exampleText" placeholder="Postavite neko pitanje..." maxLength="255"/>

                </FormGroup>
                <Button onClick={() =>
                    confirmAlert({
                        title: 'Jeste li sigurni da želite postaviti ovo pitanje?',
                        message: document.getElementById("exampleText").value,
                        buttons: [
                        {
                            label: 'Da',
                            onClick: askNewQuestion()
                        },
                        {
                            label: 'Ne',
                        }
                    ],
                    closeOnEscape: true,
                    closeOnClickOutside: true,
                })}>
                    Postavite pitanje
                </Button>
            </Card>
        </Row>;


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
                    <CardTitle><b style={item.askedBy === localStorage.getItem("isLoggedIn")?{color: "red"}:{color:"blue"}}>{item.askedBy}: </b><b>{item.question}</b></CardTitle>
                    <CardSubtitle>{new Date(item.dateCreated).toLocaleDateString()}</CardSubtitle>
                    <CardText id={"answer" + item.id}>{item.answer}</CardText>
                </Card>
            </Row>
        )};

    if(questions.length === 0)
    {
        return (
            <div>
                <Header pageData={"Sva pitanja"}/>
                <br/>
                <AskQuestion/>
                <br/>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <PushSpinner size={50} color="#686769" loading={hideSpinner}/>
                </div>
                <Row style={hideSpinner?{display: "none"}: {}}>
                    <Card body>
                        Nema vidljivih pitanja
                    </Card>
                </Row>
            </div>
        )
    }
    return (
        <div>
            <Header pageData={"Sva pitanja"}/>
            <br/>
            <AskQuestion/>
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

export default LoggedInHome;