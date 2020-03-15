import React, {useEffect, useState} from 'react';
import { Row, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import 'whatwg-fetch';
import {Redirect, Link} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

import AppNav from "../components/AppNav";
import {SERVER_URL} from "../config";

const Registration = () =>{

    const [users, setUsers] = useState([]);

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
        if(document.getElementById("username").value.localeCompare("") === 0
            && document.getElementById("examplePassword").value.localeCompare("") === 0)
        {
            toast.error("Morate upisati korisničko ime i lozinku")

        }
        else
        {
            users.some(it => it.username === document.getElementById("username").value)?
                toast.error("Već postoji korisnik s navedenim korisničkim imenom!"):
                document.getElementById("examplePassword").value.localeCompare("") === 0?
                    toast.error("Morate upisati lozinku!"):
                    addNewUser()

        }
    };

    const addNewUser = () => {
        fetch(SERVER_URL + "users", {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                username: document.getElementById("username").value,
                password: document.getElementById("examplePassword").value
            })
        })
            .then(() => toast.success("Uspješno ste registrirani"))
            .then(() => document.getElementById("username").value = "")
            .then(() => document.getElementById("examplePassword").value = "")
            .catch(()=> toast.error("Nesto ne valja"))
    };

    if( localStorage.getItem("isLoggedIn")!== "false")
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
                                Registracija
                            </Button>
                        </FormGroup>
                        <FormGroup>
                            Povratak na <Link to="/login">prijavu</Link>
                        </FormGroup>
                    </Form>
                </Row>
                <ToastContainer/>
            </div>);};

export default Registration;
