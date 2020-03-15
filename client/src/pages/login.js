import React, {useState, useEffect} from 'react';
import { Row, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import 'whatwg-fetch';
import {Redirect, Link} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

import AppNav from "../components/AppNav";
import {SERVER_URL} from "../config";

const Login = () =>{
    const [users, setUsers] = useState([]);
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem("isLoggedIn"));

    useEffect(() => {
        const abortController = new AbortController();
        fetch(SERVER_URL + '/userData', {signal: abortController.signal})
            .then(res => res.json())
            .then(res => setUsers(res))
            .then(() => console.log("Usao u fetch"))
            .catch(error => console.error('Error connecting to server: ' + error));

        return function cleanup () {
            abortController.abort();
        }
    }, []);

    const handleButtonClick = () => {
        document.getElementById("username").value.localeCompare("") === 0?
            toast.error("Niste unijeli korisničko ime!"):
            users.some(it => it.username === document.getElementById("username").value)?
                authoriseUser():
                toast.error("Ne postoji korisnik s navedenim podacim!")

    };

    const authoriseUser = () =>
    {
        const tempUser =users[users.findIndex( it => it.username === document.getElementById("username").value)];
        if(tempUser.username === document.getElementById("username").value
            && tempUser.password === document.getElementById("examplePassword").value)
        {
            localStorage.setItem("isLoggedIn", tempUser.username);
            setLoggedIn(localStorage.getItem("isLoggedIn"));
        }
        else {
            toast.error("Pogrešna lozinka")
        }
    };

    if(loggedIn !== "false")
        return (<Redirect to="/"/>);
    else
        return(
            <div>
                <AppNav/>
                <Row style={{justifyContent: "center", alignItems: "center"}}>
                    <Form>
                        <br/>
                        <FormGroup>
                            <Label for="username">Korisničko ime</Label>
                            <Input type="text" name="username" id="username" placeholder="Korisničko ime..." />
                        </FormGroup>
                        <FormGroup>
                            <Label for="examplePassword">Lozinka</Label>
                            <Input type="password" name="password" id="examplePassword" placeholder="Lozinka..." />
                        </FormGroup>
                        <FormGroup>
                            <Button onClick={()=> handleButtonClick()}>
                                Prijava
                            </Button>
                        </FormGroup>
                        <FormGroup>
                            Ako nemaš račun, <Link to="/registration">registriraj se...</Link>
                        </FormGroup>
                    </Form>
                </Row>
                <ToastContainer/>
            </div>);};

export default Login;
