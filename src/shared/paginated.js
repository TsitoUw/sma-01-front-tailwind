import { fetchData, getUserInfo } from "./utiles";

export const paginated = async (entity = "posts", pageNumber = 1, limit = 8, sort = "desc") => {
  const res = await fetchData(`${entity}?page=${pageNumber}&limit=${limit}&sort=${sort}`, "GET", getUserInfo().token);
  console.log(res)
}
    

