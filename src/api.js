import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: 'https://deividcuello.pythonanywhere.com'
});

// USERS
export const checkLogin = async () => {
  try {   
    const res = await axios.get("https://deividcuello.pythonanywhere.com/api/auth/user", { headers: {"Authorization" : `Bearer ${localStorage.getItem("accessToken")}`} }).then(response => {response.response.status != 401 ? response : 'console.clear()'});
  } catch (error) {
    console.clear()
    return axios.get("https://deividcuello.pythonanywhere.com/api/auth/user", { headers: {"Authorization" : `Bearer ${localStorage.getItem("accessToken")}`} })
  }
};

export const getUsers = (url_parameters = {}) => {
  if(url_parameters.email){
    return client.get(`/api/auth/users?email=${url_parameters.email}&page=${url_parameters.page}`)
} else if(url_parameters.username_search){
  return client.get(`/api/auth/users?username_search=${url_parameters.username_search}&page=${url_parameters.page}`)
} else if(url_parameters.email_search){
  return client.get(`/api/auth/users?email_search=${url_parameters.email_search}&page=${url_parameters.page}`)
} else if(url_parameters.phone_search){
  return client.get(`/api/auth/users?phone_search=${url_parameters.phone_search}&page=${url_parameters.page}`)
} else if(url_parameters.username){
  return client.get(`/api/auth/users?username=${url_parameters.username}&page=${url_parameters.page}`)
} else if(url_parameters.id){
  return client.get(`/api/auth/users?id=${url_parameters.id}&page=${url_parameters.page}`)
}
  return client.get(`/api/auth/users?page=${url_parameters.page}`);
};

export const getUser = (id) => {
  try{
    return client.get(`/api/auth/users/${id}/`);
  }
  catch(error){
    ''
  }
};

export const deleteUser = (id) => {
  return axios
    .delete(`https://deividcuello.pythonanywhere.com/api/auth/users/${id}/`)
    .then((response) => 
      window.location.reload(false)
    )
    .catch((error) => {
      console.error(error);
    });
};

// EMAIL
export const sendEmail = (url_parameters) => {
  if(url_parameters.code){
      return client.get(`/api/email/send/?subject=${url_parameters.subject}&text=${url_parameters.text}&recipient_list=${url_parameters.recipientList}&code=${url_parameters.code}`);
  }

  return client.get(`/api/email/send/?subject=${url_parameters.subject}&text=${url_parameters.text}&recipient_list=${url_parameters.recipientList}`);
}

// TOKEN
export const getToken = async (user) => {
  try {
    return axios.post('https://deividcuello.pythonanywhere.com/api/auth/token/',user);
  } catch (error) {
    console.clear()
  }
};

// PROJECTS
export const getAllProjects = (url_parameters = {}) => {
  if (url_parameters.industry && !url_parameters.pagePendings) {
    if(url_parameters.university) {
      return client.get(`/api/projects/?industry=${url_parameters.industry}&university=${url_parameters.university}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}&approved=${url_parameters.approved}&userId=${url_parameters.userId}`);
    } else if(url_parameters.investigator){
      return client.get(`/api/projects/?industry=${url_parameters.industry}&investigator=${url_parameters.investigator}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}&approved=${url_parameters.approved}&userId=${url_parameters.userId}`);
    } else if(url_parameters.start_year){
      return client.get(`/api/projects/?industry=${url_parameters.industry}&start_year=${url_parameters.start_year}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}&approved=${url_parameters.approved}&userId=${url_parameters.userId}`);
    } else if(url_parameters.end_year){
      return client.get(`/api/projects/?industry=${url_parameters.industry}&end_year=${url_parameters.end_year}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}&approved=${url_parameters.approved}&userId=${url_parameters.userId}`);
    } else if(url_parameters.association){
      return client.get(`/api/projects/?industry=${url_parameters.industry}&association=${url_parameters.association}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}&approved=${url_parameters.approved}&userId=${url_parameters.userId}`);
    } else if(url_parameters.projectName){
      return client.get(`/api/projects/?industry=${url_parameters.industry}&projectName=${url_parameters.projectName}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}&approved=${url_parameters.approved}&userId=${url_parameters.userId}`);
    } else if(url_parameters.id){
      return client.get(`/api/projects/?industry=${url_parameters.industry}&id=${url_parameters.id}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}&approved=${url_parameters.approved}&userId=${url_parameters.userId}`);
    } else if(url_parameters.keyword){
      return client.get(`/api/projects/?industry=${url_parameters.industry}&id=${url_parameters.id}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}&approved=${url_parameters.approved}&keyword=${url_parameters.keyword}&userId=${url_parameters.userId}`);
    }

    else{
      return client.get(`/api/projects/?industry=${url_parameters.industry}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}&approved=${url_parameters.approved}&userId=${url_parameters.userId}`);
    }
    
  }
  return client.get(`/api/projects/?isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}&approved=${url_parameters.approved}`);

};

export const getProject = (url_parameters = {}) => {
  if (url_parameters.slug) {
    return client.get(`/api/projects/${url_parameters.slug}`);
  }
  return client.get("/api/projects/");
};

export const deleteProject = (slug) => {
  return axios
    .delete(`https://deividcuello.pythonanywhere.com/api/projects/${slug}/`)
    .then((response) => 
      window.location.reload(false)
    )
    .catch((error) => {
      console.error(error);
    });
};

