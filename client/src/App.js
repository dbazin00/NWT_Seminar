import React from 'react';
import 'whatwg-fetch';

import {BrowserRouter as Router,
    Route
} from "react-router-dom";

import About from "./pages/about";
import Login from "./pages/login";
import Home from "./pages/home";
import Contact from "./pages/contact";
import UnansweredQuestions from "./pages/unansweredQuestions.";
import InvisibleQuestions from "./pages/invisibleQuestions";
import MyQuestions from "./pages/myQuestions";
import Registration from "./pages/registration";
import Notification from "./pages/notification";

const App = () => {
    if (localStorage.getItem("isLoggedIn") === null) {
        localStorage.setItem("isLoggedIn", "false");
    }

    return (
           <Router>
               <Route exact path="/" component={Home}/>
               <Route exact path="/about" component={About}/>
               <Route exact path="/login" component={Login}/>
               <Route exact path="/contact" component={Contact}/>
               <Route exact path="/unansweredQuestions" component={UnansweredQuestions}/>
               <Route exact path="/invisibleQuestions" component={InvisibleQuestions}/>
               <Route exact path="/myQuestions" component={MyQuestions}/>
               <Route exact path="/registration" component={Registration}/>
               <Route exact path="/notification" component={Notification}/>
           </Router>
       )
};

export default App;
