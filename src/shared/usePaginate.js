import { useEffect, useState } from "react";
import axios from "axios";
import { getUserInfo } from "./utiles";
import { networkConfig } from "./networkConfig";

export default function usePaginate(entity = "posts", pageNumber = 1, limit = 8, sort = "desc", update = 5) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [entities, setEntities] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    let cancel;
    axios({
      method: "GET",
      url: `${networkConfig.url}/${entity}?page=${pageNumber}&limit=${limit}&sort=${sort}`,
      headers: {
        Authorization: getUserInfo().token,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setEntities((prevEntities) => {
          return [...new Set([...prevEntities, ...res.data.data])];
        });
        setHasMore(Math.ceil(res.data.length / limit) > pageNumber);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(true);
        setLoading(false);
      });
    return () => cancel();
  }, [pageNumber, limit, sort, entity, update]);
  return { loading, error, entities, hasMore };
}
