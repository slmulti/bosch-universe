import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

function Success() {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    let userId;

    useEffect(() => {
        async function getUserData() {
            await supabase.auth.getUser().then((value) => {
                if (value.data?.user) {
                    // console.log(value.data.user);
                    setUser(value.data.user);
                    // userId = value.data.user.id;
                    // console.log(userId);
                    // const x = supabase.auth.user();
                    // console.log(x);
                }
            });
        }
        getUserData();
    }, []);

    async function signOutUser() {
        const { error } = await supabase.auth.signOut();
        navigate("/");
    }

    return (
        <div className="App">
            <header className="App-header">
                {Object.keys(user).length !== 0 ? (
                    <>
                        <h1>Success Page</h1>
                        <p>Welcome user: </p>
                        <button onClick={() => signOutUser()}>Sign Out</button>
                    </>
                ) : (
                    <>
                        <h1>User Not logged in!</h1>
                        <button
                            onClick={() => {
                                navigate("/login");
                            }}
                        >
                            Go to login
                        </button>
                    </>
                )}
            </header>
        </div>
    );
}

export default Success;
