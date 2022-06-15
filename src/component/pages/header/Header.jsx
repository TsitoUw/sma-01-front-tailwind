import React, { useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getItems, getUserInfo, removeItems } from "../../../shared/utiles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { networkConfig } from "../../../shared/networkConfig";
import "./Header.css"

function Header() {
	const navigate = useNavigate();
	const currentUser = getUserInfo().user;
	const path = window.location.href

	const isLogged = () => {
		if (getItems("token") === "" || getItems("info") === "") {
			removeItems("token");
			removeItems("info");
			navigate("/login");
		}
	};
	
	useEffect(() => {
		isLogged();
	}, []);

	return (
		<nav className="navbar bg-dark sticky-top row gx-0 p-3" style={{borderBottom : "1px solid #555555", justifyContent : "space-evenly", alignItems : "center"}}>
			<div className="col-2 d-flex justify-content-center">	
				<NavLink to="/" onClick={()=>{
					if(path.split(networkConfig.front)[1] === "/"){
						window.location.reload()
					}
				}}>
					<FontAwesomeIcon icon="home" />
				</NavLink>
			</div>
			<div className="col-2 d-flex justify-content-center">
				<NavLink to="/notification" >
					<FontAwesomeIcon icon="cloud" />
				</NavLink>
			</div>
			<div className="col-2 d-flex justify-content-center">
				<NavLink to="/messages" >
					<FontAwesomeIcon icon="message" />
				</NavLink>
			</div>
			<div className="col-2 d-flex justify-content-center">
				<NavLink to="/notification" >
					<FontAwesomeIcon icon="bell" />
				</NavLink>
			</div>
			<div className="col-2 d-flex justify-content-center">
				<NavLink to="/search" >
					<FontAwesomeIcon icon="magnifying-glass" />
				</NavLink>
			</div>
			<div className="col-2 d-flex justify-content-center">
				<NavLink to={"/profil/"+currentUser._id} >
					<FontAwesomeIcon icon="user-circle" />
				</NavLink>
			</div>
		</nav>
	);
}

export default Header;
