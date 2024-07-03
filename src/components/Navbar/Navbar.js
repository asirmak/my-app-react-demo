import React from "react";
import { Link} from "react-router-dom";

function NavBar() {
    let userId = 5;
    return(
        <div>
            <li> <Link to="/">Home</Link></li>
            <li> <Link to={{pathname : '/users/' + userId}}>User</Link></li>
        </div>
    )

}

export default NavBar;