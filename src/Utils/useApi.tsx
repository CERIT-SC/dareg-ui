import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { SetStateAction, useContext, useEffect, useState } from "react"
import { AuthContext, hasAuthParams, useAuth } from "react-oidc-context"
import { useNavigate } from "react-router-dom"

const useApi = <T, >(url: string, options?: AxiosRequestConfig): any => {
    const [data, setData] = useState<T | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<AxiosError | any>()

    const auth = useAuth();

    const navigate = useNavigate();
  
    const fetchData = async () => {
      setIsLoading(true)
  
      options = {
        "headers": {
          "Authorization": "Bearer "+auth.user?.id_token,
          "Content-Type": "application/json",
        },
        ...options
      }
      console.log(options)
      if(!auth.isLoading){

        await axios("http://localhost:5000"+url, options)
        .then((response) => {
          const a = response.data
          setData(response.data)
          console.log(response.data, data)
        })
        .catch((error) => {
          console.log("Catching ERROR "+error)
          setError(error);
        }).finally(() => {
          setIsLoading(false)
        })
      }
    }
      
    useEffect(() => {
      if (options?.method === "GET"){
        fetchData();
      }
    }, [auth.isAuthenticated, !auth.isLoading])
  
    return [ data, isLoading, error, fetchData ]
  }
  
  export default useApi;