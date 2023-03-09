import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    supabase.auth.onAuthStateChange(async (e) => {
        if (e !== "SIGNED_OUT") {
            //FORWARD TO SUCCESS URL
            navigate("/success");
        } else {
            //forward to home
            navigate("");
        }
    });

    return (
        <div className="App">
            <header className="App-header">
                <h1>Login Page</h1>
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    theme="dark"
                    providers={["slack"]}
                />
            </header>
        </div>
    );
}

export default Login;
