import React from "react";

const Header = (props) =>
    <div style={{backgroundColor: "grey", width: "100%", height: "300px", paddingTop: "150px"}}>
        <span style={{textDecoration: "bold", fontSize: "50px", display: "flex", flexDirection: "column", alignItems: "center", color: "white"}}>
            {props.pageData}
        </span>
    </div>;

export default Header;