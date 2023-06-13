const Login = (props) => {
    const API_URL = process.env.NODE_ENV === 'production' ? 'https://onthefly-server.up.railway.app' : ''
    const AUTH_URL = `${API_URL}/auth/github`
     
    return (
        <div className="Login">
            <h1>On the Fly ✈️</h1>
            <center><a href={AUTH_URL}>
                <button className="headerBtn"> 🔒 Login via Github </button>
            </a></center>
        </div>  
    )
}

export default Login
