import Cookies from "js-cookie";
import qs from "qs";

const VITE_API = import.meta.env.VITE_API_URL;

const apiFetchFile = async (endpoint, body) => {
  if (!body.token) {
    let token = Cookies.get("token");
    if (token) {
      body.append("token", token);
    }
  }
  const res = await fetch(VITE_API + endpoint, {
    method: "POST",
    body,
  });
  const json = await res.json();

  if (json.notallowed) {
    window.location.href = "/signin";
    return;
  }
  return json;
};

const apiFetchPost = async (endpoint, body, navigate) => {
  if (!body.token) {
    let token = Cookies.get("token");
    if (token) body.token = token;
  }
  const res = await fetch(VITE_API + endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();

  if (json.notAllowed) {
    navigate("/signin");
    return;
  }

  return json;
};


const apiFetchGet = async (endpoint, body = {  }, navigate) => {
  if (!body.token) {
    let token = Cookies.get("token");
    if (token) body.token = token;
  }
  console.log(`${VITE_API + endpoint}?${qs.stringify(body)}`);
  const res = await fetch(`${VITE_API + endpoint}?${qs.stringify(body)}`);

  const json = await res.json();

  if (json.notAllowed) {
    navigate("/signin");
    return;
  }

  return json;
};

const apiFetchDelete = async (endpoint, body = {}, navigate) => {
  if (!body.token) {
    let token = Cookies.get("token");
    if (token) body.token = token;
  }
  const res = await fetch(VITE_API + endpoint, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();

  if (json.notAllowed) {
    navigate("/signin");
    return;
  }

  return json;
};

const OlxApi = {
  login: async (email, password, navigate) => {
    const json = await apiFetchPost(
      "/user/signin",
      {
        email,
        password,
      },
      navigate
    );
    return json;
  },


  register: async (data, navigate) => {
    const json = await apiFetchPost(
      "/user/signup",
      {
        name: data.name,
        email: data.email,
        password: data.password,
        admUser: data.admUser,
      },
      navigate
    );
    return json;
  },

  getCategories: async (navigate) => {
    const json = await apiFetchGet("/categories", {}, navigate);
    return json.categories;
  },

  getGames: async (options, navigate) => {
    console.log(options);
    const json = await apiFetchGet("/games/list", options, navigate);
    return json;
  },
  getGame: async (id, other = false, navigate) => {
    const json = await apiFetchGet(`/game/${id}`, { id, other }, navigate);
    return json;
  },
  addGame: async (fData) => {
    const json = await apiFetchFile("/game/add", fData);
    return json;
  },
  deleteGame: async (id, navigate) => {
    const json = await apiFetchDelete(`/game/${id}`, {}, navigate);
    return json;
  },
  getUsersWithGame: async (gameId) => {
    const json = await apiFetchGet(`/games/users/${gameId}`);
    return json.userIds;
  },
  getUserByToken: async (token, navigate) => {
    const json = await apiFetchGet("/user/me", { token }, navigate);
    return json;
  },
  getUserByEmail: async (email, navigate) => {
    const json = await apiFetchGet(`/user/${email}`, navigate);
    return json;
  },
  getUserInfo: async (navigate) => {
    const json = await apiFetchGet("/user/me", {}, navigate);
    return json;
  },
  editUser: async (name, email) => {
    const json = await apiFetchPost("/user/edit", name, email);
    return json;
  },
  getUserGames: async () => {
    const json = await apiFetchGet("/usergames");
    return json;
  },
  addUserGame: async (email, gameId) => {
    const json = await apiFetchPost("/usergame/add", email, gameId);
    return json;
  }
};

export default () => OlxApi;