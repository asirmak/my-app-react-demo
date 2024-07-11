export const PostWithAuth = (url, body) => {

    const baseUrl = process.env.REACT_APP_BASE_URL;
    
    var request = fetch(baseUrl+url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("tokenKey"),
        },
        body: JSON.stringify(body),
    })

    return request
}


export const PostWithoutAuth = (url, body) => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    var request = fetch(baseUrl+url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })

    return request
}

export const PutWithAuth = (url, body) => {
    const baseUrl = process.env.REACT_APP_BASE_URL;

    var request = fetch(baseUrl+url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("tokenKey"),
        },
        body: JSON.stringify(body),
    })

    return request
}

export const GetWithAuth = (url) => {
    const baseUrl = process.env.REACT_APP_BASE_URL;

    var request = fetch(baseUrl+url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("tokenKey"),
        }
    })

    return request
}


export const DeleteWithAuth = (url) => {
    const baseUrl = process.env.REACT_APP_BASE_URL;

    var request = fetch(baseUrl+url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("tokenKey"),
        },
    })

    return request
}

export const RefreshToken = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  var request = fetch(baseUrl+"/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: +localStorage.getItem("currentUser"),
      refreshToken: localStorage.getItem("refreshKey"),
    }),
  })

  return request

}