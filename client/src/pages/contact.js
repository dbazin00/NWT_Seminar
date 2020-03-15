import React from "react";

import {Card, Row, CardTitle} from "reactstrap";

import AppNav from "../components/AppNav";
import Header from "../components/header";

const Contact = () =>
    <div>
        <AppNav/>
        <Header pageData={"Kontakt"}/>
        <br/>
        <Row>
            <Card body>
                <CardTitle>
                    xxxxxxx, 21 000 Split
                </CardTitle>
                <CardTitle>
                    xxxxxxx@fesb.hr
                </CardTitle>
                <CardTitle>
                    09x/xxxxxxx
                </CardTitle>
                <CardTitle>
                    021/xxx-xxx
                </CardTitle>
            </Card>
        </Row>
    </div>;
export default Contact;