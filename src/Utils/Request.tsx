import { useAuth } from "react-oidc-context";

const request = async (url: string, data: Object, callback: (response: any) => void) => {

  // const auth = useAuth()

  const requestOptions = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json' ,
      // 'Authorization': 'Bearer '+auth.user?.id_token
    },
    body: JSON.stringify(data)
  }
  const res = await fetch("/api"+url, requestOptions)
  switch (res.status) {
    case 401:
      //addWindow(LoginWindow, {lastRequest: {url: url, data: data, callback: callback}})
      break;

    case 200:
      callback(await res.json())
      break;
    
    default:
      alert("ERROR")
  }
};

export default request