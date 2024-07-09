import axios from "axios";
import { useEffect, useState } from "react";

type useAxiosProps = {
  url: string,
  method: 'get' | 'post' | 'put' | 'delete',
  body?: any,
  headers?: any
}

axios.defaults.baseURL = import.meta.env.API_URL;

const useAxios = ({ url, method, body = null, headers = null }: useAxiosProps) => {
  const [response, setResponse] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    axios[method](url, JSON.parse(headers), JSON.parse(body))
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [method, url, body, headers]);

  return { response, error, loading };
}

export default useAxios;