const GetToken = () => {
    const token = localStorage.getItem('token');
    if (token)
        return token;
    else
        return '';
}

export default GetToken;