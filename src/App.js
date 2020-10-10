import React, { useState } from "react";
import "./App.css";
import debounce from "./utils/debounce";

function App() {
    const [data, setData] = useState([]);
    const [message, setMessage] = useState(null);

    const debounceOnChange = React.useCallback(debounce(onChange, 400), []);

    function onChange(value) {
        if (value.trim() === "") return;
        fetch(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.REACT_APP_GIPHY_KEY}&q=${value}&limit=${5}`)
            .then((response) => response.json())
            .then((response) => {
                const { data } = response;
                if (data.length !== 0) {
                    setData(data);
                    setMessage(null);
                } else {
                    setMessage("Nothing Found with this query");
                }
            })
            .catch((err) => setMessage(err.message));
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}>
            {message && <h4>{message}</h4>}
            <div class="dropdown dropdown-scroll">
                <div class="input-group input-group-sm search-control">
                    <input
                        type="text"
                        class="form-control"
                        placeholder="Search"
                        onChange={(e) => {
                            setData([]);
                            debounceOnChange(e.target.value);
                        }}
                    />
                </div>
                <ul class="dropdown-list">
                    {data.map((item) => {
                        return (
                            <li role="presentation">
                                <a href={item.images.fixed_height.url}>{item.title || item.slug}</a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default App;
