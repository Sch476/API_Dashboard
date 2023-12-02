import React, { useEffect, useState } from "react";
import axios from "axios";

const TRY = () => {
  const [count, setCount] = useState([]);
  useEffect(() => {
    axios
      .get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      )
      .then((res) => setCount(res.data))
      .catch((error) => console.log("Error in fetching", error));
  }, []);

  return (
    <div>
      {count.map((post) => {
        const { id, name, email, role } = post;
        return (
          <div key={id}>
            <h2>{name}</h2>
            <h3>{email}</h3>
            <p>{role}</p>
          </div>
        );
      })}
    </div>
  );
};

export default TRY;
