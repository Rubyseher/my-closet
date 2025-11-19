// import { useState } from "react";
import { Link } from "react-router-dom"
import HeaderAppBar from "../components/HeaderAppBar"
import ResponsiveDrawer from "../components/ResponsiveDrawer"

export default function Home(){
    return(
        <div>
            {/* <HeaderAppBar/> */}
            <ResponsiveDrawer/>
            <Link to="/Trial">
            Hi
                <button> try it </button>
            </Link>
        </div>
    )
}