import React from 'react';
import 'whatwg-fetch';
import LoggedInHome from "../components/LoggedInHome";
import LoggedOutHome from "../components/LoggedOutHome";
import AdminHome from "../components/AdminHome";
import AppNav from "../components/AppNav";

const Home = () =>
    <div>
        <AppNav/>
        {
            localStorage.getItem("isLoggedIn") === "false"?
                <LoggedOutHome/>:
                localStorage.getItem("isLoggedIn") === "admin"?
                    <AdminHome/>:
                    <LoggedInHome/>
        }

    </div>;

export default Home;
