import React, { useState } from "react";
import { FacebookProvider, LoginButton, ShareButton } from "react-facebook";
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
    title: "Коледно-новогодишна баница 2021",
    desc: "Изтегли си късметче и хапни от топлата ни баница",
    img: "/img/banica.jpg",
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
    <FacebookProvider appId="874162999784545" language="bg_BG">
      <nav className="flex items-center justify-between flex-wrap bg-indigo-500 p-16">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <svg
            className="fill-current h-8 w-8 mr-2"
            width="54"
            height="54"
            viewBox="0 0 54 54"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
          </svg>
          <span className="font-semibold text-xl tracking-tight">Късметче</span>
        </div>
      </nav>
      {match && match.params.id2 && (
        <Helmet>
          <meta
            property="og:url"
            content={`https://kasmetche.netlify.app/${match.params.id}/${match.params.id2}`}
          />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={Selected.title} />
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
              className="w-full shadow-xl"
              src={`https://grafix.herokuapp.com/shot/${data.shid}.png`}
              alt="Sunset in the mountains"
            />
            <div className="flex justify-center">
              <ShareButton
                href={`https://kasmetche.netlify.app/${Selected.id}/${data.shid}`}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-4"
              >
                Сподели
              </ShareButton>
            </div>
          </div>
        )}
        {match && match.params.id && !data.shid && (
          <div className="flex justify-center -mt-16">
            <div className="max-w-sm rounded overflow-hidden shadow-lg shadow-xl">
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
            <div className="flex justify-center mb-3">
              <AppDetails app={app} />
            </div>
          </a>
        ))}
      </div>
    </FacebookProvider>
  );
};
export default App;