// NEWS
export const getAllNews = (url_parameters = {}) => {
  if(url_parameters.headline){
    return client.get(`/api/news/?headline=${url_parameters.headline}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
  } else if (url_parameters.created_at){
    return client.get(`/api/news/?created_at=${url_parameters.created_at}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
  } else if (url_parameters.id){
    return client.get(`/api/news/?id=${url_parameters.id}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
  }
  return client.get(`/api/news/?isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
};

export const getNews = (slug) => {
  return axios.get(`https://deividcuello.pythonanywhere.com/api/news/${slug.slug}/`);
};


export const deleteNews = (slug) => {
  return axios
    .delete(`https://deividcuello.pythonanywhere.com/api/news/${slug}/`)
    .then((response) => 
      window.location.reload(false)
    )
    .catch((error) => {
      console.error(error);
    });
};

// RESOURCES
//DOCS
export const getAllDocs = (url_parameters = {}) => {
  if(url_parameters.docTitle){
    return client.get(`/api/docs/?docTitle=${url_parameters.docTitle}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
  } else if (url_parameters.docAuthor){
    return client.get(`/api/docs/?docAuthor=${url_parameters.docAuthor}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
  } else if (url_parameters.docYear){
    return client.get(`/api/docs/?docYear=${url_parameters.docYear}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
  } else if (url_parameters.id){
    return client.get(`/api/docs/?id=${url_parameters.id}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
  }
  return client.get(`/api/docs/?isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
};

export const getDoc = (url_parameters = {}) => {
  return client.get(`/api/docs/${url_parameters.id}`);
};

export const deleteDoc = (id) => {
  return axios
    .delete(`https://deividcuello.pythonanywhere.com/api/docs/${id}/`)
    .then((response) => 
      window.location.reload(false)
    )
    .catch((error) => {
      console.error(error);
    });
};

//Centers
export const getAllCenters = (url_parameters = {}) => {
  if(url_parameters.center){
    return client.get(`/api/centers/?center=${url_parameters.center}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
  } else if(url_parameters.director){
    return client.get(`/api/centers/?director=${url_parameters.director}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
  } else if(url_parameters.phone){
    return client.get(`/api/centers/?phone=${url_parameters.phone}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
  } else if(url_parameters.id){
    return client.get(`/api/centers/?id=${url_parameters.id}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
  }
  return client.get(`/api/centers/?isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
};

export const getCenter = (url_parameters = {}) => {
  return client.get(`/api/centers/${url_parameters.id}`);
};

export const deleteCenter = (id) => {
  return axios
    .delete(`https://deividcuello.pythonanywhere.com/api/centers/${id}/`)
    .then((response) => 
      window.location.reload(false)
    )
    .catch((error) => {
      console.error(error);
    });
};

//Videos
export const getAllVideos = (url_parameters = {}) => {
  if(url_parameters.videoTitle){
    return client.get(`/api/videos/?videoTitle=${url_parameters.videoTitle}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}&isPagination=${url_parameters.isPagination}`);
  } else if(url_parameters.id){
    return client.get(`/api/videos/?id=${url_parameters.id}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}&isPagination=${url_parameters.isPagination}`);
  }
  return client.get(`/api/videos/?isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}&isPagination=${url_parameters.isPagination}`);
};

export const getVideo = (url_parameters = {}) => {
  return client.get(`/api/videos/${url_parameters.id}`);
};

export const deleteVideo = (id) => {
  return axios
    .delete(`https://deividcuello.pythonanywhere.com/api/videos/${id}/`)
    .then((response) => 
      window.location.reload(false)
    )
    .catch((error) => {
      console.error(error);
    });
};


//Videos
export const getAllRegionalAssociations = (url_parameters = {}) => {
  if(url_parameters.videoTitle){
    return client.get(`/api/regionalasociations/?videoTitle=${url_parameters.videoTitle}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}&videoRegion=${url_parameters.videoRegion}`);
  } else if(url_parameters.id){
    return client.get(`/api/regionalasociations/?id=${url_parameters.id}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}&videoRegion=${url_parameters.videoRegion}`);
  }
  return client.get(`/api/regionalasociations/?isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}&videoRegion=${url_parameters.videoRegion}`);
};

export const getRegionalAssociation = (url_parameters = {}) => {
  return client.get(`/api/regionalasociations/${url_parameters.id}`);
};

export const deleteRegionalAssociation = (id) => {
  return axios
    .delete(`https://deividcuello.pythonanywhere.com/api/regionalasociations/${id}/`)
    .then((response) => 
      window.location.reload(false)
    )
    .catch((error) => {
      console.error(error);
    });
};

//Faculty
export const getAllFaculty = (url_parameters = {}) => {
  if(url_parameters.faculty){
    return client.get(`/api/faculty/?facultyTitle=${url_parameters.faculty}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
  } else if(url_parameters.email){
    return client.get(`/api/faculty/?email=${url_parameters.email}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
  } else if(url_parameters.country){
    return client.get(`/api/faculty/?country=${url_parameters.country}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
  } else if(url_parameters.topic){
    return client.get(`/api/faculty/?topic=${url_parameters.topic}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
  } else if(url_parameters.university){
    return client.get(`/api/faculty/?university=${url_parameters.university}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
  } else if(url_parameters.id){
    return client.get(`/api/faculty/?id=${url_parameters.id}&isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
  }
  return client.get(`/api/faculty/?isAdmin=${url_parameters.isAdmin}&page=${url_parameters.page}`);
};

export const getFaculty = (url_parameters = {}) => {
  return client.get(`/api/faculty/${url_parameters.id}`);
};

export const deleteFaculty = (id) => {
  return axios
    .delete(`https://deividcuello.pythonanywhere.com/api/faculty/${id}/`)
    .then((response) => 
      window.location.reload(false)
    )
    .catch((error) => {
      console.error(error);
    });
};