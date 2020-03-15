import React, {useState} from 'react';
import {Collapse, Nav, Navbar, NavbarToggler, NavItem, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import { Link } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import logo from '../images/QandA.png';

const AppNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn"));

    const style = {
        display: "block",
        width: "100%",
        padding: "0.25rem 1.5rem",
        clear: "both",
        fontWeight: "400",
        color: "#ffffff",
        fontSize: "18px",
        textAlign: "inherit",
        whiteSpace: "nowrap",
        backgroundColor: "transparent",
        border: "0",
    };

    const toggle = () => setIsOpen(!isOpen);

    const handleLogout = () =>{
        localStorage.setItem("isLoggedIn", "false");
        setIsLoggedIn(localStorage.getItem("isLoggedIn"));
        window.location.href = "/";
        console.log(isLoggedIn)
    };

    const adminNavbar = () => {
        return (
            <Nav className="ml-auto nav" navbar>
                <NavItem><Link to="/">Vidljiva pitanja</Link></NavItem>
                <NavItem><Link to="/unansweredQuestions">Neodgovorena pitanja</Link></NavItem>
                <NavItem><Link to="/invisibleQuestions">Nevidljiva pitanja</Link></NavItem>
                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle caret nav>
                        {localStorage.getItem("isLoggedIn")}
                    </DropdownToggle>
                    <DropdownMenu tag='ul'>
                        <DropdownItem style={{style}} onClick={() => {
                            confirmAlert({
                                title: 'Odjava',
                                message: "Želite li se odjaviti",
                                buttons: [
                                    {
                                        label: 'Da',
                                        onClick: () => handleLogout()
                                    },
                                    {
                                        label: 'Ne',
                                    }
                                ],
                                closeOnEscape: true,
                                closeOnClickOutside: true,
                            })}}>
                        Odjava
                        </DropdownItem>
                        <DropdownItem href="/notification">
                            Obavijesti
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </Nav>
        );
    };

    const isLoggedInNavbar = () => {
        return (
            <Nav className="ml-auto nav" navbar>
                <NavItem><Link to="/">Sva pitanja</Link></NavItem>
                <NavItem><Link to="/myQuestions">Moja pitanja</Link></NavItem>
                <NavItem><Link to="/about">O Nama</Link></NavItem>
                <NavItem><Link to="/contact">Kontakt</Link></NavItem>
                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle caret nav>
                        {localStorage.getItem("isLoggedIn")}
                    </DropdownToggle>
                    <DropdownMenu tag='ul'>
                        <DropdownItem style={style} onClick={() => {
                            confirmAlert({
                                title: 'Odjava',
                                message: "Želite li se odjaviti",
                                buttons: [
                                    {
                                        label: 'Da',
                                        onClick: () => handleLogout()
                                    },
                                    {
                                        label: 'Ne',
                                    }
                                ],
                                closeOnEscape: true,
                                closeOnClickOutside: true,
                            })}}>
                            Odjava
                        </DropdownItem>
                        <DropdownItem href="/notification">
                            Obavijesti
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </Nav>
        );
    };

    const isLoggedOutNavbar = () => {
        return(
            <Nav className="ml-auto nav" navbar>
                <NavItem><Link to="/">Početna</Link></NavItem>
                <NavItem><Link to="/about">O Nama</Link></NavItem>
                <NavItem><Link to="/contact">Kontakt</Link></NavItem>
                <NavItem><Link to="/login">Prijava</Link></NavItem>
            </Nav>
        );
    };


    return (
        <Navbar style={{backgroundColor: '#424649', borderRadius: 0}} dark expand='lg' className='navbar-static-top'>
            <Link to="/">
                <img src={logo} alt="logo" style={{width: "100px"}}/>
            </Link>
            {console.log(isLoggedIn)}
            <NavbarToggler onClick={toggle}/>

            <Collapse isOpen={isOpen} navbar>
                {
                    isLoggedIn === "false"?
                        isLoggedOutNavbar():
                        isLoggedIn === "admin"?
                            adminNavbar():
                            isLoggedInNavbar()
                }
            </Collapse>
        </Navbar>
    );

};

export default AppNav;
