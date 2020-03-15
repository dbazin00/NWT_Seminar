import React from 'react';
import {Card, CardTitle, Row} from 'reactstrap'
import 'whatwg-fetch';

import AppNav from "../components/AppNav";
import Header from "../components/header";

const About = () => {
    return (
        <div>
            <AppNav/>
            <Header pageData={"O nama"}/>
            <br/>
            <Row>
                <Card body>
                    <CardTitle>
                        Ovo je stranica na kojoj možete postaviti pitanja koja Vas zanimaju i vrlo brzo dobiti odgovore na njih. Da biste postavili pitanje, morate prethodno biti prijavljeni i registrirani!
                    </CardTitle>
                </Card>
            </Row>
        </div>);
};

export default About;
