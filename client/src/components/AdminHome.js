import React, {useState, useEffect} from 'react';
import {
    Row,
    Card,
    CardTitle,
    CardSubtitle,
    CardText,
    Button,
    CustomInput,
    Input,
    FormGroup,
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

const AdminHome = () => {
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

     const updateQuestionArray = () => {
         fetch(SERVER_URL + '/question')
             .then(res => res.json())
             .then (res =>  setQuestions (res.filter(it => it.isVisible === true  && it.isAnswered === true).sort((edge1, edge2) => {
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
                         text: "admin je izbrisao Vaše pitanje",
                         isRead: false,
                         dateCreated: new Date(),
                         receiver: item.askedBy
                     })}))
             .catch(() => null)
     };

     const updateAnswer = (item, value) => {
         var res = document.getElementById("exampleCustomCheckbox" + item.id).checked;
         if(document.getElementById("exampleText" + item.id).value === "")
         {
             fetch(SERVER_URL + "qanda/" + item.id, {
                 method: "PUT",
                 headers: {
                     'Content-type': 'application/json',
                     'Accept': 'application/json',
                 },
                 body: JSON.stringify({
                     answer: item.answer,
                     isVisible: res
                 })
             })
                 .then(() => {
                     toast.success(
                         <div>
                             <h1>
                                 Izmijenjeno pitanje
                             </h1>
                             <ul>Pitanje: {item.question}</ul>
                             <ul>Odgovor:  {value}</ul>
                         </div>
                     )
                 })
                 .then(() => updateQuestionArray())
                 .then(() =>
                     fetch(SERVER_URL + "notification", {
                         method: "POST",
                         headers: {
                             'Content-type': 'application/json',
                             'Accept': 'application/json',
                         },
                         body: JSON.stringify({
                             text: "admin je izmijenio Vaše pitanje",
                             isRead: false,
                             dateCreated: new Date(),
                             receiver: item.askedBy
                         })}))
                 .catch(() => console.log("Nesto ne valja"))
         }
         else
             {
                 fetch(SERVER_URL + "qanda/" + item.id, {
                     method: "PUT",
                     headers: {
                         'Content-type': 'application/json',
                         'Accept': 'application/json',
                     },
                     body: JSON.stringify({
                         answer: document.getElementById("exampleText" + item.id).value,
                         isVisible: res
                     })})
                     .then(() => {
                         toast.success(
                             <div>
                                 <h1>
                                     Izmijenjeno pitanje
                                 </h1>
                                 <ul>
                                     Pitanje: {item.question}
                                 </ul>
                                 <ul>
                                     Odgovor:  {value}
                                 </ul>
                             </div>
                         )})
                     .then(() => updateQuestionArray())
                     .then(() =>
                         fetch(SERVER_URL + "notification", {
                             method: "POST",
                             headers: {
                                 'Content-type': 'application/json',
                                 'Accept': 'application/json',
                             },
                             body: JSON.stringify({
                                 text: "admin je izmijenio Vaše pitanje",
                                 isRead: false,
                                 dateCreated: new Date(),
                                 receiver: item.askedBy
                             })}))
                     .catch(() => console.log("Nesto ne valja"))
             }
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
                    <CardTitle><b style={{color:"blue"}}>{item.askedBy}: </b><b>{item.question}</b></CardTitle>
                    <CardSubtitle>{new Date(item.dateCreated).toLocaleDateString()}</CardSubtitle>
                    <CardText id={"answer" + item.id}>{item.answer}</CardText>
                    <FormGroup id={"formGroup" + item.id} style={{display: "none"}}>
                        <Input type="textarea" id={"exampleText" + item.id} placeholder={item.answer} maxLength="255"/>
                        <br/>
                        <CustomInput type="switch" id={"exampleCustomCheckbox" + item.id} label="Vidljivost" defaultChecked={item.isVisible}/>
                        <br/>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <Button onClick={() => {
                                var value;
                                document.getElementById("exampleText" + item.id).value === ""?
                                    value = item.answer:
                                    value =  document.getElementById("exampleText" + item.id).value;
                                confirmAlert({
                                    title: 'Jeste li sigurni da želite izmijeniti ovo pitanje?',
                                    message: "Pitanje: "+ item.question +
                                        ` \n Odgovor: ` + value,
                                    buttons: [
                                        {
                                            label: 'Da',
                                            onClick: () => updateAnswer(item, document.getElementById("exampleText" + item.id).value)
                                        },
                                        {
                                            label: 'Ne',
                                        }
                                    ],
                                    closeOnEscape: true,
                                    closeOnClickOutside: true,
                                });
                            }}>
                                Spremanje
                            </Button>
                            <Button onClick={() => {
                                document.getElementById("formGroup"+ item.id).style.display = "none";
                                document.getElementById("exampleText"+ item.id).value = "";
                                document.getElementById("answer"+ item.id).style.display = "block";
                                document.getElementById("exampleCustomCheckbox" + item.id).checked = document.getElementById("exampleCustomCheckbox" + item.id).defaultChecked;
                            }}>
                                Odustani
                            </Button>
                        </div>
                    </FormGroup>
                    <br/>
                    <Button onClick={() => {
                        document.getElementById("formGroup"+ item.id).style.display = "block";
                        document.getElementById("answer"+ item.id).style.display = "none";
                    }}>Uređivanje</Button>

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

    if(questions.length === 0)
    {
        return (
            <div>
                <Header pageData={"Vidljiva"}/>
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
            <Header pageData={"Vidljiva"}/>
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

export default AdminHome;