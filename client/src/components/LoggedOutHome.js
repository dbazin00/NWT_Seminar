import React, {useState, useEffect} from 'react';
import {
    Row,
    Card,
    CardTitle,
    CardSubtitle,
    CardText,
    PaginationItem,
    PaginationLink,
    Pagination
} from 'reactstrap';
import { PushSpinner } from "react-spinners-kit";

import { SERVER_URL} from '../config';
import Header from "./header";
import 'whatwg-fetch';

const LoggedOutHome = () => {
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
                    <CardTitle><b style={{color:"blue"}}>{item.askedBy}: </b><b>{item.question}</b></CardTitle>
                    <CardSubtitle>{new Date(item.dateCreated).toLocaleDateString()}</CardSubtitle>
                    <CardText id={"answer" + item.id}>{item.answer}</CardText>
                </Card>
            </Row>
        )};

    if(questions.length === 0)
    {
        return (
            <div>
                <Header pageData={"Q&A"}/>
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
            <Header pageData={"Q&A"}/>
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
        </div>
    );
};

export default LoggedOutHome;