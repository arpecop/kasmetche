import React, { useState, useEffect } from "react";
import { FacebookProvider, LoginButton, Share } from "react-facebook";
import { Helmet } from "react-helmet";
import axios from "axios";
const Apps = [
  {
    id: "godini",
    title: "На колко години изглеждаш",
    desc: "Скенер на годините, провери на колко години изглеждаш",
    img: "/img/godini.jpg",
  },
  {
    id: "banica",
    title: "На колко години изглеждаш",
    desc: "Скенер на годините, провери на колко години изглеждаш",
    img: "/img/godini.jpg",
  },
];

const AppDetails = ({ app }) => {
  return (
    <>
      <div className="md:flex-shrink-0">
        <img
          className="rounded-lg md:w-56"
          src={app.img}
          alt="Woman paying for a purchase"
        />
      </div>
      <div className="mt-4 md:mt-0 md:ml-6">
        <span className="block mt-1 text-lg leading-tight font-semibold text-gray-900 hover:underline">
          {app.title}
        </span>
        <p className="mt-2 text-gray-600">{app.desc}</p>
      </div>
    </>
  );
};

const post = async (json, url) => {
  const result = await axios.post(url, JSON.stringify(json), {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return new Promise((resolve) => {
    resolve(result);
  });
};

const App = ({ match }) => {
  const [data, setData] = useState({ triggered: false });
  const Selected =
    match && Apps.filter((item) => item.id === match.params.id)[0];

  const handleResponse = async (data) => {
    setData({ triggered: true });
    const getSimilar = await post(
      {
        url: `https://s3.eu-central-1.amazonaws.com/img.rudixlab.com/apps/${
          Selected.id
        }/dev.html?${Object.entries(data.profile)
          .map((e) => e.join("="))
          .join("&")}`,
      },
      "https://grafix.herokuapp.com/shot/do"
    );
    setData(getSimilar.data);
  };

  return (
    <FacebookProvider appId="874162999784545">
      {match && match.params.id2 && (
        <Helmet>
          <meta
            property="og:url"
            content="https://www.your-domain.com/your-page.html"
          />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="" />
          <meta property="og:description" content=" " />
          <meta
            property="og:image"
            content={`https://s3.eu-central-1.amazonaws.com/img.rudixlab.com/results/${match.params.id2}.png`}
          />
          <meta property="og:image:width" content="600" />
          <meta property="og:image:height" content="315" />
        </Helmet>
      )}
      <div className="container mx-auto">
        {data.shid && (
          <div>
            <img
              className="w-full"
              src={`https://grafix.herokuapp.com/shot/${data.shid}.png`}
              alt="Sunset in the mountains"
            />
            <Share href="http://www.facebook.com">
              {({ handleClick, loading }) => (
                <button type="button" disabled={loading} onClick={handleClick}>
                  Share
                </button>
              )}
            </Share>
          </div>
        )}
        {match && match.params.id && !data.shid && (
          <div className="flex justify-center">
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
              <img
                className="w-full"
                src={Selected.img}
                alt="Sunset in the mountains"
              />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{Selected.title}</div>
                <p className="text-gray-700 text-base">{Selected.desc}</p>
              </div>
              <div className="px-6 pt-4 pb-2">
                <LoginButton
                  onCompleted={handleResponse}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Провери
                </LoginButton>
              </div>
            </div>
          </div>
        )}
        {Apps.map((app) => (
          <a className="md:flex" key={app.id} href={"/" + app.id}>
            <div className="flex justify-center">
              <AppDetails app={app} />
            </div>
          </a>
        ))}
      </div>
    </FacebookProvider>
  );
};
export default App;
