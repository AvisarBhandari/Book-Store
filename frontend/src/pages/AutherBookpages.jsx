import React from "react";

function AutherBookpages() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  return (
    <div>
      AutherBookpages
      <p>{id}</p>
    </div>
  );
}

export default AutherBookpages;
